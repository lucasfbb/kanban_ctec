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

@router.get("/users/me/teams")
def get_user_teams(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    teams_info = []

    for user_team in user.teams:
        team = user_team.team
        members = [
            {
                "id": ut.user.id,
                "username": ut.user.username,
                "foto": ut.user.foto
            }
            for ut in team.users  # Aqui team.users é uma lista de UserTeam
        ]
        teams_info.append({
            "team_id": team.id,
            "team_name": team.name,
            "members": members
        })
    # print(teams_info)
    return teams_info


@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(User).all()

@router.get("/users/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user