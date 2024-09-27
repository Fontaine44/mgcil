import os
import requests
from flask import Flask, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
BUCKET_URL = os.getenv('BUCKET_URL')

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'mgcil API is running'

@app.route('/healthy')
def healthy():
    return '', 200

@app.route('/sounds/<name>', methods=['GET'])
def get_sound(name):
    mp3_file_path = f'static/sounds/{name}.mp3'
    return send_file(mp3_file_path, mimetype='audio/mpeg')

@app.route('/sounds', methods=['GET'])
def sounds():
    return send_file('static/sounds.json', mimetype='application/json')

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

if __name__ == '__main__':
    app.run(debug=True)