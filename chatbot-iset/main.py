from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os
import json
import re

# Charger la clé API depuis le fichier .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Autorise toutes les requêtes cross-origin

# Initialiser le client OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Charger le fichier JSON
with open("clubs.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Construire le SYSTEM_PROMPT
SYSTEM_PROMPT = f"""
Tu es un assistant virtuel intelligent de l'ISET Charguia.
Tu connais les clubs suivants :
{json.dumps(data, ensure_ascii=False, indent=2)}

Règles :
- Tu peux répondre aux questions sur les clubs, la vie étudiante et l'ISET.
- Si quelqu’un écrit ISET, ISET’Ch, Isetch, ISET Charguia, etc., considère que c’est l’ISET Charguia.
- Si la question n’est pas liée aux clubs, à l'ISET ou à la vie étudiante, répond poliment que tu ne peux répondre que sur ces sujets.
- Utilise un ton amical, clair et précis.
"""

@app.post("/api/chat")
def chat():
    user_message = request.json.get("message", "").strip()
    if not user_message:
        return jsonify({"reply": "⚠️ Vous n'avez rien envoyé."})

    # Normaliser les différentes variantes d’ISET
    user_message_normalized = re.sub(r"(iset[’']?ch|isetch|iset charguia)", "ISET", user_message, flags=re.IGNORECASE)

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message_normalized},
            ]
        )
        reply = completion.choices[0].message.content
    except Exception as e:
        reply = f"Erreur serveur : {str(e)}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
