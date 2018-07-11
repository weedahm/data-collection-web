from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from .models import Patient
from django.http import JsonResponse

import json

def index(request):
    return render(request, 'data_collecting/main.html')

def patient(request, chart_id):
    try:
        patient = Patient.objects.get(chart_id=chart_id)
    except Patient.DoesNotExist:
        return JsonResponse({})
    return JsonResponse(patient.json_data)

def submit(request):
    received_json_data = json.loads(request.body)
    chart_id = received_json_data['chart_id']
    patient = Patient.objects.filter(chart_id=chart_id)
    if patient is None:
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
            print("No Changes!")
            return HttpResponse("No Changes")

    # return render(request, 'data_collecting/main.html')