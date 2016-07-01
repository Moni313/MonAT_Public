from django.db import models


class Entry(models.Model):
    pregnancy_id = models.CharField(max_length=255)
    child_id = models.CharField(max_length=255)
    eth22 = models.CharField(max_length=255, blank=True, null=True)
    eth9 = models.CharField(max_length=255, blank=True, null=True)
    eth6 = models.CharField(max_length=255, blank=True, null=True)
    eth4 = models.CharField(max_length=255, blank=True, null=True)
    eth3 = models.CharField(max_length=255, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=5, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    visitDate = models.DateField(format("dd/MM/yy"), blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)

    class Meta:
        ordering = ('pregnancy_id',)


