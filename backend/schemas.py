from pydantic import BaseModel
from typing import List, Optional

class ContentExampleBase(BaseModel):
    title: str
    source_url: Optional[str] = None
    content_snippet: str
    notes: Optional[str] = None
    tags: Optional[List[str]] = []

class ContentExampleCreate(ContentExampleBase):
    pass

class ContentExampleRead(ContentExampleBase):
    id: int

    class Config:
        orm_mode = True 