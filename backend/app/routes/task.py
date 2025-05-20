from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.user import User
from app.routes.utils import get_db
from app.schemas.task import TaskCreate, TaskOut

router = APIRouter()

# @router.post("/boards/{board_id}/tasks")
# def create_task(board_id: int, task: TaskCreate, db: Session = Depends(get_db)):
#     task_data = task.model_dump(exclude={"assignee_ids", "tags"})
#     task_obj = Task(board_id=board_id, **task_data)

#     # Atribuir usuários à task
#     if task.assignee_ids:
#         users = db.query(User).filter(User.id.in_(task.assignee_ids)).all()
#         task_obj.assignees = users

#     # TO DO: você pode também tratar as tags aqui, se quiser salvar no banco

#     db.add(task_obj)
#     db.commit()
#     db.refresh(task_obj)
#     return task_obj

@router.post("/boards/{board_id}/tasks", response_model=TaskOut)
def create_task(board_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    task_obj = Task(
        board_id=board_id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        deadline=task.deadline,
        image=task.image,
        alt=task.alt,
        status=task.status
    )
    db.add(task_obj)
    db.flush()  # necessário para criar o ID da task

    # 🔧 aqui está o ponto-chave
    if task.assignee_ids:
        users = db.query(User).filter(User.id.in_(task.assignee_ids)).all()
        task_obj.assignees = users

    db.commit()
    db.refresh(task_obj)
    return task_obj

@router.post("/tasks/{task_id}/assign")
def assign_user_to_task(task_id: int, user_ids: List[int], db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task não encontrada"}

    task.assignees = db.query(User).filter(User.id.in_(user_ids)).all()
    db.commit()
    return {"message": "Responsáveis atualizados"}

