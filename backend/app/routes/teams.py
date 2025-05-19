from typing import List
from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.routes.utils import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
import shutil
import os
from uuid import uuid4
from app.models.team import Team
from app.models.userTeam import UserTeam
from app.schemas.team import TeamOut

router = APIRouter()

@router.post("/teams")
def create_team(name: str, db: Session = Depends(get_db)):
    team = Team(name=name)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.get("/teams", response_model=List[TeamOut])
def list_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()

@router.post("/teams/{team_id}/add-user/{user_id}")
def add_user_to_team(team_id: int, user_id: int, db: Session = Depends(get_db)):
    link = UserTeam(team_id=team_id, user_id=user_id)
    db.add(link)
    db.commit()
    return {"message": "Usuário adicionado à equipe"}
