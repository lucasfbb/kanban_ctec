from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.db.session import Base
from .taskAssigment import task_assignees

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    cargo = Column(String(50))
    foto = Column(String(50), nullable=True)

    boards = relationship("Board", back_populates="owner")
    assigned_tasks = relationship("Task", secondary=task_assignees, back_populates="assignees")
    teams = relationship("UserTeam", back_populates="user")