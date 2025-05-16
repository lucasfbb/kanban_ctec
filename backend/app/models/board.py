from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    title = Column(String(100))
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_private = Column(Boolean, default=True)

    owner = relationship("User", back_populates="boards")
    team = relationship("Team", back_populates="boards")
    tasks = relationship("Task", back_populates="board")
