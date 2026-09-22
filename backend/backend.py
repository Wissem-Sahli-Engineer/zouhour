from fastapi import Depends, FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

import base64
import json
import os
import re
import requests
import traceback

from backend.db import get_session
from backend.models import Client, ClientCreate
from backend.photos import UPLOADS_DIR, delete_photo, save_client_photo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QWEN_API_URL = "http://localhost:11434/v1/chat/completions"

FIELDS = [
    "country",
    "passport_number",
    "type",
    "nationality",
    "given_name",
    "surname",
    "date_of_birth",
    "sex",
    "place_of_birth",
    "date_of_issue",
    "date_of_expiry",
    "issued_by"
]

# Path the browser uses to reach this API (Vite proxies /api -> :8001 and strips the prefix)
PUBLIC_API_PREFIX = os.getenv("PUBLIC_API_PREFIX", "/api")


def client_out(client: Client) -> dict:
    data = client.model_dump(exclude={"photo_path"})
    data["user_photo"] = (
        f"{PUBLIC_API_PREFIX}/clients/{client.id}/photo" if client.photo_path else ""
    )
    return data


@app.get("/clients")
def get_clients(session: Session = Depends(get_session)):
    clients = session.exec(select(Client).order_by(Client.id)).all()
    return [client_out(c) for c in clients]


@app.get("/clients/{client_id}/photo")
def get_client_photo(client_id: int, session: Session = Depends(get_session)):
    client = session.get(Client, client_id)
    if not client or not client.photo_path:
        raise HTTPException(status_code=404, detail="Photo not found")
    path = UPLOADS_DIR / client.photo_path
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Photo not found")
    return FileResponse(path, media_type="image/jpeg")


@app.post("/clients", status_code=201)
def add_client(data: ClientCreate, session: Session = Depends(get_session)):
    client = Client.model_validate(data.model_dump(exclude={"user_photo"}))
    session.add(client)
    photo_path = None
    try:
        session.flush()  # assigns client.id
        if data.user_photo:
            photo_path = save_client_photo(client.id, data.user_photo)
            client.photo_path = photo_path
        session.commit()
    except IntegrityError:
        session.rollback()
        delete_photo(photo_path)
        raise HTTPException(
            status_code=409,
            detail=f"A client with passport number {data.passport_number} already exists",
        )
    except ValueError as e:
        session.rollback()
        raise HTTPException(status_code=422, detail=str(e))
    session.refresh(client)
    return {"status": "success", "client": client_out(client)}


@app.delete("/clients/{client_id}")
def delete_client(client_id: int, session: Session = Depends(get_session)):
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    photo_path = client.photo_path
    session.delete(client)
    session.commit()
    delete_photo(photo_path)
    return {"status": "success"}

@app.post("/signup-request")
async def signup_request(data: dict):
    print("Signup request received:", data)
    return {"status": "success", "message": "Signup request recorded"}


@app.post("/extract")
async def extract_passport(file: UploadFile = File(...)):

    print("\n==============================")
    print("EXTRACTION REQUEST")
    print("==============================")

    try:

        print("Filename:", file.filename)
        print("Content type:", file.content_type)

        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Please upload an image."
            )

        image_bytes = await file.read()

        print("Image size:", len(image_bytes), "bytes")

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        prompt = f"""
Extract the information from this passport image. 

Also locate the passport owner's portrait photograph and return its bounding box as normalized integers on a 0 to 1000 scale in exact format [ymin, xmin, ymax, xmax].

IMPORTANT INSTRUCTIONS:
1. Return ONLY a single valid JSON object starting with {{ and ending with }}.
2. Provide all text values strictly in English (Latin characters only). Do NOT include secondary languages, Arabic, or slash translation values (e.g. use "Male" or "M" instead of "M / ذكر", use "Tunis" instead of "Tunis / تونس").
3. Do not include markdown code block formatting, backticks, or extra text.
4. Do not invent information.

Use exactly these keys:

{json.dumps(FIELDS + ["photo_bbox"], indent=2)}

`photo_bbox`: [ymin, xmin, ymax, xmax] normalized integers from 0 to 1000 for the portrait photo of the passport holder (top-left y, top-left x, bottom-right y, bottom-right x). Example: [150, 40, 650, 350]. If not found, use [].

If a text field cannot be read, use an empty string.

Dates must use YYYY-MM-DD format.
"""

        payload = {
            "model": "qwen2.5vl:3b-8k",

            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{file.content_type};base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],

            "temperature": 0,
            "max_tokens": 1000
        }

        print("\nSending request to:")
        print(QWEN_API_URL)

        response = requests.post(
            QWEN_API_URL,
            json=payload,
            timeout=120
        )

        print("\nQWEN STATUS:", response.status_code)
        print("\nQWEN RESPONSE:")
        print(response.text[:5000])

        response.raise_for_status()

        result = response.json()

        model_output = result["choices"][0]["message"]["content"]

        print("\nMODEL OUTPUT:")
        print(model_output)

        # Remove markdown code blocks if present
        cleaned_output = re.sub(r"```(?:json)?", "", model_output).strip()

        # Fix invalid model JSON output where model uses [ ... ] with key:value pairs instead of { ... }
        if cleaned_output.startswith("[") and cleaned_output.endswith("]"):
            cleaned_output = "{" + cleaned_output[1:-1] + "}"

        try:
            extracted = json.loads(cleaned_output)
        except json.JSONDecodeError:
            try:
                json_match = re.search(r"\{.*\}", cleaned_output, re.DOTALL)
                clean_json_str = json_match.group(0) if json_match else cleaned_output
                extracted = json.loads(clean_json_str)
            except json.JSONDecodeError:
                print("Failed to parse JSON from output:", cleaned_output)
                extracted = {}

        def clean_language(val):
            if not val or not isinstance(val, str):
                return ""
            val = val.strip()
            # If value contains slashes (e.g. "M / ذكر" or "Tunis / تونس"), keep the first English/Latin part
            if "/" in val:
                parts = [p.strip() for p in val.split("/")]
                for p in parts:
                    if re.search(r"[a-zA-Z0-9]", p):
                        return p
                return parts[0]
            return val

        def normalize_date(val):
            if not val or not isinstance(val, str):
                return ""
            val = val.strip()
            if re.match(r"^\d{4}-\d{2}-\d{2}$", val):
                return val
            m = re.match(r"^(\d{2})[/.-](\d{2})[/.-](\d{4})$", val)
            if m:
                return f"{m.group(3)}-{m.group(2)}-{m.group(1)}"
            m = re.match(r"^(\d{4})[/.-](\d{2})[/.-](\d{2})$", val)
            if m:
                return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            return val

        date_fields = {"date_of_birth", "date_of_issue", "date_of_expiry"}
        final_data = {}

        for field in FIELDS:
            val = extracted.get(field, "")
            if val is None:
                val = ""
            val = str(val).strip()
            val = clean_language(val)
            if field in date_fields:
                val = normalize_date(val)
            final_data[field] = val

        # Crop owner photo using returned bounding box
        user_photo_b64 = ""
        bbox = extracted.get("photo_bbox")
        if bbox and isinstance(bbox, list) and len(bbox) == 4:
            try:
                from PIL import Image
                import io

                img = Image.open(io.BytesIO(image_bytes))
                width, height = img.size
                c1, c2, c3, c4 = bbox

                # Determine scale and format
                if max(c1, c2, c3, c4) <= 1.0:
                    ymin, xmin, ymax, xmax = int(c1 * height), int(c2 * width), int(c3 * height), int(c4 * width)
                elif max(c1, c2, c3, c4) <= 1000 and max(c3, c4) <= 1000 and (width > 1000 or height > 1000):
                    ymin = int(c1 * height / 1000.0)
                    xmin = int(c2 * width / 1000.0)
                    ymax = int(c3 * height / 1000.0)
                    xmax = int(c4 * width / 1000.0)
                else:
                    ymin, xmin, ymax, xmax = int(c1), int(c2), int(c3), int(c4)

                # Ensure min < max
                if ymin > ymax:
                    ymin, ymax = ymax, ymin
                if xmin > xmax:
                    xmin, xmax = xmax, xmin

                # Clamp values
                xmin, xmax = max(0, min(xmin, width)), max(0, min(xmax, width))
                ymin, ymax = max(0, min(ymin, height)), max(0, min(ymax, height))

                print(f"Calculated Crop Bounding Box: xmin={xmin}, ymin={ymin}, xmax={xmax}, ymax={ymax} (Image: {width}x{height})")

                if xmax > xmin and ymax > ymin:
                    cropped = img.crop((xmin, ymin, xmax, ymax))
                    buffered = io.BytesIO()
                    cropped.save(buffered, format="JPEG")
                    cropped_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    user_photo_b64 = f"data:image/jpeg;base64,{cropped_b64}"
            except Exception as crop_err:
                print("Error cropping passport photo:", crop_err)

        final_data["user_photo"] = user_photo_b64

        print("\nFINAL DATA:")
        print(json.dumps(final_data, indent=2))

        return final_data

    except HTTPException:
        raise

    except Exception as e:

        print("\n!!!!!!!!!!!!!!!!!!!!!!!!")
        print("ERROR")
        print("!!!!!!!!!!!!!!!!!!!!!!!!")

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.backend:app", host="0.0.0.0", port=8001, reload=True)  # run from the project root

