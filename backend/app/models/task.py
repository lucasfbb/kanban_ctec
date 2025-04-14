from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    description = Column(Text)
    priority = Column(String(20))
    deadline = Column(Integer)
    image = Column(String(255), nullable=True)
    alt = Column(String(100), nullable=True)
    status = Column(String(20))  # 'backlog', 'todo', 'doing', 'done'

    board_id = Column(Integer, ForeignKey("boards.id"))
    board = relationship("Board", back_populates="tasks")