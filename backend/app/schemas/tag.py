from pydantic import BaseModel
from typing import List, Dict, Optional

class TagOut(BaseModel):
    id: int
    title: str
    color_bg: str
    color_text: str

class AssigneeOut(BaseModel):
    id: int
    username: str
    foto: Optional[str]

class TagCreate(BaseModel):
    title: str
    color_bg: str
    color_text: str