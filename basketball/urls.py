# path allows us to set the url pattern with an endpoint and a view
from django.urls import path
from .views import BasketballListView, BasketballDetailView

# any request getting through to this point is prefixed with the /albums/ endpoint

# example: http://localhost:8000/basketball
# id example: http://localhost:8000/basketball/1/

urlpatterns = [
    # as_view passes the http request onto the request attribute on the view/controller
    path('', BasketballListView.as_view()),
    path('<int:pk>/', BasketballDetailView.as_view())
    # this is known as a captured value
    # on the left is our path converter. Here we've specified a type of integer
    # this isn't needed and we could write this like <pk>, but we're being more specific about the type we're expecting
]
