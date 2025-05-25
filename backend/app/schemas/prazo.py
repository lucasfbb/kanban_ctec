from datetime import datetime
from pydantic import BaseModel

class PrazoBase(BaseModel):
    title: str
    start: datetime  # ← ALTERADO
    end: datetime | None = None
    team_id: int | None = None

class PrazoCreate(PrazoBase):
    pass

class PrazoOut(PrazoBase):
    id: int
    owner_id: int | None

    class Config:
        from_attributes = True
