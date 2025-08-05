from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ContentExample(Base):
    __tablename__ = "content_examples"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    content_snippet = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    tags = Column(String, nullable=True)  # Comma-separated tags 