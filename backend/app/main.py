from fastapi import FastAPI
from app.routes import auth, boards
from app.db.session import Base, engine
from app.models.board import Board
from app.models.user import User
from app.db.session import Base, engine

app = FastAPI()

# Criação das tabelas
Base.metadata.create_all(bind=engine)

# Rotas
app.include_router(auth.router)
app.include_router(boards.router)
