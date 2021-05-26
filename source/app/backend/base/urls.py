from .models import *
from django.urls import path
from . import views


urlpatterns = [
    path('',views.getRoutes, name="routes" ),
    path('api/login',views.handleLogin,name="login"),
    path('api/locations/',views.getLocations,name="locations"),
    path('api/locations/<str:tip>',views.getSpecificLocations,name="specificloc"),
    path('api/locations/<str:tip>/<str:bolge>',views.getSpecificYer,name="specificloc"),
    path('api/locations/<str:tip>/<str:bolge>/<str:yer>',views.getSpecificParameters,name="specificloc"),
    path('api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>/',views.getSpecificYears,name="specificloc"),
    path('api/reading/',views.getReading,name="reading"),
    path('api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil>/',views.getSpecificReading,name="spesificreading"),
    path('api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil1>/<str:yil2>/',views.getSpecificReadingBetweenDates,name="specificreadingbetween"),
    path('api/readingtypes/',views.getReadingTypes,name="readingtypes"),
    path('api/readingtypes/<str:tip>',views.getSpecificReadingTypes,name="specificreadingtypes"),
    path('api/veriGirisi',views.postVeriGirisi,name="postVeriGirisi"),
]


# VERI_YUKLE = False # Bu True ise veri sql'e yüklenmeye başlar, uzun sürebilir!!!

# import csv
# import datetime

# float_keys = ['Amonyak', 'Amonyum Azotu', 'Askıda Katı Madde', 'Toplam Çözünmüş Madde', 'Çözünmüş Oksijen',
#               'Debi (Gün)', 'Debi (Saniye)', 'Elektriksel İletkenlik', 'Fekal Streptokok', 'Fekal Koliform',
#               'Toplam Koliform', 'Toplam Fosfor', 'Toplam Azot', 'Toplam Kjeldahl Azotu', 'Toplam Pestisit',
#               'Toplam Fenol', 'Işık Geçirgenliği', 'Kimyasal Oksijen İhtiyacı', 'Biyokimyasal Oksijen İhtiyacı',
#               'pH', 'Nitrat Azotu', 'Nitrat', 'Nitrit Azotu', 'Sıcaklık', 'Klorofil', 'Tuzluluk', 'Yağ', 'Orto Fosfat']
# string_keys = ['Table Type', 'Açıklama', 'Renk', 'Koku', 'Renk / Koku']

# def db_load():
#     if not VERI_YUKLE:
#         return
    
#     filename = "csv_data_clean_names.csv"
#     csvfile = open(filename, encoding="utf-8")
#     reader = csv.DictReader(csvfile)
#     all_data = list(reader) # print(all_data)
#     csvfile.close()
    
#     total = len(all_data)
#     count = 0
#     for row in all_data:
#         count += 1
#         print("Row", count, "of", total)

#         _bolge  = row["Bölge Adı"].strip()
#         _numune = row["Numune Adı"].strip()
#         _yer    = row["Yer"].strip()
#         _tablo_tipi = row["Table Type"].strip()
#         _date = datetime.date(int(row["Year"]), int(row["Month"]), 1)

#         (loc, created_loc) = Location.objects.get_or_create(bolge_adi = _bolge, numune_adi = _numune, yer = _yer, utm_x = None, utm_y = None)

#         for key, val in row.items():
#             # if key not in reading_types:
#             (reading_type, created_reading_type) = ReadingType.objects.get_or_create(name = key, min_value = None, max_value = None)

#             val_float = None
#             val_string = None

#             if len(val) == 0:
#                 continue

#             if key in float_keys:
#                 val_float = float(val)
#             elif key in string_keys:
#                 val_string = val
#             else:
#                 continue # raise ValueError("Bunun olmaması lazım :D:D:D:D:D:D:D!!111", key)
#             reading_for_db = Reading.objects.get_or_create(
#                                     reading_type = reading_type,
#                                     table_type = _tablo_tipi,
#                                     location = loc,
#                                     added_by = None,
#                                     reading_value = val_float,
#                                     reading_string_value = val_string,
#                                     date = _date
#                              )

# db_load()
