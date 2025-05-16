from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.user import User
from app.routes.utils import get_db
from app.schemas.task import TaskCreate

router = APIRouter()

@router.post("/boards/{board_id}/tasks")
def create_task(board_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    task_obj = Task(board_id=board_id, **task.dict())
    db.add(task_obj)
    db.commit()
    db.refresh(task_obj)
    return task_obj

@router.post("/tasks/{task_id}/assign")
def assign_user_to_task(task_id: int, user_ids: List[int], db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    task.assignees = db.query(User).filter(User.id.in_(user_ids)).all()
    db.commit()
    return {"message": "Responsáveis atualizados"}

