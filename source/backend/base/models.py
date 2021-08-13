from django.db import models

# Create your models here.

from django.conf import settings # settings.AUTH_USER_MODEL için

class ReadingType(models.Model):
    name = models.CharField(max_length = 50, blank=True)
    min_value = models.FloatField(null = True, blank=True) # (Şimdilik null, sonra null = False olacak) Decimal Field daha mantıklı olabilir. 
    max_value = models.FloatField(null = True, blank=True) # (Şimdilik null, sonra null = False olacak) Decimal Field daha mantıklı olabilir. 

    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = 'Parametre'
        verbose_name_plural = 'Parametreler'

class Location(models.Model):
    bolge_adi = models.CharField(max_length = 128, blank=True)
    numune_adi = models.CharField(max_length = 10, null = True, blank=True)
    yer = models.CharField(max_length = 256, blank=True)
    dd_north = models.FloatField(null = True, blank=True)
    dd_east  = models.FloatField(null = True, blank=True)
    
    def __str__(self):
        return str(self.bolge_adi + ' - ' + self.yer)

    class Meta:
        verbose_name = 'Bölge'
        verbose_name_plural = 'Bölgeler'
    
class Reading(models.Model):
    reading_type = models.ForeignKey(ReadingType, on_delete = models.DO_NOTHING)
    table_type = models.CharField(max_length = 15, blank=True)
    location = models.ForeignKey(Location, on_delete = models.DO_NOTHING)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.SET_NULL, null = True, blank=True) # null olma olayı hoşuma gitmedi, başka çözüm gerekebilir
    unique_row_id = models.PositiveBigIntegerField(null = False)

    reading_value = models.FloatField(null = True, blank=True) # Bunlardan sadece biri null olabilir, üstüne düşünmek lazım
    reading_string_value = models.TextField(null = True, blank=True) # Bunlardan sadece biri null olabilir, üstüne düşünmek lazım
    date = models.DateField()
    def __str__(self):
        return str(str(self.location) + ': ' + str(self.reading_type) + ' - ' + str(self.date))
        
    class Meta:
        verbose_name = 'Değer'
        verbose_name_plural = 'Değerler'

class Reference(models.Model):
    yonetmelik_yili = models.CharField(max_length = 15, null = True, blank=True)
    su_tipi = models.CharField(max_length = 15, null = True, blank=True)
    sinif = models.CharField(max_length = 15, null = True, blank=True)
    Amonyum_Azotu = models.FloatField(max_length = 15, null = True, blank=True)
    Elektriksel_İletkenlik = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Koliform = models.FloatField(max_length = 15, null = True, blank=True)
    Tuzluluk = models.FloatField(max_length = 15, null = True, blank=True)
    Nitrat_Azotu = models.FloatField(max_length = 15, null = True, blank=True)
    Çözünmüş_Oksijen = models.FloatField(max_length = 15, null = True, blank=True)
    Biyokimyasal_Oksijen_İhtiyacı = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Pestisit = models.FloatField(max_length = 15, null = True, blank=True)
    Debi = models.FloatField(max_length = 15, null = True, blank=True)
    Kimyasal_Oksijen_İhtiyacı = models.FloatField(max_length = 15, null = True, blank=True)
    Nitrit_Azotu = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Kjeldahl_Azotu = models.FloatField(max_length = 15, null = True, blank=True)
    Fekal_Koliform = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Fosfor = models.FloatField(max_length = 15, null = True, blank=True)
    Sıcaklık = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Çözünmüş_Madde = models.FloatField(max_length = 15, null = True, blank=True)
    Askıda_Katı_Madde = models.FloatField(max_length = 15, null = True, blank=True)
    Orto_Fosfat = models.FloatField(max_length = 15, null = True, blank=True)
    Fekal_Streptokok = models.FloatField(max_length = 15, null = True, blank=True)
    Amonyak = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Fenol = models.FloatField(max_length = 15, null = True, blank=True)
    Klorofil = models.FloatField(max_length = 15, null = True, blank=True)
    Toplam_Azot = models.FloatField(max_length = 15, null = True, blank=True)
    Işık_Geçirgenliği = models.FloatField(max_length = 15, null = True, blank=True)
    Yağ = models.FloatField(max_length = 15, null = True, blank=True)
    pH = models.FloatField(max_length = 15, null = True, blank=True)
    Renk = models.CharField(max_length = 15, null = True, blank=True)
    Renk_Koku = models.CharField(max_length = 15, null = True, blank=True)
    Koku = models.CharField(max_length = 15, null = True, blank=True)
    
    def __str__(self):
        return str(self.yonetmelik_yili + ': ' + self.su_tipi + ' - ' + self.sinif)

    class Meta:
        verbose_name = 'Referans Aralık'
        verbose_name_plural = 'Referans Aralıkları'