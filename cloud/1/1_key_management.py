import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Set up OpenAI API key securely
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define system prompt for the AI agent
SYSTEM_PROMPT = """
You are an AI assistant that helps users with their tasks and provides conversational support.
"""


# Function to call OpenAI API and get a response
def get_ai_response(chat_history):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can adjust the model if needed
            messages=chat_history,  # Sending the entire chat history to the API
            stream=True  # Enable streaming of responses
        )
        return response
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None


# Main function to run the chat
def main():
    chat_history = [{"role": "system", "content": SYSTEM_PROMPT}]
    print("AI Assistant: How can I assist you today?")

    while True:
        user_input = input("You: ")

        # Append user message to the chat history
        chat_history.append({"role": "user", "content": user_input})

        # Call OpenAI API and stream the response
        response = get_ai_response(chat_history)

        if response:
            ai_reply = ""
            # Iterate through the streamed response
            for chunk in response:
                if "choices" in chunk:
                    choice = chunk["choices"][0]
                    if "delta" in choice:
                        delta_content = choice["delta"].get("content", "")
                        ai_reply += delta_content
                        print(delta_content, end="", flush=True)

            # Append AI's response to chat history
            chat_history.append({"role": "assistant", "content": ai_reply})
            print()  # For formatting after streaming


if __name__ == "__main__":
    main()
