import csv
import numpy as np
from joblib import load
import pandas as pd
import wikipedia
from .dataset import symptoms_label
from django.conf import settings
from .model_core import DiseasePrediction

class PredictHandler(DiseasePrediction):
    def __init__(self, symptoms):
        super().__init__()
        try:
            load(str(str(settings.BASE_DIR) + 'deci_model/' + f'__mnb' + '.joblib'))
        except Exception:
            self.train_model()
        symp = symptoms_label.symptoms.copy()
        for sym in symptoms:
            symp['_'.join(sym.strip().split(' '))] = 1
        df_test = pd.DataFrame(columns=list(symp.keys()))
        df_test.loc[0] = np.array(list(symp.values()))
        self.result = self.make_prediction(test_data=df_test)

    def get_result(self):
        return str(self.result[0])

    @staticmethod
    def get_precaution(disease):
        info = {}
        with open(str(settings.BASE_DIR) + '/appDisease/predictor/dataset/' + 'symptom_precaution.csv', mode='r') as infile:
            reader = csv.reader(infile)
            for row in reader:
                info[row[0]] = row[1:]
        return info[disease]

    @staticmethod
    def get_description(disease):
        return wikipedia.summary(f'{disease} disease')
        # info = {}
        # with open(str(settings.BASE_DIR) + '/appDisease/predictor/dataset/' + 'symptom_description.csv', mode='r') as infile:
        #     reader = csv.reader(infile)
        #     for row in reader:
        #         info[row[0]] = row[1:]
        # return info[disease]

