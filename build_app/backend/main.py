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
from redis import Redis

# Load environment variables from .env file.
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

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Redis connection
redis_client = Redis(
    host="redis-local-server",
    port=6379,
    decode_responses=True,
)

# Define system prompt for the AI agent
SYSTEM_PROMPT = """
You are an AI assistant in a workshop called: "Building AI Applications: From Development to Production, Part 1: Building Full Stack AI Application."
You are designed to assist users in understanding how to run a FastAPI application in a Docker container. And what are the parts needed to architect, build, and deploy a full-stack AI application.
"""
BACKEND_API_PREFIX = "backend-api"

# FastAPI app initialization
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
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
@app.post("/{BACKEND_API_PREFIX}/{case_id}/chat")
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
                model="gpt-4o", messages=chat_history, stream=True
            )
            ai_reply = ""
            for chunk in response:
                response_chunk = chunk.choices[0].delta.content
                if response_chunk:
                    ai_reply += response_chunk
                    yield json.dumps({"event": "message", "data": ai_reply})

            # After stream completes, store the chat history in Redis
            if ai_reply:
                # Add AI's response to chat history
                chat_history.append({"role": "assistant", "content": ai_reply})
                # Filter out system prompt and store in Redis
                filtered_history = [
                    msg for msg in chat_history if msg["role"] != "system"
                ]
                redis_key = f"chat_history:{case_id}"
                redis_client.set(redis_key, json.dumps(filtered_history))

        except Exception as e:
            yield json.dumps(
                {"event": "error", "data": f"Error calling OpenAI API: {str(e)}"}
            )

    return EventSourceResponse(chat_generator(chat_history))


@app.get("/{BACKEND_API_PREFIX}/{case_id}/chat-history")
async def get_chat_history(case_id: str):
    redis_key = f"chat_history:{case_id}"
    chat_history = redis_client.get(redis_key)
    if chat_history:
        history_data = json.loads(chat_history)
        return {"chat_history": history_data}
    return {"chat_history": []}


# a test endpoint
@app.get("/{BACKEND_API_PREFIX}/{case_id}")
async def root(case_id: str):
    return {"message": "Hello World", "case_id": case_id}
