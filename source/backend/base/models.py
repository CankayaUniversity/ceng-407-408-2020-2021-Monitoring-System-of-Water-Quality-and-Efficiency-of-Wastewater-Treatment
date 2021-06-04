from django.db import models

# Create your models here.

from django.conf import settings # settings.AUTH_USER_MODEL için

class ReadingType(models.Model):
    name = models.CharField(max_length = 50)
    min_value = models.FloatField(null = True) # (Şimdilik null, sonra null = False olacak) Decimal Field daha mantıklı olabilir. 
    max_value = models.FloatField(null = True) # (Şimdilik null, sonra null = False olacak) Decimal Field daha mantıklı olabilir. 

    def __str__(self):
        return self.name

class Location(models.Model):
    bolge_adi = models.CharField(max_length = 128)
    numune_adi = models.CharField(max_length = 10, null = True)
    yer = models.CharField(max_length = 256)
    dd_north = models.FloatField(null = True)
    dd_east  = models.FloatField(null = True)
    
    def __str__(self):
        return str(self.bolge_adi + ' - ' + self.yer)
    
class Reading(models.Model):
    reading_type = models.ForeignKey(ReadingType, on_delete = models.DO_NOTHING)
    table_type = models.CharField(max_length = 15)
    location = models.ForeignKey(Location, on_delete = models.DO_NOTHING)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.SET_NULL, null = True) # null olma olayı hoşuma gitmedi, başka çözüm gerekebilir
    unique_row_id = models.PositiveBigIntegerField(null = False)

    reading_value = models.FloatField(null = True) # Bunlardan sadece biri null olabilir, üstüne düşünmek lazım
    reading_string_value = models.TextField(null = True) # Bunlardan sadece biri null olabilir, üstüne düşünmek lazım
    date = models.DateField()
    def __str__(self):
        return self.table_type
