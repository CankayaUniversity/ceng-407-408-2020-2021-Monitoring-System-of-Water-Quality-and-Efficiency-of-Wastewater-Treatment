from django.urls import path
from . import views
from . import db_load
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('',views.getRoutes, name="routes" ),
    # path('api/login',views.handleLogin,name="login"),
    path('api/locations/',views.getLocations,name="locations"),
    path('api/locations/<str:tip>',views.getSpecificLocations,name="specificloc"),
    path('api/locations/<str:tip>/<str:bolge>',views.getSpecificYer,name="specificyer"),
    path('api/locations/<str:tip>/<str:bolge>/<str:yer>',views.getSpecificParameters,name="specificparam"),
    path('api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>/',views.getSpecificYears,name="specificyil"),
    path('api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:yil>',views.getSpecificMonths,name="specificmonths"),
    path('api/reading/',views.getReading,name="reading"),
    path('api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil>/',views.getSpecificReading,name="spesificreading"),
    path('api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil1>/<str:yil2>/',views.getSpecificReadingBetweenDates,name="specificreadingbetween"),
    path('api/readingtypes/',views.getReadingTypes,name="readingtypes"),
    path('api/readingtypes/<str:tip>',views.getSpecificReadingTypes,name="specificreadingtypes"),
    path('api/csv/<str:bolge>/<str:yer>/<int:yil>/', views.getDataCsvWithParams, name="datacsvparams"),
    path('api/arima/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>/', views.getArimaResults, name="dataarima"),

    path('api/referans/<int:yil>/<str:tip>',views.getReference,name="referans"),
    path('api/postreferans/',views.postReference,name="postreferans"),

    path('api/csv', views.getDataCSV, name="datacsv"),
    path('api/veriGirisi',views.postVeriGirisi,name="postVeriGirisi"),

    path('api/login/',views.LoginView.as_view(),name="login"),
    path('api/user/logout/blacklist/',views.BlacklistTokenUpdateView.as_view(),name="logout"),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

VERI_YUKLE = False # Bu True ise veri sql'e yüklenmeye başlar, uzun sürebilir!!!

if VERI_YUKLE:
    db_load.db_load()
