"""adding caregiver in userrole enum

Revision ID: 5dad86cc1f4b
Revises: d7e75ddf120a
Create Date: 2026-07-14 13:39:00.595612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5dad86cc1f4b'
down_revision: Union[str, Sequence[str], None] = 'dc4d57d1989e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE userrole ADD VALUE 'CAREGIVER'")


def downgrade() -> None:
    """Downgrade schema."""
    pass
