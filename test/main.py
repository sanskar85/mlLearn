import os
import threading
from ModelTraining import ModelTraining
from flask import Flask, jsonify, request
import threading

UPLOAD_FOLDER = './uploads'

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


ALLOWED_EXTENSIONS = set(['csv'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def fire_and_forget(f):
    def wrapped(*args):
        threading.Thread(target=f, args=(args)).start()

    return wrapped


@app.route("/create-model", methods=['POST'])
def create_model():

    if 'id' not in request.form:
        resp = jsonify(
            {'message': 'Model id not provided.', "status_code": 400})
        return resp

    id = request.form['id']
    if not id:
        resp = jsonify(
            {'message': 'Model id not provided.', "status_code": 400})
        return resp

    if 'file' not in request.files:
        resp = jsonify(
            {'message': 'No file in the request', "status_code": 400})
        return resp

    file = request.files['file']
    if file.filename == '':
        resp = jsonify(
            {'message': 'No file selected for uploading', "status_code": 400})

    if file and allowed_file(file.filename):
        filename = file.filename
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.mkdir(app.config['UPLOAD_FOLDER'])

        file.save(path)

        model_training = ModelTraining(id=id, csv=path)
        model_training.create_model()
        resp = jsonify(
            {'message': 'File successfully uploaded to '+path, "status_code": 201})
        return resp

    else:
        resp = jsonify(
            {'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif', "status_code": 400})
        return resp


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
