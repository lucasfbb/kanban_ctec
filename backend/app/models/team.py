from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    
    users = relationship("UserTeam", back_populates="team")
    boards = relationship("Board", back_populates="team")
    prazos = relationship("Prazo", back_populates="team")