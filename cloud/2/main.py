# Copyright (c) 2024.
# -*-coding:utf-8 -*-
"""
@file: 2_run_in_docker.py
@author: Jerry(Ruihuang)Yang
@email: rxy216@case.edu
@time: 10/18/24 19:36
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv, dotenv_values
from sse_starlette.sse import EventSourceResponse

# Load environment variables from .env file
# try loading from .env file (only when running locally)
try:
    config = dotenv_values(".env")
except FileNotFoundError:
    config = {}
# load secrets from /run/secrets/ (only when running in docker)
load_dotenv(dotenv_path="/run/secrets/xlab-secret")
load_dotenv()

# Set up OpenAI API key securely
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found in environment variables.")

client = OpenAI(api_key=OPENAI_API_KEY)

# Define system prompt for the AI agent
SYSTEM_PROMPT = """
You are an AI assistant in a workshop called "From local to cloud: how to deploy local Python code to the cloud".
This is Step 2: "Run in Docker". You are designed to assist users in deploying their Python code to the cloud.
"""

# FastAPI app initialization
app = FastAPI()

# Pydantic model for request body
class ChatRequest(BaseModel):
    chat_history: list[dict]

# FastAPI endpoint definition
# FastAPI endpoint definition
@app.post("/chat")
async def chat(chat_request: ChatRequest):
    # Start with the system prompt
    chat_history = [{"role": "system", "content": SYSTEM_PROMPT}] + chat_request.chat_history

    async def chat_generator():
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=chat_history,
                stream=True
            )
            ai_reply = ""
            for chunk in response:
                response_chunk = chunk.choices[0].delta.content
                if response_chunk:
                    ai_reply += response_chunk
                    yield {"event": "message", "data": response_chunk}
        except Exception as e:
            yield {"event": "error", "data": f"Error calling OpenAI API: {str(e)}"}

    return EventSourceResponse(chat_generator())
    
# a test endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)


