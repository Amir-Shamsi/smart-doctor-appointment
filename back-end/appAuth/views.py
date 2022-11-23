import datetime
import hashlib
import pytz
from django.template.loader import get_template
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *

class PasswordHandler:
    @staticmethod
    @api_view(['POST'])
    def forgot_password(request):
        if not request.user.is_anonymous:
            return Response({'User already logged in.'}, status=status.HTTP_406_NOT_ACCEPTABLE)
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = CustomUser.objects.get(personal_ID=serializer.validated_data['personal_ID'],
                                      email=serializer.validated_data['email'])
        if not user: return Response({'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        try: UserHashTable.objects.get(user=user, key='password-reset').delete()
        except: pass
        uht = UserHashTable()
        uht.value = str((hashlib.md5('{}{}'.format(user.personal_ID, uuid.uuid4()).encode()).hexdigest()))
        uht.expire_date = datetime.datetime.now() + datetime.timedelta(hours=24)
        uht.key = 'password-reset'
        uht.user = user
        uht.save()
        HOSTNAME = f'http://127.0.0.1:{request.META["SERVER_PORT"]}'
        subject = 'SDA - Password Reset'
        from_email = settings.EMAIL_HOST_USER
        context = {'full_name': user,
                   'action_url': f'{HOSTNAME}/auth/password/reset?token={uht.value}',
                   'browser_name': '{}(v{})'.format(request.user_agent.browser.family, request.user_agent.browser.version_string),
                   'operating_system': f'{request.user_agent.os.family} version {request.user_agent.os.version_string}',
                   'hostname': HOSTNAME
                   }
        html_content = get_template('emails/password-reset/temp.html').render(context)
        plain_message = get_template('emails/password-reset/temp.txt').render(context)
        try:
            msg = EmailMultiAlternatives(subject, plain_message, from_email, [user.email])
            msg.attach_alternative(html_content, 'text/html')
            msg.send()
        except: return Response({'Something went wrong! we\'re unable to sent email, Try later again.'})
        return Response({'Check your index and spam! Password Rest URL sent to your email.'})

# Create your views here.
