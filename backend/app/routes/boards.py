from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.schemas.task import TaskOut
from app.db.session import SessionLocal
from app.models.board import Board
from app.models.task import Task
from app.models.user import User
from app.schemas.board import BoardCreate, BoardOut
from app.routes.utils import get_current_user, get_db

router = APIRouter()

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
        "backlog": { "name": "Pendências", "items": [] },
		"pending": { "name": "Em andamento", "items": [] },
		"todo": { "name": "A fazer", "items": [] },
		"doing": { "name": "Fazendo", "items": [] },
		"done": { "name": "Feito", "items": [] },
    }

    for task in board.tasks:
        if task.status in columns:
            columns[task.status]["items"].append(TaskOut.model_validate(task))

    return columns

@router.put("/boards/{board_id}/save")
def save_board(board_id: int, data: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board não encontrado")

    # Remove todas as tasks antigas do board
    db.query(Task).filter(Task.board_id == board.id).delete()

    # Adiciona novas tasks do frontend
    for status, column in data.items():
        for item in column["items"]:
            task = Task(
                title=item["title"],
                description=item.get("description", ""),
                status=status,
                board_id=board.id,
                deadline=item.get("deadline"),
                priority=item.get("priority", "medium")
            )
            db.add(task)

    db.commit()
    return {"message": "Board salvo com sucesso"}
