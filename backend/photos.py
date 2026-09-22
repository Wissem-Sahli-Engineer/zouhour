import base64
import binascii
import io

from PIL import Image

from backend.db import ROOT_DIR

UPLOADS_DIR = ROOT_DIR / "uploads"
CLIENT_PHOTOS = "clients"


def save_client_photo(client_id: int, data_url: str) -> str:
    """Decode a data:image/...;base64 URL, store it as JPEG, return its path relative to UPLOADS_DIR."""
    if not data_url.startswith("data:image/") or "," not in data_url:
        raise ValueError("user_photo must be a base64 image data URL")
    try:
        raw = base64.b64decode(data_url.split(",", 1)[1], validate=True)
        img = Image.open(io.BytesIO(raw))
        img.load()
    except (binascii.Error, OSError) as e:
        raise ValueError("user_photo is not a valid image") from e

    rel_path = f"{CLIENT_PHOTOS}/{client_id}.jpg"
    target = UPLOADS_DIR / rel_path
    target.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(target, format="JPEG", quality=90)
    return rel_path


def delete_photo(rel_path: str | None) -> None:
    if rel_path:
        (UPLOADS_DIR / rel_path).unlink(missing_ok=True)
