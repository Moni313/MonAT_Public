# from django.shortcuts import render
#
#
# def index(request):
#     return render(request, 'DataQuality/index.html')

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
# from rest_framework import generics
# from DataQuality.models import Entry
# from DataQuality.serializers import EntrySerializer


class IndexView(TemplateView):
    template_name = 'DataQuality/index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)

#
# class EntryList(generics.ListCreateAPIView):
#     queryset = Entry.objects.all()
#     serializer_class = EntrySerializer

