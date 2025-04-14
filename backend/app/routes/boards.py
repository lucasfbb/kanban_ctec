from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.schemas.task import TaskOut
from app.db.session import SessionLocal
from app.models.board import Board
from app.models.user import User
from app.schemas.board import BoardCreate, BoardOut

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.get("/boards", response_model=list[BoardOut])
def list_boards(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Board).filter(Board.owner_id == user.id).all()

@router.post("/boards", response_model=BoardOut)
def create_board(board: BoardCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_board = Board(title=board.title, owner_id=user.id)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/boards/{board_id}", response_model=dict[str, dict])
def get_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == user.id).first()

    if not board:
        raise HTTPException(status_code=404, detail="Board não encontrado")

    columns = {
        "backlog": {"name": "Backlog", "items": []},
        "todo": {"name": "To Do", "items": []},
        "doing": {"name": "Doing", "items": []},
        "done": {"name": "Done", "items": []},
    }

    for task in board.tasks:
        if task.status in columns:
            columns[task.status]["items"].append(TaskOut.model_validate(task))

    return columns
