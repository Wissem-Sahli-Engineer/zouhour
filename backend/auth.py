"""Authentication: password hashing, JWT sessions, signup-approval emails.

Everything auth-related lives here, separate from the rest of the API.
"""
import os
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select

from backend.db import get_session
from backend.models import User

# ---------------------------------------------------------------------------
# Configuration (all from environment — nothing secret is hardcoded)
# ---------------------------------------------------------------------------

JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is not set. Add a long random value to .env, e.g.:\n"
        "  python3 -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_HOURS = int(os.environ.get("JWT_EXPIRES_HOURS", "12"))

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "contact.ing.wissem@gmail.com")
APP_BASE_URL = os.environ.get("APP_BASE_URL", "http://localhost:5173")
PUBLIC_API_BASE_URL = os.environ.get("PUBLIC_API_BASE_URL", "http://localhost:8001")

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER or "no-reply@tca-erp.local")

CONFIRMATION_EXPIRES_HOURS = 72


# ---------------------------------------------------------------------------
# Passwords
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


# ---------------------------------------------------------------------------
# JWT sessions
# ---------------------------------------------------------------------------

def create_access_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired session")


_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    session: Session = Depends(get_session),
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    user = session.get(User, int(payload["sub"]))
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------------------------------------------------------------------
# Signup-confirmation email
# ---------------------------------------------------------------------------

def new_confirmation_token() -> tuple[str, datetime]:
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=CONFIRMATION_EXPIRES_HOURS)
    return token, expires


def send_signup_request_email(user: User, token: str) -> None:
    confirm_url = f"{PUBLIC_API_BASE_URL}/auth/confirm/{token}"
    reject_url = f"{PUBLIC_API_BASE_URL}/auth/reject/{token}"

    body = (
        f"A new account request was submitted on {APP_BASE_URL}\n\n"
        f"Name:  {user.name}\n"
        f"Email: {user.email}\n\n"
        f"Approve:  {confirm_url}\n"
        f"Reject:   {reject_url}\n\n"
        f"This link expires in {CONFIRMATION_EXPIRES_HOURS} hours."
    )

    msg = EmailMessage()
    msg["Subject"] = f"New account request: {user.email}"
    msg["From"] = SMTP_FROM
    msg["To"] = ADMIN_EMAIL
    msg.set_content(body)

    if not SMTP_HOST:
        # No SMTP configured (e.g. local dev) — log instead of failing the signup.
        print("\n[auth] SMTP not configured — signup approval email below:\n")
        print(body)
        print()
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        if SMTP_USER and SMTP_PASSWORD:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


def user_out(user: User) -> dict:
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "status": user.status}
