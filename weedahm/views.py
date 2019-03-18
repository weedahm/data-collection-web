from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib import auth
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db.models import Count

from .models import Patient

import json

def login(request):
    if request.user.is_anonymous:
        context = { 'is_anonymous': True }
        return render(request, 'data_collecting/login.html', context=context)
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
    current_user = request.user
    context = { 'user': current_user }
    return render(request, 'data_collecting/main.html', context=context)

@login_required(login_url='/login')
def patient(request, chart_id):
    try:
        patient = Patient.objects.get(chart_id=chart_id)
    except Patient.DoesNotExist:
        return JsonResponse({})

    last_modified = patient.created_date.strftime("%Y-%m-%d")
    patient.json_data["last_modified"] = last_modified
    if request.user.is_superuser:
        patient.json_data["created_user"] = str(patient.created_user)
    return JsonResponse(patient.json_data)

@login_required(login_url='/login')
def patients(request):
    try:
        if request.user.is_superuser:
            patient = Patient.objects.all().order_by("-chart_id")
        else:
            patient = Patient.objects.filter(created_user=request.user).order_by("-chart_id")    
    except Patient.DoesNotExist:
        return JsonResponse({})
    chart_ids = list((patient.values('chart_id')))
    return JsonResponse(chart_ids, safe=False)

@login_required(login_url='/login')
def num_patients(request):
    n_createdBy = []
    try:
        total_n_patients = Patient.objects.count()
        your_n_patients = Patient.objects.filter(created_user=request.user).count()
        if request.user.is_superuser:
            n_createdBy = list(Patient.objects.values('created_user__username').annotate(Count('created_user')).order_by('-created_user__count'))
    except Patient.DoesNotExist:
        return JsonResponse({})
    return JsonResponse({'total_n_patients': total_n_patients,
                        'your_n_patients': your_n_patients,
                        'n_createdBy': n_createdBy})

@login_required(login_url='/login')
def submit(request):
    received_json_data = json.loads(request.body)
    chart_id = received_json_data['chart_id']
    patient = Patient.objects.filter(chart_id=chart_id)
    if not patient.exists():
        p = Patient(
            chart_id = chart_id,
            json_data = received_json_data,
            created_user = request.user,
        )
        p.save()
        return HttpResponse("Save Success")
    else:
        if not request.user.is_superuser and patient[0].created_user != request.user:
            return HttpResponse("Already Created")
        elif received_json_data != patient[0].json_data:
            patient.update(json_data=received_json_data)
            return HttpResponse("Update Success")
        else:
            return HttpResponse("No Changes")

@login_required(login_url='/login')
def delete(request):
    received_json_data = json.loads(request.body)
    chart_id = received_json_data['deleteID']
    patient = Patient.objects.filter(chart_id=chart_id)
    if patient.exists() and patient[0].created_user == request.user:
        Patient.objects.filter(chart_id=chart_id).delete()
        return HttpResponse("Delete Success")
    else:
        return HttpResponse("Delete Rejected")
    

@login_required(login_url='/ai_prescription')
def ai_prescription(request):
    current_user = request.user
    context = { 'user': current_user }
    return render(request, 'data_collecting/ai_prescription.html', context=context)
