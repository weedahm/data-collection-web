from django.urls import path

from . import views

app_name = 'his'
urlpatterns = [
    path('', views.home, name='home'),
]