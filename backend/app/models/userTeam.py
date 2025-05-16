from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class UserTeam(Base):
    __tablename__ = "user_teams"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))

    user = relationship("User", back_populates="teams")
    team = relationship("Team", back_populates="users")
