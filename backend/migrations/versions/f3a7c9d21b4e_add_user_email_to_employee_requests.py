"""add user_email to employee_requests

Revision ID: f3a7c9d21b4e
Revises: 08b8edfa8db6
Create Date: 2026-09-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'f3a7c9d21b4e'
down_revision: Union[str, Sequence[str], None] = '08b8edfa8db6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'employee_requests',
        sa.Column('user_email', sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False, server_default=''),
    )
    op.create_index(op.f('ix_employee_requests_user_email'), 'employee_requests', ['user_email'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_employee_requests_user_email'), table_name='employee_requests')
    op.drop_column('employee_requests', 'user_email')
