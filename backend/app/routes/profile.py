from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.routes.utils import get_current_user, get_db
from app.models.user import User
import shutil
import os
from uuid import uuid4

router = APIRouter()

@router.post("/users/upload-foto")
async def upload_foto(
    foto: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    filename = f"user_{user.id}_{foto.filename}"
    file_path = os.path.join(upload_dir, filename)
    relative_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)

    user.foto = relative_path
    db.commit()

    return JSONResponse(content={
        "message": "Foto salva com sucesso",
        "url": f"http://localhost:8000/{relative_path}"
    })

@router.put("/users/update")
def update_user(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.username = data.get("nome", user.username)
    user.username = data.get("username", user.username)
    db.commit()
    return {"message": "Perfil atualizado com sucesso"}