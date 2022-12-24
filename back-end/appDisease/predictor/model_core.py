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

