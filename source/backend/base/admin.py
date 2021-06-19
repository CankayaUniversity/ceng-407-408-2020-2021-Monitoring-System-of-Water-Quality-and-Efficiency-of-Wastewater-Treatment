from django.contrib import admin
from .models import *

# Register your models here.

class ReadingAdmin(admin.ModelAdmin):
    search_fields = ('location__bolge_adi', 'location__yer', 'date')

class LocationAdmin(admin.ModelAdmin):
    search_fields = ('bolge_adi', 'yer')

class ReadingTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'min_value', 'max_value')
    search_fields = ('name', )

admin.site.register(Location, LocationAdmin)
admin.site.register(Reading, ReadingAdmin)
admin.site.register(ReadingType, ReadingTypeAdmin)