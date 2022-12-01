import datetime
import pytz
from rest_framework.response import Response
from .models import *
from .serializers import *

class TokenValidation:
    def __init__(self, token):
        self._token = token
        try: self._uht = UserHashTable.objects.get(key='password-reset', value=self._token)
        except: self._uht = None

    def validate(self):
        if not self._token or not self._uht: return Response({'Token is not valid.'})
        if not self._uht.expire_date.replace(tzinfo=pytz.UTC) >= datetime.datetime.now().replace(tzinfo=pytz.UTC):
            return Response({'Token has been expired.'})
        return True

    def get_user(self):
        return self._uht.user

    def delete(self):
        self._uht.delete()
