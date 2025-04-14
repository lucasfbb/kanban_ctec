from pydantic import BaseModel
from typing import Optional

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