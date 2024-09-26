from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def home():
    return 'mgcil API is running'

@app.route('/sounds/<name>', methods=['GET'])
def get_sound(name):
    mp3_file_path = f'static/sounds/{name}.mp3'
    return send_file(mp3_file_path, mimetype='audio/mpeg')

@app.route('/sounds', methods=['GET'])
def sounds():
    return send_file('static/sounds.json', mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)