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


class ModelTraining:

    def __init__(self, id, csv):
        self.id = id
        self.csv = csv
        self.results = {}

    def fire_and_forget(f):
        def wrapped(*args):
            Thread(target=f, args=(args)).start()

        return wrapped

    def pre_processing(self):
        data = pd.read_csv(self.csv)
        dataset = pd.DataFrame(data)

        columns = dataset.columns
        encoder_array = []

        imputer = SimpleImputer(missing_values=np.nan, strategy='mean')

        for key, value in dataset.isnull().sum().items():
            type = dataset[key].dtype
            if (value > 0 and type == np.float64 and type == np.int64):
                print(key)
                imputer = imputer.fit(dataset[key])
                dataset[key] = imputer.transform(dataset[key])

        for (index, type) in enumerate(dataset.dtypes):
            if (type == 'object'):
                encoder_array.append(columns[index])

        if (len(encoder_array) > 0):
            enc = LabelEncoder()
            dataset.loc[:, encoder_array] = \
                dataset.loc[:, encoder_array].apply(enc.fit_transform)

        target = dataset[columns[-1]]
        features = dataset.drop([columns[-1]], axis=1)
        x_train, x_test, y_train, y_test = train_test_split(
            features, target, test_size=0.8, random_state=42)

        self.x_train = x_train
        self.x_test = x_test
        self.y_train = y_train
        self.y_test = y_test

    @fire_and_forget
    def svm(self):
        params_grid = {'C': [0.5, 1, 1.5, 2],
                       'gamma': [1, 0.1, 0.001, 0.0001],
                       'kernel': ['linear', 'rbf']}
        try:

            cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=1)
            grid = GridSearchCV(
                SVC(),
                params_grid,
                scoring="accuracy",
                n_jobs=-1,  # -1 means all CPUs
                refit=True,  # refit to best model
                cv=cv,  # cross validation
                # verbose=3,   #  for full output
            )
            grid.fit(self.x_train, self.y_train)

            C = grid.best_params_['C']
            kernel = grid.best_params_['kernel']
            gamma = grid.best_params_['gamma']

            clf = SVC(C=C, kernel=kernel, gamma=gamma)
            clf.fit(self.x_train, self.y_train)
            y_pred = clf.predict(self.x_test)

            accuracy = accuracy_score(self.y_test, y_pred)
            confusion = confusion_matrix(self.y_test, y_pred)
            classification = classification_report(self.y_test, y_pred)
            recall = recall_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            precision = precision_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            f1 = f1_score(self.y_test, y_pred,
                          average='micro', zero_division=1)

            print("SVM", "Accuracy: " + str(accuracy * 100))
            result = {
                'model': 'SVM',
                'accuracy': str(round(accuracy * 100, 2)),
                'recall': str(round(recall * 100, 2)),
                'precision': str(round(precision * 100, 2)),
                'f1_score': str(round(f1 * 100, 2)),
                'confusion_matrix': confusion,
                'classification_report': classification,
            }

            filename = './uploads/'+self.id+'-SVM.sav'
            pickle.dump(clf, open(filename, 'wb'))
            self.send_results(result, filename)
        except Exception as e:
            print(e)
            result = {
                'model': 'SVM',
                'error': True
            }
            self.send_error(result)

    @fire_and_forget
    def logistic_regression(self):
        params_grid = {
            'penalty': ['l2'],
            'C': [0.001, 0.01, 0.1, 1, 10, 100, 1000],
            'solver': ['newton-cg', 'lbfgs', 'sag', 'saga']
        }
        try:
            cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=1)
            grid = GridSearchCV(
                LogisticRegression(max_iter=1000000),
                params_grid,
                scoring='accuracy',
                n_jobs=-1,  # -1 means all CPUs
                refit=True,  # refit to best model
                cv=cv,  # cross validation
                # verbose=3,  # for full output
            )
            grid.fit(self.x_train, self.y_train)

            C = grid.best_params_['C']
            penalty = grid.best_params_['penalty']
            solver = grid.best_params_['solver']

            clf = LogisticRegression(
                solver=solver,
                C=C,
                penalty=penalty,
                max_iter=10000000)
            clf.fit(self.x_train, self.y_train)

            y_pred = clf.predict(self.x_test)

            accuracy = accuracy_score(self.y_test, y_pred)
            confusion = confusion_matrix(self.y_test, y_pred)
            classification = classification_report(self.y_test, y_pred)
            recall = recall_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            precision = precision_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            f1 = f1_score(self.y_test, y_pred,
                          average='micro', zero_division=1)

            print("LR", str(accuracy))
            result = {
                'id': self.id,
                'model': 'Logistic Regression',
                'accuracy': str(round(accuracy * 100, 2)),
                'recall': str(round(recall * 100, 2)),
                'precision': str(round(precision * 100, 2)),
                'f1_score': str(round(f1 * 100, 2)),
                'confusion_matrix': confusion,
                'classification_report': classification,
            }
            filename = './uploads/'+self.id+'-logistic_regression.sav'
            pickle.dump(clf, open(filename, 'wb'))
            self.send_results(result, filename)
        except:
            result = {
                'id': self.id,
                'model': 'Logistic Regression',
                'error': True

            }
            self.send_error(result)

    @fire_and_forget
    def random_forest(self):
        params_grid = {'max_depth': [2, 3, 5, 10, 20],
                       'min_samples_leaf': [5, 10, 20, 50, 100, 200],
                       'n_estimators': [10, 25, 30, 50, 100, 200]
                       }
        try:
            cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=1)
            grid = GridSearchCV(
                RandomForestClassifier(random_state=42, n_jobs=-1),
                params_grid,
                scoring="accuracy",
                n_jobs=-1,  # -1 means all CPUs
                refit=True,  # refit to best model
                cv=cv,  # cross validation
                # verbose=3,  # for full output
            )

            grid.fit(self.x_train, self.y_train)

            max_depth = grid.best_params_['max_depth']
            min_samples_leaf = grid.best_params_['min_samples_leaf']
            n_estimators = grid.best_params_['n_estimators']

            clf = RandomForestClassifier(random_state=42, n_jobs=-1, max_depth=max_depth,
                                         min_samples_leaf=min_samples_leaf, n_estimators=n_estimators, oob_score=True)
            clf.fit(self.x_train, self.y_train)

            y_pred = clf.predict(self.x_test)

            accuracy = accuracy_score(self.y_test, y_pred)
            confusion = confusion_matrix(self.y_test, y_pred)
            classification = classification_report(self.y_test, y_pred)
            recall = recall_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            precision = precision_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            f1 = f1_score(self.y_test, y_pred,
                          average='micro', zero_division=1)

            print("RF", str(accuracy))
            result = {
                'id': self.id,
                'model': 'Random Forest',
                'accuracy': str(round(accuracy * 100, 2)),
                'recall': str(round(recall * 100, 2)),
                'precision': str(round(precision * 100, 2)),
                'f1_score': str(round(f1 * 100, 2)),
                'confusion_matrix': confusion,
                'classification_report': classification,
            }
            filename = './uploads/'+self.id+'-random_forest.sav'
            pickle.dump(clf, open(filename, 'wb'))
            self.send_results(result, filename)
        except Exception as e:
            print(e)
            result = {
                'id': self.id,
                'model': 'Random Forest',
                'error': True

            }
            self.send_error(result)

    @fire_and_forget
    def knn(self):
        params_grid = {
            'n_neighbors': list(range(10, 31, 2)),
            'leaf_size': list(range(10, 31, 2)),
            'p': (1, 2),
            'weights': ('uniform', 'distance'),
            'metric': ('minkowski', 'chebyshev'),
        }
        try:

            st_x = StandardScaler()
            x_train = st_x.fit_transform(self.x_train)
            x_test = st_x.transform(self.x_test)

            cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=1)
            grid = GridSearchCV(
                KNeighborsClassifier(algorithm='auto'),
                params_grid,
                scoring="accuracy",
                n_jobs=-1,  # -1 means all CPUs
                return_train_score=False,  # refit to best model
                cv=cv,  # cross validation
                # verbose=3,  # for full output
            )

            grid.fit(x_train, self.y_train)

            n_neighbors = grid.best_params_['n_neighbors']
            leaf_size = grid.best_params_['leaf_size']
            p = grid.best_params_['p']
            weights = grid.best_params_['weights']
            metric = grid.best_params_['metric']

            clf = KNeighborsClassifier(algorithm='auto', leaf_size=leaf_size, metric=metric,
                                       n_jobs=-1, n_neighbors=n_neighbors, p=p,
                                       weights=weights)

            clf.fit(x_train, self.y_train)
            y_pred = clf.predict(x_test)

            accuracy = accuracy_score(self.y_test, y_pred)
            confusion = confusion_matrix(self.y_test, y_pred)
            classification = classification_report(self.y_test, y_pred)
            recall = recall_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            precision = precision_score(
                self.y_test, y_pred, average='micro', zero_division=1)
            f1 = f1_score(self.y_test, y_pred,
                          average='micro', zero_division=1)

            print("K-Nearest Neighbor Accuracy:", str(accuracy))
            result = {
                'id': self.id,
                'model': 'K-Nearest Neighbor',
                'accuracy': str(round(accuracy * 100, 2)),
                'recall': str(round(recall * 100, 2)),
                'precision': str(round(precision * 100, 2)),
                'f1_score': str(round(f1 * 100, 2)),
                'confusion_matrix': confusion,
                'classification_report': classification,
            }
            filename = './uploads/'+self.id+'-knn.sav'
            pickle.dump(clf, open(filename, 'wb'))
            self.send_results(result, filename)

        except Exception as e:
            print(e)
            result = {
                'id': self.id,
                'model': 'KNN',
                'error': True

            }
            self.send_error(result)

    @ fire_and_forget
    def create_model(self):

        if not os.path.exists(os.path.join(self.csv)):
            print("File Not Found")
            return

        if not id:
            print("No ID")
            return

        error = False
        try:
            self.pre_processing()
        except:
            error = True

        if error:
            return

        self.svm()
        self.logistic_regression()
        self.random_forest()
        self.knn()

    @ fire_and_forget
    def send_results(self, payload, file):
        url = 'http://localhost:9000/model/trained'
        _payload = {}

        for key, value in payload.items():
            _payload[key] = value

        files = {'file': open(file, 'rb')}
        res = requests.request("POST", url,
                               data=_payload, files=files)

        if os.path.exists(file):
            os.remove(file)
        if os.path.exists(self.csv):
            os.remove(self.csv)

    @ fire_and_forget
    def send_error(self, payload):

        url = 'http://localhost:9000/model/error-training'

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        requests.post(url,
                      data=json.dumps(payload),
                      headers=headers)
