# Copyright (c) 2024.
# -*-coding:utf-8 -*-
"""
@file: main.py
@author: Jerry(Ruihuang)Yang
@email: rxy216@case.edu
@time: 10/25/24 19:38
"""

from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv, dotenv_values
from sse_starlette.sse import EventSourceResponse
from fastapi.middleware.cors import CORSMiddleware
import json

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
XLAB_API_KEY = os.getenv("XLAB_API_KEY")
if not XLAB_API_KEY:
    raise ValueError("xLab API key not found in environment variables.")

client = OpenAI(
    base_url="https://xlab-gpu0.weatherhead.case.edu/openai-compatible-api/v1",
    api_key=XLAB_API_KEY,
)

# Define system prompt for the AI agent
SYSTEM_PROMPT = """
You are an AI assistant in a workshop called "From local to cloud: how to deploy local Python code to the cloud".
This is Step 2: "Run in Docker". You are designed to assist users in deploying their Python code to the cloud.
"""

# FastAPI app initialization
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cloud.xlab-cwru.org",
        "https://cloud.xlab-cwru.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model for request body
class ChatRequest(BaseModel):
    chat_history: list[dict]


# FastAPI endpoint definition
@app.post("/{case_id}/chat")
async def chat(chat_request: ChatRequest, case_id: str):
    # Start with the system prompt
    chat_history = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
            + f" You are the bot created by Case Western Reserve University. The student who created you has an ID of {case_id}.",
        }
    ] + chat_request.chat_history

    def chat_generator(chat_history):
        try:
            response = client.chat.completions.create(
                model="/workspace/models/Llama-3.3-70B-Instruct",
                messages=chat_history,
                stream=True,
            )
            ai_reply = ""
            for chunk in response:
                response_chunk = chunk.choices[0].delta.content
                if response_chunk:
                    ai_reply += response_chunk
                    yield json.dumps({"event": "message", "data": ai_reply})
        except Exception as e:
            yield json.dumps(
                {"event": "error", "data": f"Error calling OpenAI API: {str(e)}"}
            )

    return EventSourceResponse(chat_generator(chat_history))


# a test endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", reload=True)
