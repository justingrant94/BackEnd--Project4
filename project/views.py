from .views import index  # <-- also new
# <-- added this new import re_path
from django.urls import path, include, re_path
from django.contrib import admin
from django.shortcuts import render


def index(request):
    return render(request, 'build/index.html')


urlpatterns = [
    # ...your other views,
    re_path(r'^.*$', index)  # <-- have this come last using re path.
]
