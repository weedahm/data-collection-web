from django.urls import path

from . import views

app_name = 'data_collecting'
urlpatterns = [
    path('login', views.login, name='login'),
    path('authenticate', views.authenticate, name='authenticate'),
    path('', views.index, name='index'),
    path('submit', views.submit, name='submit'),
    path('patients/', views.patients, name='patients'),
    path('patient/<str:chart_id>', views.patient, name='patient')
]