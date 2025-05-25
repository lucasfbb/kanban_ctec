from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class Prazo(Base):
    __tablename__ = "prazos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    start = Column(DateTime, nullable=False)  # ← ALTERADO
    end = Column(DateTime, nullable=True)     # ← ALTERADO
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    owner = relationship("User", back_populates="prazos")
    team = relationship("Team", back_populates="prazos")
