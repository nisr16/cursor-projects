from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud, database
from .crud import suggest_categories

app = FastAPI()

database.init_db()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/examples/", response_model=schemas.ContentExampleRead)
def create_example(example: schemas.ContentExampleCreate, db: Session = Depends(get_db)):
    tags = example.tags if example.tags else suggest_categories(example.content_snippet)
    example_with_tags = schemas.ContentExampleCreate(
        title=example.title,
        source_url=example.source_url,
        content_snippet=example.content_snippet,
        notes=example.notes,
        tags=tags
    )
    db_example = crud.create_content_example(db, example_with_tags)
    return db_example

@app.get("/examples/", response_model=List[schemas.ContentExampleRead])
def read_examples(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_content_examples(db, skip=skip, limit=limit)

@app.get("/examples/{example_id}", response_model=schemas.ContentExampleRead)
def read_example(example_id: int, db: Session = Depends(get_db)):
    db_example = crud.get_content_example(db, example_id)
    if db_example is None:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example

@app.put("/examples/{example_id}", response_model=schemas.ContentExampleRead)
def update_example(example_id: int, example: schemas.ContentExampleCreate, db: Session = Depends(get_db)):
    db_example = crud.update_content_example(db, example_id, example)
    if db_example is None:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example

@app.delete("/examples/{example_id}", response_model=schemas.ContentExampleRead)
def delete_example(example_id: int, db: Session = Depends(get_db)):
    db_example = crud.delete_content_example(db, example_id)
    if db_example is None:
        raise HTTPException(status_code=404, detail="Example not found")
    return db_example 