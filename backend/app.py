import os
import requests
import threading
import pandas as pd
from flask import Flask, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
BUCKET_URL = os.getenv('BUCKET_URL')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'mgcil API is running'

@app.route('/healthy')
def healthy():
    return '', 200

def log_sound(sound):
    df = pd.read_csv(BUCKET_URL+'analytics.csv')

    if sound in df['Sound'].values:
        df.loc[df['Sound'] == sound, 'Count'] += 1
    else:
        df.loc[len(df.index)] = [sound, 1]

    requests.put(BUCKET_URL+'analytics.csv', data=df.to_csv(index=False))

@app.route('/sounds/<sound>', methods=['GET'])
def get_sound(sound):
    threading.Thread(target=log_sound, args=[sound]).start()
    mp3_file_path = f'static/sounds/{sound}.mp3'
    return send_file(mp3_file_path, mimetype='audio/mpeg')

@app.route('/sounds', methods=['GET'])
def sounds():
    return send_file('static/sounds.json', mimetype='application/json')

@app.route('/analytics', methods=['GET'])
def get_analytics():
    df = pd.read_csv(BUCKET_URL+'analytics.csv')
    return df.to_html(index=False), 200

@app.route('/analytics/<sound>', methods=['POST'])
def add_analytics(sound):
    threading.Thread(target=log_sound, args=[sound]).start()
    return "", 200

@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    response = requests.get(BUCKET_URL+'suggestions.txt')
    suggestions = response.content.decode('utf-8').split('\n')
    return {"suggestions": suggestions}, 200

@app.route('/suggestions', methods=['POST'])
def post_suggestions():
    data = request.get_json()
    suggestion = data.get('suggestion', '')

    response = requests.get(BUCKET_URL+'suggestions.txt')
    suggestions = response.content.decode('utf-8')

    suggestions += f'\n{suggestion}'

    response = requests.put(BUCKET_URL+'suggestions.txt', data=suggestions)

    return {"status": "Received"}, 200

@app.route('/tts', methods=['POST'])
def tts():
    data = request.get_json()
    text = data.get('text')
    language_code = data.get('languageCode')
    sound = data.get('sound')

    body = {
        "input": {
          "text": text
          
        },
        "voice": {
            "languageCode": language_code,
            "sound": sound
        },
        "audioConfig": {
          "audioEncoding": "MP3"
        }
      }

    response = requests.post(f"https://texttospeech.googleapis.com/v1beta1/text:synthesize?key={GOOGLE_API_KEY}", json=body)

    return response.json()

if __name__ == '__main__':
    app.run(debug=True)