import yaml
from joblib import dump, load
import pandas as pd
from .dataset import symptoms_label
from django.conf import settings
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB


class DiseasePrediction:
    def __init__(self):
        self.clf = None
        self.__load__conf__()
        self.__init__vars__()
        self.__load__dset__()


    def __load__conf__(self):
        with open(f'{str(settings.BASE_DIR)}/appDisease/predictor/config.yaml', 'r') as f:
            self.config = yaml.safe_load(f)

    def __init__vars__(self):
        self.verbose = self.config['verbose']
        self.model_name = self.config['model_type']
        self.model_save_path = self.config['model_save_path']

    def __load__dset__(self):
        self.train_features, self.train_labels, self.train_df = self._load_train_dataset()
        self.test_features, self.test_labels, self.test_df = self._load_test_dataset()

