from django.urls import path
from .views import TeamListView

# default for this conf file is: /genres/

urlpatterns = [
    path('', TeamListView.as_view())
]
