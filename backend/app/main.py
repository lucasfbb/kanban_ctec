from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth, boards, utils, profile
from app.db.session import Base, engine
from app.models.board import Board
from app.models.user import User
from app.models.task import Task
from app.models.tag import Tag
from app.db.session import Base, engine

app = FastAPI()

# Adicione isso ANTES de registrar suas rotas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou ["*"] em dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve os arquivos estáticos da pasta uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Criação das tabelas
Base.metadata.create_all(bind=engine)

# Rotas
app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(profile.router)



