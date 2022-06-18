from django.urls import path
# views for our Reviews
from .views import CommentListView, CommentDetailView

# default path for this conf file is: /reviews/

urlpatterns = [
    path('', CommentListView.as_view()),
    path('<int:pk>/', CommentDetailView.as_view())
]
