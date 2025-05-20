from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, Token, UserLogin
from app.core.security import hash_password, verify_password, create_access_token

MASTER_IP = '172.28.160.1'

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    
    new_user = User(username=user.username, password=hash_password(user.password), cargo=user.cargo)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "Usuário criado com sucesso"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, request: Request, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token(db_user.username, db_user.cargo)
    return {"access_token": token, "token_type": "bearer"}
