"""Add Measurement model

Revision ID: c3dbaee21d47
Revises: 3f074bfdde6e
Create Date: 2023-05-07 15:18:00.923290

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c3dbaee21d47'
down_revision = '3f074bfdde6e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('measurements',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('chemical_element_id', sa.Integer(), nullable=False),
    sa.Column('concentration_value', sa.Numeric(precision=10, scale=6), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('modified_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['chemical_element_id'], ['chemical_elements.id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('measurements')
    # ### end Alembic commands ###