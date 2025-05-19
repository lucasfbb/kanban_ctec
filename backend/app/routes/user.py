from typing import List
from fastapi import APIRouter, Depends
from app.models.user import User
from app.models.team import Team
from app.schemas.team import TeamOut
from app.routes.utils import get_current_user
from app.schemas.user import UserOut
from sqlalchemy.orm import Session
from app.routes.utils import get_current_user, get_db

router = APIRouter()

@router.get("/users/me/teams", response_model=List[TeamOut])
def get_user_teams(user: User = Depends(get_current_user)):
    return [ut.team for ut in user.teams]

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(User).all()