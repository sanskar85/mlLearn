from cmath import log
from flask import jsonify
import json
from time import time
import os
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, recall_score, precision_score, f1_score
from threading import Thread
import pickle
import requests


class ModelPredictor:

    def __init__(self, dataset, model):
        self.id = id
        self.dataset = dataset
        self.model = model

    def fire_and_forget(f):
        def wrapped(*args):
            Thread(target=f, args=(args)).start()

        return wrapped

    def predict(self, data):
        data = data.split(',')
        temp = []

        _data = pd.read_csv(self.dataset)
        dataset = pd.DataFrame(_data)
        columns = dataset.columns
        encoder_array = []
        enc_mapping = {}

        imputer = SimpleImputer(missing_values=np.nan, strategy='mean')

        index = 0
        for key, value in dataset.isnull().sum().items():
            dType = dataset[key].dtype
            if(dType == 'object'):
                temp.append(data[index])

            if(dType == 'float64'):
                try:
                    temp.append(float(data[index]))
                except:
                    raise TypeError("Invalid data type")

            if(dType == 'int64'):
                try:
                    temp.append(int(data[index]))
                except:
                    raise TypeError("Invalid data type")

            if (value > 0):
                imputer = imputer.fit(dataset[key])
                dataset[key] = imputer.transform(dataset[key])

            index += 1

        for (index, dType) in enumerate(dataset.dtypes):
            if (dType == 'object'):
                encoder_array.append(columns[index])

        # add data to dataset
        data = temp
        data[len(data)-1] = dataset.iat[0, -1]
        dataset.loc[len(dataset.index)] = data

        if (len(encoder_array) > 0):
            enc = LabelEncoder()
            dataset[encoder_array] = \
                dataset[encoder_array].apply(lambda col: enc.fit_transform(
                    col.astype(str)), axis=0, result_type='expand')

            enc_mapping = dict(
                zip(enc.classes_, enc.transform(enc.classes_)))

        dataset = dataset.tail(1)
        features = dataset.drop([columns[-1]], axis=1)

        model = pickle.load(open(self.model, 'rb'))
        prediction = model.predict(features)
        prediction = prediction[0]

        if (len(encoder_array) > 0):
            prediction = list(enc_mapping.keys())[
                list(enc_mapping.values()).index(prediction)]

        return str(prediction)
