from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from.taskAssigment import task_assignees

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    board_id = Column(Integer, ForeignKey('boards.id'))
    title = Column(String(100))
    description = Column(Text)
    priority = Column(String(20))
    deadline = Column(Integer)
    image = Column(String(255), nullable=True)
    alt = Column(String(100), nullable=True)
    status = Column(String(20))
    tags = relationship("Tag", back_populates="task")
    board = relationship("Board", back_populates="tasks")

    assignees = relationship("User", secondary=task_assignees, back_populates="assigned_tasks")
