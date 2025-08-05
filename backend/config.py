import os

AI_PROVIDER = "claude"  # or "openai"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")  # your OpenAI key
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")  # your Claude key

# Optionally, add more config as needed

def get_ai_provider():
    return AI_PROVIDER

def get_openai_api_key():
    return OPENAI_API_KEY

def get_claude_api_key():
    return CLAUDE_API_KEY
