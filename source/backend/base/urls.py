from django.urls import path
from . import views
from . import db_load

urlpatterns = [
    path('',views.getRoutes, name="routes" ),
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
    path('api/csv', views.getDataCSV, name="datacsv"),
    # path('api/veriGirisi',views.postVeriGirisi,name="postVeriGirisi"), # TODO merge the GUI branch!!!
]

VERI_YUKLE = False # Bu True ise veri sql'e yüklenmeye başlar, uzun sürebilir!!!

if VERI_YUKLE:
    db_load.db_load()
