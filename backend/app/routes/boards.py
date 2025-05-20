from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload
from app.core.security import decode_access_token
from app.schemas.task import TaskOut
from app.db.session import SessionLocal
from app.models.board import Board
from app.models.task import Task
from app.models.user import User
from app.models.team import Team
from app.models.taskAssigment import task_assignees
from app.schemas.board import BoardCreate, BoardOut, BoardResponse
from app.routes.utils import get_current_user, get_db
from app.schemas.tag import AssigneeOut, TagOut

router = APIRouter()

# @router.get("/boards", response_model=list[BoardOut])
# def list_boards(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
#     return db.query(Board).filter(Board.owner_id == user.id).all()

@router.get("/boards", response_model=List[BoardOut])
def list_boards(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    team_ids = [ut.team_id for ut in user.teams]
    boards = db.query(Board).filter(
        (Board.owner_id == user.id) |
        (Board.team_id.in_(team_ids))
    ).all()
    return boards

# @router.post("/boards", response_model=BoardOut)
# def create_board(board: BoardCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
#     new_board = Board(title=board.title, owner_id=user.id)
#     db.add(new_board)
#     db.commit()
#     db.refresh(new_board)
#     return new_board

@router.post("/boards")
def create_board(board: BoardCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    board_obj = Board(
        title=board.title,
        is_private=board.is_private,
        owner_id=user.id,
        team_id=board.team_id if not board.is_private else None,
    )
    db.add(board_obj)
    db.commit()
    db.refresh(board_obj)
    return board_obj

# @router.get("/boards/{board_id}", response_model=BoardResponse)
# def get_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
#     board = db.query(Board).filter(Board.id == board_id, Board.owner_id == user.id).first()
#     board_title = board.title

#     if not board:
#         raise HTTPException(status_code=404, detail="Board não encontrado")

#     columns = {
#         "backlog": { "name": "Pendências", "items": [] },
# 		"pending": { "name": "Em andamento", "items": [] },
# 		"todo": { "name": "A fazer", "items": [] },
# 		"doing": { "name": "Fazendo", "items": [] },
# 		"done": { "name": "Feito", "items": [] },
#     }

#     for task in board.tasks:
#         if task.status in columns:
#             columns[task.status]["items"].append(TaskOut.model_validate(task))

#     return { "columns": columns, "board_title": board_title }

# @router.get("/boards/{board_id}", response_model=BoardResponse)
# def get_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
#     board = db.query(Board).filter(Board.id == board_id).first()
#     if not board:
#         raise HTTPException(status_code=404, detail="Board não encontrado")

#     # Verifica permissão
#     is_owner = board.owner_id == user.id
#     is_team_member = any(ut.team_id == board.team_id for ut in user.teams) if board.team_id else False

#     if board.is_private and not is_owner:
#         raise HTTPException(status_code=403, detail="Acesso negado")
#     if not board.is_private and not is_team_member:
#         raise HTTPException(status_code=403, detail="Acesso negado")

#     columns = {
#         "backlog": { "name": "Pendências", "items": [] },
#         "pending": { "name": "Em andamento", "items": [] },
#         "todo": { "name": "A fazer", "items": [] },
#         "doing": { "name": "Fazendo", "items": [] },
#         "done": { "name": "Feito", "items": [] },
#     }

#     for task in board.tasks:
#         if task.status in columns:
#             columns[task.status]["items"].append(TaskOut(
#                 id=task.id,
#                 title=task.title,
#                 description=task.description,
#                 priority=task.priority,
#                 deadline=task.deadline,
#                 image=task.image,
#                 alt=task.alt,
#                 status=task.status,
#                 tags=[
#                     TagOut(
#                         id=tag.id,
#                         title=tag.title,
#                         color_bg=tag.color_bg,
#                         color_text=tag.color_text
#                     ) for tag in task.tags
#                 ],
#                 assignees=[
#                     AssigneeOut(
#                         id=u.id,
#                         username=u.username,
#                         foto=u.foto
#                     ) for u in task.assignees
#                 ]
#             ))

#     return { "board_title": board.title, "columns": columns }

@router.get("/boards/{board_id}", response_model=BoardResponse)
def get_board(board_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = db.query(Board).options(
        joinedload(Board.tasks).joinedload(Task.assignees)  # 👈 ADICIONE ISSO
    ).filter(Board.id == board_id).first()

    if not board:
        raise HTTPException(status_code=404, detail="Board não encontrado")

    # Verificações de permissão (sem alterações)
    is_owner = board.owner_id == user.id
    is_team_member = any(ut.team_id == board.team_id for ut in user.teams) if board.team_id else False
    if board.is_private and not is_owner:
        raise HTTPException(status_code=403, detail="Acesso negado")
    if not board.is_private and not is_team_member:
        raise HTTPException(status_code=403, detail="Acesso negado")

    columns = {
        "backlog": {"name": "Pendências", "items": []},
        "pending": {"name": "Em andamento", "items": []},
        "todo": {"name": "A fazer", "items": []},
        "doing": {"name": "Fazendo", "items": []},
        "done": {"name": "Feito", "items": []},
    }



    for task in board.tasks:
        # print(f"Assignees para a task '{task.title}':", [(u.id, u.username, u.foto) for u in task.assignees])  # 👈 DEBUG

        if task.status in columns:
            columns[task.status]["items"].append(TaskOut(
                id=task.id,
                title=task.title,
                description=task.description,
                priority=task.priority,
                deadline=task.deadline,
                image=task.image,
                alt=task.alt,
                status=task.status,
                tags=[TagOut(
                    id=tag.id,
                    title=tag.title,
                    color_bg=tag.color_bg,
                    color_text=tag.color_text
                ) for tag in task.tags],
                assignees=[AssigneeOut(
                    id=u.id,
                    username=u.username,
                    foto=u.foto  # 👈 garante que o campo será populado
                ) for u in task.assignees]
            ))


    return {"board_title": board.title, "columns": columns}

@router.put("/boards/{board_id}/save")
def save_board(board_id: int, data: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board não encontrado")

    # ✅ Remove as associações de responsáveis antes de deletar as tarefas
    db.execute(task_assignees.delete().where(task_assignees.c.task_id.in_(
        db.query(Task.id).filter(Task.board_id == board.id)
    )))

    # ✅ Deleta todas as tasks do board
    db.query(Task).filter(Task.board_id == board.id).delete()

    for status, column in data.items():
        for item in column["items"]:
            task = Task(
                title=item["title"],
                description=item.get("description", ""),
                status=status,
                board_id=board.id,
                deadline=item.get("deadline"),
                priority=item.get("priority", "media"),
                image=item.get("image"),
                alt=item.get("alt"),
            )
            db.add(task)
            db.flush()  # necessário para obter task.id

            assignee_ids = item.get("assignee_ids", [])
            if assignee_ids:
                users = db.query(User).filter(User.id.in_(assignee_ids)).all()
                task.assignees = users

    db.commit()
    return {"message": "Board salvo com sucesso"}
