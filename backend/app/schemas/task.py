from pydantic import BaseModel
from typing import List, Optional
from .tag import TagCreate

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    deadline: int
    image: str | None
    alt: str | None
    status: str

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    board_id: int
    title: str
    description: str
    priority: str
    deadline: int
    image: Optional[str] = None
    alt: Optional[str] = None
    status: str
    tags: Optional[List[TagCreate]] = []
    assignee_ids: Optional[List[int]] = []