from datetime import date, datetime, timezone

from pydantic import field_validator
from sqlmodel import Field, SQLModel


class ClientBase(SQLModel):
    given_name: str = Field(max_length=100)
    surname: str = Field(max_length=100)
    passport_number: str = Field(max_length=30, unique=True, index=True)
    country: str | None = Field(default=None, max_length=100)
    nationality: str | None = Field(default=None, max_length=100)
    type: str | None = Field(default=None, max_length=10)
    sex: str | None = Field(default=None, max_length=10)
    date_of_birth: date | None = None
    place_of_birth: str | None = Field(default=None, max_length=100)
    date_of_issue: date | None = None
    date_of_expiry: date | None = None
    issued_by: str | None = Field(default=None, max_length=100)


class Client(ClientBase, table=True):
    __tablename__ = "clients"

    id: int | None = Field(default=None, primary_key=True)
    photo_path: str | None = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ClientCreate(ClientBase):
    """Body of POST /clients, as sent by the Scan page."""

    user_photo: str | None = None  # data:image/...;base64,... from /extract

    @field_validator("*", mode="before")
    @classmethod
    def blank_to_none(cls, v):
        if isinstance(v, str):
            v = v.strip()
            return v or None
        return v

    @field_validator("passport_number")
    @classmethod
    def normalize_passport(cls, v):
        return v.upper() if v else v
