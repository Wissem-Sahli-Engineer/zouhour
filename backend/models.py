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

    # Contact & business info
    phone: str | None = Field(default=None, max_length=30)
    email: str | None = Field(default=None, max_length=150)
    entreprise_name: str | None = Field(default=None, max_length=150)
    code_fiscal: str | None = Field(default=None, max_length=50)

    # Visa / relation
    visa_status: str | None = Field(default=None, max_length=50)
    visa_type: str | None = Field(default=None, max_length=50)
    client_relation: str | None = Field(default=None, max_length=50)

    # Billing
    prix_dossier: float | None = None
    paiement_type: str | None = Field(default=None, max_length=50)
    currency: str | None = Field(default=None, max_length=10)


class Client(ClientBase, table=True):
    __tablename__ = "clients"

    id: int | None = Field(default=None, primary_key=True)
    photo_path: str | None = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ClientCreate(ClientBase):
    """Body of POST /clients, as sent by the Add client page."""

    user_photo: str | None = None  # data:image/...;base64,... manually uploaded client photo

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


class ClientFile(SQLModel, table=True):
    __tablename__ = "client_files"

    id: int | None = Field(default=None, primary_key=True)
    client_id: int = Field(foreign_key="clients.id", index=True)
    filename: str = Field(max_length=255)
    path: str = Field(max_length=255)
    content_type: str | None = Field(default=None, max_length=100)
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TreasuryEntryBase(SQLModel):
    country: str = Field(max_length=20, index=True)
    kind: str = Field(max_length=10)  # "spending" | "gathering"
    product_name: str = Field(max_length=150)
    price: float
    entry_date: date
    recorded_by: str | None = Field(default=None, max_length=100)  # who wrote the entry
    counterparty: str | None = Field(default=None, max_length=150)  # who they dealt with


class TreasuryEntry(TreasuryEntryBase, table=True):
    __tablename__ = "treasury_entries"

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TreasuryEntryCreate(TreasuryEntryBase):
    pass


class BankAccount(SQLModel, table=True):
    __tablename__ = "bank_accounts"

    id: int | None = Field(default=None, primary_key=True)
    country: str = Field(max_length=20, index=True)
    name: str = Field(max_length=150)
    currency: str = Field(max_length=10)
    balance: float = 0


class BankTransactionBase(SQLModel):
    account_id: int = Field(foreign_key="bank_accounts.id", index=True)
    label: str = Field(max_length=150)
    amount: float  # positive = deposit, negative = withdrawal
    entry_date: date


class BankTransaction(BankTransactionBase, table=True):
    __tablename__ = "bank_transactions"

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BankTransactionCreate(BankTransactionBase):
    pass


class InvoiceItem(SQLModel):
    designation: str
    quantity: float
    unit_price: float


class InvoiceBase(SQLModel):
    country: str = Field(max_length=20, index=True)
    doc_type: str = Field(max_length=10)  # "facture" | "recu"
    client_id: int | None = Field(default=None, foreign_key="clients.id")
    client_name: str = Field(max_length=150)
    client_passport: str | None = Field(default=None, max_length=30)
    client_mf: str | None = Field(default=None, max_length=50)  # matricule fiscal
    company_name: str | None = Field(default=None, max_length=150)
    service_type: str | None = Field(default=None, max_length=100)  # recu only
    issue_date: date
    tva_rate: float = 0.19
    timbre: float = 1
    amount_paid: float = 0
    items_json: str = "[]"  # JSON-encoded list[InvoiceItem]; facture only


class Invoice(InvoiceBase, table=True):
    __tablename__ = "invoices"

    id: int | None = Field(default=None, primary_key=True)
    number: str = Field(max_length=30, unique=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InvoiceCreate(InvoiceBase):
    items: list[InvoiceItem] = []


class AgencyRequestBase(SQLModel):
    name: str = Field(max_length=150)
    description: str
    submitted_date: date
    status: str = Field(default="pending", max_length=20)  # pending | approved | rejected


class AgencyRequest(AgencyRequestBase, table=True):
    __tablename__ = "agency_requests"

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AgencyRequestCreate(AgencyRequestBase):
    pass


class EmployeeRequestBase(SQLModel):
    category: str = Field(max_length=30)  # vacations | salary-advances | loans
    employee_name: str = Field(max_length=150)
    detail: str
    submitted_date: date
    status: str = Field(default="pending", max_length=20)


class EmployeeRequest(EmployeeRequestBase, table=True):
    __tablename__ = "employee_requests"

    id: int | None = Field(default=None, primary_key=True)
    # Whoever submitted it — set from the authenticated session, never trusted
    # from the client. Non-admins only ever see their own rows; this is what
    # makes the request private between that agent and the admin.
    user_email: str = Field(default="", max_length=200, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EmployeeRequestCreate(EmployeeRequestBase):
    pass


class PayslipBase(SQLModel):
    employee_name: str = Field(max_length=150)
    period_label: str = Field(max_length=50)  # e.g. "September 2026"
    hours: float
    hourly_rate: float
    currency: str = Field(default="TND", max_length=10)


class Payslip(PayslipBase, table=True):
    __tablename__ = "payslips"

    id: int | None = Field(default=None, primary_key=True)
    gross_total: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PayslipCreate(PayslipBase):
    pass


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=150)
    email: str = Field(max_length=200, unique=True, index=True)
    password_hash: str = Field(max_length=200)
    role: str = Field(default="Agent", max_length=20)  # "Admin" | "Agent"
    status: str = Field(default="pending", max_length=20)  # "pending" | "active" | "rejected"
    confirmation_token: str | None = Field(default=None, max_length=100, index=True)
    confirmation_expires: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
