from pydantic import BaseModel
from typing import List, Optional
from .tag import AssigneeOut, TagCreate

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    deadline: int
    image: Optional[str]
    alt: Optional[str]
    status: str
    assignees: List[AssigneeOut] = []

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    description: str
    priority: str
    deadline: int
    image: Optional[str] = None
    alt: Optional[str] = None
    status: str
    assignee_ids: Optional[List[int]] = []