from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    title = Column(String(100))
    color_bg = Column(String(20))
    color_text = Column(String(50))
    task = relationship("Task", back_populates="tags")