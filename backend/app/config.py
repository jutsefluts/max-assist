import os
from dotenv import load_dotenv

# Load the environment variables from the .env file located in the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Example usage for debugging
api_key = Config.OPENAI_API_KEY
print("Loaded API Key from config:", api_key)  # Debugging line to ensure the API key is loaded
