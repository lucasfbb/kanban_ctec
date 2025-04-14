from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    cargo: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
