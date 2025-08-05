from sqlalchemy.orm import Session
from . import models, schemas
import requests
from . import config
import openai

# Helper to convert list to comma-separated string and vice versa
def tags_to_str(tags):
    return ",".join(tags) if tags else ""

def str_to_tags(tags_str):
    return tags_str.split(",") if tags_str else []

# CRUD functions
def create_content_example(db: Session, example: schemas.ContentExampleCreate):
    db_example = models.ContentExample(
        title=example.title,
        source_url=example.source_url,
        content_snippet=example.content_snippet,
        notes=example.notes,
        tags=tags_to_str(example.tags)
    )
    db.add(db_example)
    db.commit()
    db.refresh(db_example)
    return db_example

def get_content_examples(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContentExample).offset(skip).limit(limit).all()

def get_content_example(db: Session, example_id: int):
    return db.query(models.ContentExample).filter(models.ContentExample.id == example_id).first()

def update_content_example(db: Session, example_id: int, example: schemas.ContentExampleCreate):
    db_example = get_content_example(db, example_id)
    if db_example:
        db_example.title = example.title
        db_example.source_url = example.source_url
        db_example.content_snippet = example.content_snippet
        db_example.notes = example.notes
        db_example.tags = tags_to_str(example.tags)
        db.commit()
        db.refresh(db_example)
    return db_example

def delete_content_example(db: Session, example_id: int):
    db_example = get_content_example(db, example_id)
    if db_example:
        db.delete(db_example)
        db.commit()
    return db_example

def suggest_categories(content_snippet: str):
    provider = config.get_ai_provider()
    prompt = f"Suggest 3-5 relevant categories or tags for the following content, as a comma-separated list.\nContent: {content_snippet}"
    if provider == "openai":
        openai.api_key = config.get_openai_api_key()
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=32,
            temperature=0.5,
        )
        tags_str = response.choices[0].message['content']
        return [tag.strip() for tag in tags_str.split(",") if tag.strip()]
    elif provider == "claude":
        # Placeholder for Claude API call
        # You need to fill in your Claude API endpoint and request format
        headers = {
            "x-api-key": config.get_claude_api_key(),
            "Content-Type": "application/json"
        }
        data = {
            "model": "claude-3-opus-20240229",  # or your preferred Claude model
            "max_tokens": 32,
            "temperature": 0.5,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        # Example endpoint, update as needed
        endpoint = "https://api.anthropic.com/v1/messages"
        response = requests.post(endpoint, headers=headers, json=data)
        if response.status_code == 200:
            tags_str = response.json()["content"]
            return [tag.strip() for tag in tags_str.split(",") if tag.strip()]
        else:
            return []
    else:
        return [] 