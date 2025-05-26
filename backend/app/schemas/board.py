from pydantic import BaseModel
from typing import Dict, List
from .task import TaskOut
from typing import Optional

class BoardCreate(BaseModel):
    title: str
    is_private: bool
    team_id: Optional[int] = None

class ColumnOut(BaseModel):
    name: str
    items: List[TaskOut]

class BoardResponse(BaseModel):
    columns: Dict[str, ColumnOut]
    board_title: str
    is_private: bool

class BoardOut(BaseModel):
    id: int
    title: str
    is_private: bool

    class Config:
        from_attributes = True
