from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    cargo: str

class UserOut(BaseModel):
    id: int
    username: str
    cargo: Optional[str]
    foto: Optional[str]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
