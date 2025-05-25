from pytz import timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.prazo import Prazo
from app.models.user import User
from app.schemas.prazo import PrazoCreate, PrazoOut
from app.routes.utils import get_current_user, get_db

router = APIRouter(prefix="/prazos", tags=["prazos"])

@router.get("/", response_model=list[PrazoOut])
def listar_prazos(db: Session = Depends(get_db), usuario: User = Depends(get_current_user)):
    # Buscar IDs das equipes do usuário
    equipes_ids = [eq.team_id for eq in usuario.teams]

    return db.query(Prazo).filter(
        (Prazo.owner_id == usuario.id) | (Prazo.team_id.in_(equipes_ids))
    ).all()

# @router.post("/", response_model=PrazoOut)
# def criar_prazo(prazo: PrazoCreate, db: Session = Depends(get_db)):
#     novo = Prazo(**prazo.dict())
#     db.add(novo)
#     db.commit()
#     db.refresh(novo)
#     return novo

@router.post("/", response_model=PrazoOut)
def criar_prazo(prazo: PrazoCreate, db: Session = Depends(get_db), usuario: User = Depends(get_current_user)):
    fuso_brasilia = timezone("America/Sao_Paulo")

    novo = Prazo(
        title=prazo.title,
        start=prazo.start.astimezone(fuso_brasilia).replace(tzinfo=None),
        end=prazo.end.astimezone(fuso_brasilia).replace(tzinfo=None) if prazo.end else None,
        team_id=prazo.team_id,
        owner_id=usuario.id if not prazo.team_id else None
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo