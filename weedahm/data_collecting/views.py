from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse
# from .forms import PostForm

# Create your views here.

def index(request):
    return render(request, 'data_collecting/main.html')

# def post(request):
#     if request.method == "POST":
#         #save data
#         form = PostForm(request.POST)
#         if form.is_valid():
#             lotto = form.save(commit = False)
#             lotto.generate()
#             return redirect('index')
    
#     else:
#         form = PostForm()
#         return render(request, 'data_collecting/form.html', {'form' : form})