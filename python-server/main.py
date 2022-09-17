from cmath import log
import os
import threading
from ModelTraining import ModelTraining
from ModelPredictor import ModelPredictor
from flask import Flask, jsonify, request
import threading
import uuid

UPLOAD_FOLDER = './uploads'

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


ALLOWED_EXTENSIONS = set(['csv', 'sav'])


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
            {'message': 'Model id not provided.', "status_code": 400, 'success': False})
        return resp

    if 'callback_success' not in request.form:
        resp = jsonify(
            {'message': 'Callback URL not provided.', "status_code": 400, 'success': False})
        return resp

    if 'callback_failure' not in request.form:
        resp = jsonify(
            {'message': 'Callback URL not provided.', "status_code": 400, 'success': False})
        return resp

    id = request.form['id']
    callback_success = request.form['callback_success']
    callback_failure = request.form['callback_failure']
    if not id:
        resp = jsonify(
            {'message': 'Model id not provided.', "status_code": 400, 'success': False})
        return resp

    if 'file' not in request.files:
        resp = jsonify(
            {'message': 'No file in the request', "status_code": 400, 'success': False})
        return resp

    file = request.files['file']
    if file.filename == '':
        resp = jsonify(
            {'message': 'No file selected for uploading', "status_code": 400, 'success': False})

    if file and allowed_file(file.filename):
        filename = id+".csv"
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.mkdir(app.config['UPLOAD_FOLDER'])

        file.save(path)

        model_training = ModelTraining(
            id=id, csv=path, callback_success=callback_success, callback_failure=callback_failure)
        model_training.create_model()
        resp = jsonify(
            {'message': 'File successfully uploaded to '+path, "status_code": 201, 'success': True})
        return resp

    else:
        resp = jsonify(
            {'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif', "status_code": 400, 'success': False})
        return resp


@app.route("/predict-model", methods=['POST'])
def predict_model():

    id = uuid.uuid4().hex

    if 'data' not in request.form:
        resp = jsonify(
            {'message': 'No data in the request', "status_code": 400, 'success': False})
        return resp

    if 'dataset' not in request.files:
        resp = jsonify(
            {'message': 'No Dataset file in the request', "status_code": 400, 'success': False})
        return resp

    dataset = request.files['dataset']
    if dataset.filename == '':
        resp = jsonify(
            {'message': 'No Dataset file selected for uploading', "status_code": 400, 'success': False})

    if 'model' not in request.files:
        resp = jsonify(
            {'message': 'No Model in the request', "status_code": 400, 'success': False})
        return resp

    model = request.files['model']
    if model.filename == '':
        resp = jsonify(
            {'message': 'No Model selected for uploading', "status_code": 400, 'success': False})

    if dataset and allowed_file(dataset.filename):
        filename = id+".csv"
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.mkdir(app.config['UPLOAD_FOLDER'])

        dataset.save(path)

    else:
        resp = jsonify(
            {'message': 'Allowed file types are csv.', "status_code": 400, 'success': False})
        return resp

    if model and allowed_file(model.filename):
        filename = id+".sav"
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.mkdir(app.config['UPLOAD_FOLDER'])

        model.save(path)

    else:
        resp = jsonify(
            {'message': 'Allowed file types are sav.', "status_code": 400, 'success': False})
        return resp

    data = request.form['data']

    dataset_path = os.path.join(app.config['UPLOAD_FOLDER'], id+".csv")
    model_path = os.path.join(app.config['UPLOAD_FOLDER'], id+".sav")

    modelPredictor = ModelPredictor(dataset=dataset_path, model=model_path)
    print(data)
    try:
        predictedValue = modelPredictor.predict(data)
        resp = jsonify(
            {'message': predictedValue, "status_code": 200, 'success': True})
    except:
        resp = jsonify(
            {'message': 'Error while predicting', "status_code": 400, 'success': False})

    if os.path.exists(dataset_path):
        os.remove(dataset_path)
    if os.path.exists(model_path):
        os.remove(model_path)

    return resp


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=9002, debug=True)
