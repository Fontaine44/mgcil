import os
import requests
import threading
import oracledb
import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(override=True)
BUCKET_URL = os.getenv('BUCKET_URL')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
ORACLE_PASSWORD = os.getenv('ORACLE_PASSWORD')
CONNECTION_STR = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ca-montreal-1.oraclecloud.com))(connect_data=(service_name=g8776c1047b3446_fkmjnxbscms692ba_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

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
    name = data.get('name')

    body = {
        "input": {
          "text": text
          
        },
        "voice": {
            "languageCode": language_code,
            "name": name
        },
        "audioConfig": {
          "audioEncoding": "MP3"
        }
      }

    response = requests.post(f"https://texttospeech.googleapis.com/v1beta1/text:synthesize?key={GOOGLE_API_KEY}", json=body)

    return response.json(), response.status_code

@app.route('/pokes/<dele_id>', methods=['GET'])
def poke_status(dele_id):
    # Return a list of all schools and the poke status

    with oracledb.connect(
        user="MGCIL",
        password=ORACLE_PASSWORD,
        dsn=CONNECTION_STR) as conn:

        with conn.cursor() as cursor:
            results = cursor.execute("SELECT * FROM delegations WHERE ID = :1", [dele_id])

            dele = results.fetchone()[2:]

    return jsonify(dele)

@app.route('/pokes', methods=['POST'])
def send_poke():
    data = request.get_json()
    poker_id = data.get('poker_id')
    pokee_ids = data.get('pokee_ids')
    pokee_ip = request.remote_addr
    
    with oracledb.connect(
        user="MGCIL",
        password=ORACLE_PASSWORD,
        dsn=CONNECTION_STR) as conn:

        with conn.cursor() as cursor:
            # Update delegations

            # Update poker
            query = "UPDATE delegations SET "
            for pokee_id in pokee_ids:
                query += f'"{pokee_id}" = 1, '
            query = query[:-2]
            query += f' WHERE "ID" = {poker_id}'
            
            cursor.execute(query)

            # Update pokees and insert pokes
            for pokee_id in pokee_ids:
                cursor.execute(f'UPDATE delegations SET "{poker_id}" = 0 WHERE "ID" = {pokee_id}')
                
                cursor.execute("INSERT INTO pokes (poker_id, pokee_id, poker_ip) VALUES (:1, :2, :3)", [poker_id, pokee_id, pokee_ip])

            conn.commit()

            results = cursor.execute("SELECT * FROM delegations WHERE ID = :1", [poker_id])

            dele = results.fetchone()[2:]

    return jsonify(dele)


if __name__ == '__main__':
    app.run(debug=True)