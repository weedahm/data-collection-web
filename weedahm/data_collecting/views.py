from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib import auth
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import Patient

import json

def login(request):
    return render(request, 'data_collecting/login.html')

def authenticate(request):
	username = request.POST['username']
	password = request.POST['password']
	user = auth.authenticate(request, username=username, password=password)
	if user is not None:
		auth.login(request, user)
		return HttpResponseRedirect(reverse('data_collecting:index'))
	else:
		return HttpResponseRedirect(reverse('data_collecting:login'))

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect(reverse('data_collecting:login'))

@login_required(login_url='/login')
def index(request):
    return render(request, 'data_collecting/main.html')

@login_required(login_url='/login')
def patient(request, chart_id):
    try:
        patient = Patient.objects.get(chart_id=chart_id)
    except Patient.DoesNotExist:
        return JsonResponse({})
    # encoded = json.dumps(patient.json_data, indent=4, sort_keys=True, ensure_ascii=False)
    # print(encoded)
    return JsonResponse(patient.json_data)

@login_required(login_url='/login')
def patients(request):
    try:
        patient = Patient.objects.all().order_by("-chart_id")
    except Patient.DoesNotExist:
        return JsonResponse({})
    chart_ids = list((patient.values('chart_id')))
    return JsonResponse(chart_ids, safe=False)

@login_required(login_url='/login')
def submit(request):
    received_json_data = json.loads(request.body)
    chart_id = received_json_data['chart_id']
    patient = Patient.objects.filter(chart_id=chart_id)
    if len(patient) == 0:
        p = Patient(
            chart_id = chart_id,
            json_data = received_json_data,
        )
        p.save()
        return HttpResponse("Save Success")
    else:
        if received_json_data != patient[0].json_data:
            patient.update(json_data=received_json_data)
            return HttpResponse("Update Success")
        else:
            return HttpResponse("No Changes")

@login_required(login_url='/login')
def delete(request):
    chart_id = request.POST['deleteId']
    Patient.objects.filter(chart_id=chart_id).delete()
    return HttpResponseRedirect(reverse('data_collecting:index'))
