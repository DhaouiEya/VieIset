from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from openai import OpenAI
import os
import json

load_dotenv()  # Charger la clé API depuis .env

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Charger la base des clubs
with open("clubs.json", "r", encoding="utf-8") as f:
    clubs = json.load(f)

# Contexte de l’assistant
SYSTEM_PROMPT = f"""
Tu es un assistant virtuel intelligent de l'ISET Charguia.
Tu connais les clubs suivants :
{json.dumps(clubs, ensure_ascii=False, indent=2)}

Règles :
- Réponds uniquement à propos de ces clubs.
- Si la question n’est pas liée à ces clubs, dis poliment que tu ne peux répondre que sur eux.
- Utilise un ton amical et clair.
"""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # rapide et économique
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )
        reply = completion.choices[0].message.content
    except Exception as e:
        reply = f"Erreur : {str(e)}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
