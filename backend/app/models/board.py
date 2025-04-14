from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="boards")
    tasks = relationship("Task", back_populates="board")
