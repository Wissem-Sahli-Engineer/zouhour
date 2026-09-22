"""One-time import of the old clients.json into PostgreSQL.

Run from the project root:  .venv/bin/python -m backend.import_clients_json
Safe to re-run: clients whose passport number is already in the database are skipped.
"""
import json
from datetime import datetime

from pydantic import ValidationError
from sqlalchemy import text
from sqlmodel import Session, select

from backend.db import ROOT_DIR, engine
from backend.models import Client, ClientCreate
from backend.photos import save_client_photo

JSON_FILE = ROOT_DIR / "clients.json"


def pick_best(records):
    """Among records with the same passport, prefer one with a photo, then the most recent."""
    return max(records, key=lambda r: (bool(r.get("user_photo")), r.get("created_at", "")))


def main():
    rows = json.loads(JSON_FILE.read_text(encoding="utf-8"))
    by_passport = {}
    for r in rows:
        key = (r.get("passport_number") or "").strip().upper()
        by_passport.setdefault(key, []).append(r)

    imported, skipped = 0, 0
    with Session(engine) as session:
        existing = set(session.exec(select(Client.passport_number)).all())
        used_ids = set(session.exec(select(Client.id)).all())

        for passport, records in by_passport.items():
            if len(records) > 1:
                print(f"{passport}: {len(records)} duplicates in JSON, keeping one")
            record = pick_best(records)
            try:
                data = ClientCreate.model_validate(record)
            except ValidationError as e:
                print(f"SKIP invalid record {record.get('id')}: {e.errors()[0]['msg']}")
                skipped += 1
                continue
            if data.passport_number in existing:
                print(f"SKIP {data.passport_number}: already in database")
                skipped += 1
                continue

            client = Client.model_validate(data.model_dump(exclude={"user_photo"}))
            old_id = record.get("id")
            if isinstance(old_id, int) and old_id not in used_ids:
                client.id = old_id  # keep old ids so existing /clients/<id> links still work
            if record.get("created_at"):
                try:
                    client.created_at = datetime.strptime(record["created_at"], "%Y-%m-%d %H:%M").astimezone()
                except ValueError:
                    pass
            session.add(client)
            session.flush()
            used_ids.add(client.id)
            if data.user_photo:
                client.photo_path = save_client_photo(client.id, data.user_photo)
            existing.add(data.passport_number)
            imported += 1
            print(f"OK   #{client.id} {client.given_name} {client.surname} ({client.passport_number})")

        # move the id counter past any ids we set by hand
        session.execute(text("SELECT setval('clients_id_seq', COALESCE((SELECT MAX(id) FROM clients), 0) + 1, false)"))
        session.commit()

    print(f"\nImported {imported}, skipped {skipped}.")


if __name__ == "__main__":
    main()
