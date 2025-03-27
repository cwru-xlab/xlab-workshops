# Copyright (c) 2024.
# -*-coding:utf-8 -*-
"""
@file: 1_key_management.py
@author: Jerry(Ruihuang)Yang
@email: rxy216@case.edu
@time: 10/18/24 19:36
"""

from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Set up OpenAI API key securely
XLAB_API_KEY = os.getenv("XLAB_API_KEY")
client = OpenAI(
    base_url="https://xlab-gpu0.weatherhead.case.edu/openai-compatible-api/v1",
    api_key=XLAB_API_KEY,
)

# Define system prompt for the AI agent, change this to give your AI a unique personality
SYSTEM_PROMPT = """
You are an AI assistant in a workshop called "From local to cloud: how to deploy local Python code to the cloud".
This is Step 1: "Key Management". You are designed to assist users in deploying their Python code to the cloud.
"""

# How do you want your AI to greet the user?
INITIAL_MESSAGE = """How can I assist you today?
"""


# Function to call OpenAI API and get a response
def get_ai_response(chat_history):
    try:
        response = client.chat.completions.create(
            model="/workspace/models/Llama-3.3-70B-Instruct",  # You can adjust the model if needed
            messages=chat_history,  # Sending the entire chat history to the API
            stream=True,  # Enable streaming of responses
        )
        return response
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None


# Main function to run the chat
def chat():
    chat_history = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": INITIAL_MESSAGE},
    ]
    print(f"AI Assistant: {INITIAL_MESSAGE}")

    while True:
        user_input = input("You: ")
        print()  # For formatting

        if user_input.lower() == "exit":  # enter "exit" to end the chat
            print("Goodbye!")
            break

        # Append user message to the chat history
        chat_history.append({"role": "user", "content": user_input})

        # Call OpenAI API and stream the response
        response = get_ai_response(chat_history)

        if response:
            ai_reply = ""
            print("AI Assistant: ", end="")
            # Iterate through the streamed response
            for chunk in response:
                response_chunk = chunk.choices[0].delta.content
                if response_chunk:
                    ai_reply += response_chunk
                    print(response_chunk, end="", flush=True)
            else:
                print()

            # Append AI's response to chat history
            chat_history.append({"role": "assistant", "content": ai_reply})
            print()  # For formatting after streaming


if __name__ == "__main__":
    chat()
