"""Create or update the one Admin account.

Run from the project root:
  .venv/bin/python -m backend.seed_admin

Reads ADMIN_EMAIL from .env (defaults to contact.ing.wissem@gmail.com).
Prompts for a password interactively (hidden input), or set ADMIN_PASSWORD
in the environment to run non-interactively (e.g. in a deploy script).
"""
import getpass
import os

from sqlmodel import Session, select

from backend.auth import ADMIN_EMAIL, hash_password
from backend.db import engine
from backend.models import User


def main():
    password = os.environ.get("ADMIN_PASSWORD")
    if not password:
        password = getpass.getpass(f"Password for admin account ({ADMIN_EMAIL}): ")
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Passwords did not match.")
            return
    if len(password) < 8:
        print("Password must be at least 8 characters.")
        return

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == ADMIN_EMAIL)).first()
        if user:
            user.password_hash = hash_password(password)
            user.role = "Admin"
            user.status = "active"
            print(f"Updated existing admin account: {ADMIN_EMAIL}")
        else:
            user = User(
                name=os.environ.get("ADMIN_NAME", "Admin"),
                email=ADMIN_EMAIL,
                password_hash=hash_password(password),
                role="Admin",
                status="active",
            )
            print(f"Created admin account: {ADMIN_EMAIL}")
        session.add(user)
        session.commit()


if __name__ == "__main__":
    main()
