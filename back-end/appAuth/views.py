import datetime
import hashlib
import pytz
from django.template.loader import get_template
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
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
        except: return Response({'Something went wrong! we\'re unable to send email, Try again later.'})
        return Response({'Check your index and spam! Password Rest URL sent to your email.'})

    @staticmethod
    @api_view(['POST'])
    def password_reset(request):
        token = request.GET['token']
        print(token)
        try: uht = UserHashTable.objects.get(key='password-reset', value=token)
        except: uht = None
        if not token or not uht: return Response({'Token is not valid.'})
        if not uht.expire_date.replace(tzinfo=pytz.UTC) >= datetime.datetime.now().replace(tzinfo=pytz.UTC):
            return Response({'Token has been expired.'})
        user = CustomUser.objects.get(personal_ID=uht.user.personal_ID)
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['password'])
        user.save()
        uht.delete()
        return Response({'Password changed successfully.'})


class ProvinceViewSet(ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ProvinceSeriailizer
    queryset = ProvinceState.objects.all()


class CityViewSet(ModelViewSet):

    def get_serializer_class(self):
        if self.request.method == "POST":
            return FindCityByProvinceSerializer
        return  CitySerializer
    queryset = City.objects.select_related("province").all()
    # def get_queryset(self):
    #     queryset = City.objects.filter(province__id=self.kwargs["province_pk"]).all()
    #     return queryset

    def create(self, request, *args, **kwargs):
        # serializer = self.get_serializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # province_pk = self.kwargs["province_pk"]
        # province = ProvinceState.objects.filter(pk=province_pk).first()
        # serializer.save(province=province)
        # return Response(serializer.data, status=status.HTTP_201_CREATED)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        province_pk = serializer.validated_data["province_id"]
        province = ProvinceState.objects.filter(pk=province_pk).first()
        p_serializer = ProvinceSeriailizer(province)
        return Response(p_serializer.data)