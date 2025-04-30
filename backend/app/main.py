from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, boards
from app.db.session import Base, engine
from app.models.board import Board
from app.models.user import User
from app.models.task import Task
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

# Criação das tabelas
Base.metadata.create_all(bind=engine)

# Rotas
app.include_router(auth.router)
app.include_router(boards.router)
