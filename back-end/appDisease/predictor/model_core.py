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

    def _load_train_dataset(self):
        df_train = pd.read_csv(str(str(settings.BASE_DIR)) + self.config['dataset']['training_data_path'])
        cols = df_train.columns
        cols = cols[:-2]
        train_features = df_train[cols]
        train_labels = df_train['prognosis']
        assert (len(train_features.iloc[0]) == 132)
        assert (len(train_labels) == train_features.shape[0])
        return train_features, train_labels, df_train

    def _load_test_dataset(self):
        df_test = pd.read_csv(str(settings.BASE_DIR) + self.config['dataset']['test_data_path'])
        cols = df_test.columns
        cols = cols[:-1]
        test_features = df_test[cols]
        test_labels = df_test['prognosis']
        assert (len(test_features.iloc[0]) == 132)
        assert (len(test_labels) == test_features.shape[0])
        return test_features, test_labels, df_test

    def _train_val_split(self):
        X_train, X_val, y_train, y_val = train_test_split(self.train_features, self.train_labels,
                                                          test_size=self.config['dataset']['validation_size'],
                                                          random_state=self.config['random_state'])
        return X_train, y_train, X_val, y_val

    def _select_model(self):
        self.clf = MultinomialNB()
        return self.clf

    def train_model(self):
        X_train, y_train, X_val, y_val = self._train_val_split()
        classifier = self._select_model()
        classifier = classifier.fit(X_train, y_train)
        dump(classifier, str(str(settings.BASE_DIR) + self.model_save_path + f'__{self.model_name}' + ".joblib"))

    def make_prediction(self, test_data=None):
        clf = load(str(str(settings.BASE_DIR) + self.model_save_path + f'__{self.model_name}' + ".joblib"))
        if test_data is not None:
            result = clf.predict(test_data)
            return result
        else: result = clf.predict(self.test_features)
        return result

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

