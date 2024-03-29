"""Add test viewer

Revision ID: 06a918a379c8
Revises: 00fab0627eba
Create Date: 2023-04-22 15:21:52.511693

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06a918a379c8'
down_revision = '00fab0627eba'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()
    conn.execute(sa.text(
        "INSERT INTO auth.users (login, password, role_id, is_active) "
        "VALUES ("
        "'test', "
        "'$2b$12$yolhszaqflaXWLMhdvcwAuZ8Tg68Chb6Qbz0L1PUcSQEDrEXK9JXK', "
        "(SELECT id FROM auth.roles WHERE name = 'viewer'), "
        "TRUE"
        ");"
    ))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM auth.users WHERE login = 'test';"))
    # ### end Alembic commands ###
