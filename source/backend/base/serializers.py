from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Reading, ReadingType

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ReadingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingType
        fields = '__all__'
        
class ReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reading
        fields = '__all__'

class TemizReadingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingType
        fields = ['name']

class TemizSerializer(serializers.ModelSerializer):
    reading_type = TemizReadingTypeSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Reading
        fields = ['location','reading_type','table_type','reading_value','date']

class SpecificReadingTypeSerializer(serializers.ModelSerializer):
    reading_type = TemizReadingTypeSerializer(read_only=True)
    class Meta:
        model = Reading
        fields = ['reading_type','table_type']

class SpecificLocationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Reading
        fields = ['location']

class SpecificDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reading
        fields = ['date']