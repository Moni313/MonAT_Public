from rest_framework import serializers
from DataQuality.models import Entry


class EntrySerializer(serializers.ModelSerializer):
    entry = serializers.HyperlinkedIdentityField('entry', view_name='entry-list', allow_null=True)

    class Meta:
        model = Entry
        fields = ('pregnancy',
                  'child',
                  'eth22',
                  'eth9',
                  'eth6',
                  'eth4',
                  'eth3',
                  'age',
                  'gender'
                  'source',
                  'weight',
                  'height')