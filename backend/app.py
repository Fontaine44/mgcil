from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def home():
    return 'mgcil API is running'

@app.route('/sound/<name>', methods=['GET'])
def play_audio(name):
    mp3_file_path = f'static/sounds/{name}.mp3'
    return send_file(mp3_file_path, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(debug=True)