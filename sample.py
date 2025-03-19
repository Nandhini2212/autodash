import requests

API_KEY = "AIzaSyAkgq_FkTZU8Hl5jBZyc9vnRAlJ9ms7yaM"
MODEL_NAME = "gemini-2.0-flash"  # Try "gemini-1.5-flash-latest" if "pro" is unavailable

URL = f"https://generativelanguage.googleapis.com/v1/models/{MODEL_NAME}:generateContent?key={API_KEY}"

data = {
    "contents": [{"role": "user", "parts": [{"text": "Hello, Gemini!"}]}]
}

response = requests.post(URL, json=data)

if response.status_code == 200:
    print("Success:", response.json())
else:
    print("Error:", response.json())