from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    username: str
    password: str
    cargo: str

class UserOut(BaseModel):
    id: int
    name: str
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

class UserUpdate(BaseModel):
    name: str
    username: str
    cargo: str
