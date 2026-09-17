from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import base64
import json
import re
import requests
import traceback

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

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.
Do not invent information.

Use exactly these keys:

{json.dumps(FIELDS, indent=2)}

If something cannot be read, use an empty string.

Dates must use YYYY-MM-DD format.

Return JSON only.
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

        # Extract JSON object from model response (handles markdown fences, preambles, and postscripts)
        json_match = re.search(r"\{.*\}", model_output, re.DOTALL)
        if json_match:
            clean_json_str = json_match.group(0)
        else:
            clean_json_str = model_output

        try:
            extracted = json.loads(clean_json_str)
        except json.JSONDecodeError:
            print("Failed to parse JSON from output:", clean_json_str)
            extracted = {}

        def normalize_date(val):
            if not val or not isinstance(val, str):
                return ""
            val = val.strip()
            # If matches YYYY-MM-DD
            if re.match(r"^\d{4}-\d{2}-\d{2}$", val):
                return val
            # Match DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
            m = re.match(r"^(\d{2})[/.-](\d{2})[/.-](\d{4})$", val)
            if m:
                return f"{m.group(3)}-{m.group(2)}-{m.group(1)}"
            # Match YYYY/MM/DD or YYYY.MM.DD
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
            if field in date_fields:
                val = normalize_date(val)
            final_data[field] = val

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
    uvicorn.run("backend:app", host="0.0.0.0", port=8001, reload=True)

