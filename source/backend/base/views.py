from django.shortcuts import render

from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.views import APIView
import json

# Create your views here.

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        print("req :", request)
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def postVeriGirisi(request):
    insert_to_db = []
    
    # get parameters
    readingTypeArray = clearReadingTypes(request.data["table_type"])
    stringParameters = ['Açıklama', 'Renk', 'Koku', 'Renk / Koku']

    # find the number of parameters
    iler = []
    j=0
    for r in readingTypeArray:
        iler.append(str(j))
        j += 1

    aylar = [["ocak","-01-01"], ["subat", "-02-01"], ["mart","-03-01"], ["nisan", "-04-01"], ["mayis", "-05-01"], ["haziran", "-06-01"], ["temmuz", "-07-01"], ["agustos", "-08-01"], ["eylul", "-09-01"], ["ekim", "-10-01"], ["kasim", "-11-01"], ["aralik", "-12-01"]]
    
    #find max unique_row_id
    unique_row_ids = Reading.objects.values_list("unique_row_id",flat=True)
    max_row_id = 0
    for id in unique_row_ids:
        if (id > max_row_id):
            max_row_id = id

    # save data
    lc = Location.objects.get(bolge_adi= request.data["bolge_adi"],yer= request.data["yer"])
    for ay in aylar:
        dateValue = request.data["date"] + ay[1]
        for i in iler:
            rt = ReadingType.objects.get(name= request.data[i]["id"])
            if (str(rt) in stringParameters):
                if request.data[i][ay[0]] != None:
                    r = Reading(reading_type= rt, table_type=request.data["table_type"], location= lc,  reading_string_value= request.data[i][ay[0]], unique_row_id= max_row_id + 1, date=dateValue) #araliklar
                    insert_to_db.append(r)
            else:
                if request.data[i][ay[0]] != None:
                    if request.data[i][ay[0]] == "":
                        request.data[i][ay[0]] = None
                    elif request.data[i][ay[0]][0] == "<":
                        num = float(request.data[i][ay[0]][1:])
                        request.data[i][ay[0]] = num - num * 0.01
                    elif request.data[i][ay[0]][0] == ">":
                        num = float(request.data[i][ay[0]][1:])
                        request.data[i][ay[0]] = num + num * 0.01

                    r = Reading(reading_type= rt, table_type=request.data["table_type"], location= lc,  reading_value= request.data[i][ay[0]], unique_row_id= max_row_id + 1, date=dateValue) #araliklar
                    insert_to_db.append(r)
        max_row_id += 1
    
    # Reading.objects.bulk_create(insert_to_db)
    return Response()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getRoutes(request):
    routes = [
    'api/locations/',
    'api/locations/<str:tip>',
    'api/locations/<str:tip>/<str:bolge>',
    'api/locations/<str:tip>/<str:bolge>/<str:yer>',
    'api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>/',
    'api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:yil>',
    'api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil>/',
    'api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil1>/<str:yil2>/',
    'api/readingtypes/',
    'api/readingtypes/<str:tip>',
    'api/arima/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>/',
    'api/referans/<int:yil>/<str:tip>',
    'api/postreferans/',
    'api/csv',
    'api/csv/<str:bolge>/<str:yer>/<int:yil>/',
    'api/veriGirisi',
    'api/login/',
    'api/user/logout/blacklist/',
    'api/token/',
    'api/token/refresh/',
    ]
    return Response(routes)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificReadingTypes(request, tip):
    return Response(clearReadingTypes(tip))

def clearReadingTypes(tip):
    types = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip).values_list("reading_type__name", flat=True)
    )
    uniquetypes = set(types)
    passTypes = ["Table Type", "Year", "Month", "Bölge Adı", "Numune Adı", "Yer"]
    cleantypes = []
    for data in uniquetypes:
        if data not in passTypes:
            cleantypes.append(data)
    return cleantypes

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getLocations(request):
    locations = Location.objects.all()
    serialize = LocationSerializer(locations, many=True)
    return Response(serialize.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getReadingTypes(request):
    readingType = ReadingType.objects.all()
    serialize = ReadingTypeSerializer(readingType, many=True)
    return Response(serialize.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificLocations(request, tip):
    locations = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip).values_list("location__bolge_adi", flat=True)
    )
    uniqueloc = set(locations)
    return Response(uniqueloc)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificYer(request, tip, bolge):
    locations = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip, location__bolge_adi=bolge).values_list("location__yer", flat=True)
    )
    uniqueloc = set(locations)
    return Response(uniqueloc)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificParameters(request, tip, bolge, yer):
    locations = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip, location__bolge_adi=bolge, location__yer=yer).values_list("reading_type__name", flat=True)
    )
    uniqueloc = set(locations)
    passTypes = ["Table Type", "Year", "Month", "Bölge Adı", "Numune Adı", "Yer"]
    cleantypes = []
    for data in uniqueloc:
        if data not in passTypes:
            cleantypes.append(data)
    return Response(cleantypes)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificYears(request, tip, bolge, yer, parametre):
    if(parametre == "all"):
        locations = (
            Reading.objects.select_related("reading_type", "location")
            .filter(table_type=tip, location__bolge_adi=bolge, location__yer=yer)
        )
        serialize = SpecificDateSerializer(locations, many=True)

        dateValues = []
        for item in serialize.data:
            if not dateValues.__contains__(item["date"][:4]):
                dateValues.append(item["date"][:4])

        return Response(dateValues)
    locations = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip, location__bolge_adi=bolge, location__yer=yer, reading_type__name=parametre)
    )
    serialize = SpecificDateSerializer(locations, many=True)

    dateValues = []
    for item in serialize.data:
        if not dateValues.__contains__(item["date"][:4]):
            dateValues.append(item["date"][:4])

    return Response(dateValues)

def fillEmptyData(data,date,stringData):
    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", ]
    k=0
    filledReading = []
    filledReadingString = []
    filledDate = []
    for i in range(12):
        if k < len(date):
            splittedDate = date[k].split("-")
            if(splittedDate[1] == months[i]):
                filledReading.append(data[k])
                filledReadingString.append(stringData[k])
                filledDate.append(date[k])
                k += 1
            else:
                filledReading.append(None)
                filledReadingString.append(None)
                dataValue = splittedDate[0] + "-" + months[i] + "-" + splittedDate[2]
                filledDate.append(dataValue)
        elif k>0:
            filledReading.append(None)
            filledReadingString.append(None)
            dataValue = splittedDate[0] + "-" + months[i] + "-" + splittedDate[2]
            filledDate.append(dataValue)
        else:
            filledReading.append(None)
            filledReadingString.append(None)
            filledDate.append(months[i])
    filledData = []
    filledData.append(filledReading)
    filledData.append(filledDate)
    filledData.append(filledReadingString)

    return filledData

def getReferenceAndColors(data, table_type, parametre):
    stringParameters = ['Açıklama', 'Renk', 'Koku', 'Renk / Koku', 'Debi (Saniye)']
    referenceAndColors = []
    if parametre in stringParameters:
        referenceAndColors.append(None)
        referenceAndColors.append(None)
        return referenceAndColors
    referans = []
    colors = []

    
    years = Reference.objects.filter(su_tipi=table_type).values_list('yonetmelik_yili', flat=True)
    cleanYears = []
    for y in years:
        if int(y) not in cleanYears:
            cleanYears.append(int(y))
    cleanYears.sort(reverse=True)
    year = data[1][1][:4]
    for y in cleanYears:
        if int(year) > y:
            y_year = y
            references = Reference.objects.filter(yonetmelik_yili=y_year, su_tipi=table_type)
            serialize = ReferenceSerializer(references, many=True)
            p = str(parametre).replace(" ", "_")
            
            for i in range(5):
                if serialize.data[i][p] != None:
                    referans.append(serialize.data[i][p])
            break
    
    sinifColors = ["rgb(100, 210, 240)","rgb(200, 220, 140)","rgb(240, 220, 135)","rgb(245, 180, 100)","rgb(245, 100, 125)"]
    
    if parametre == "pH":
        if referans.__len__() != 0:
            for value in data[0]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if abs(value - 7) < referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")

    elif parametre == "Çözünmüş Oksijen":
        if referans.__len__() != 0:
            for value in data[0]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if value > referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")
    else:     
        if referans.__len__() != 0:
            for value in data[0]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if value < referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")

    if referans.__len__() == 0:
        referenceAndColors.append(None)
    else:
        referenceAndColors.append(referans)

    if colors.__len__() == 0:
        referenceAndColors.append(None)
    else:
        referenceAndColors.append(colors)

    return referenceAndColors
    

def JsonVeri(bolge, yer, parametre, yil):
    reading = Reading.objects.select_related("reading_type", "location").filter(
        reading_type__name=parametre,
        location__bolge_adi=bolge,
        location__yer=yer,
        date__contains=yil,
    )
    serialize = TemizSerializer(reading, many=True)

    if len(serialize.data) == 0:
        jsonObject = {
            "location": {
                "numune_adi": "error",
                "bolge_adi": bolge,
                "yer": yer,
                "dd_north": "error",
                "dd_east": "error",
            },
            "reading_type": {"name": parametre},
            "table_type": "error",
            "reading_value": [None,None,None,None,None,None,None,None,None,None,None,None],
            "date": [yil+"01-01", yil+"02-01", yil+"03-01", yil+"04-01", yil+"05-01", yil+"06-01", yil+"07-01", yil+"08-01", yil+"09-01", yil+"010-01", yil+"11-01", yil+"12-01", ],
        }
        return jsonObject
    readingValues = []
    readingStringValues = []
    dateValues = []
    for item in serialize.data:
        readingValues.append(item["reading_value"])
        readingStringValues.append(item["reading_string_value"])
        dateValues.append(item["date"])

    filledData = fillEmptyData(readingValues, dateValues, readingStringValues)
    referenceAndColors = getReferenceAndColors(filledData, serialize.data[0]["table_type"], serialize.data[0]["reading_type"]["name"])
    
    jsonObject = {
        "location": {
            "numune_adi": serialize.data[0]["location"]["numune_adi"],
            "bolge_adi": serialize.data[0]["location"]["bolge_adi"],
            "yer": serialize.data[0]["location"]["yer"],
            "dd_north": serialize.data[0]["location"]["dd_north"],
            "dd_east": serialize.data[0]["location"]["dd_east"],
        },
        "reading_type": {"name": serialize.data[0]["reading_type"]["name"]},
        "table_type": serialize.data[0]["table_type"],
        "reading_value": filledData[0],
        "reading_string_value": filledData[2],
        "date": filledData[1],
        "referans": referenceAndColors[0],
        "colors": referenceAndColors[1],
    }
    
    return jsonObject

def allParametre(bolge, yer, parametre, yil):
    reading = Reading.objects.select_related("reading_type", "location").filter(
        location__bolge_adi=bolge, location__yer=yer, date__contains=yil
    )
    serialize = SpecificReadingTypeSerializer(reading, many=True)

    readingTypeArray = []
    for item in serialize.data:
        if not readingTypeArray.__contains__(item["reading_type"]["name"]):
            readingTypeArray.append(item["reading_type"]["name"])

    jsn = []
    passTypes = ["Table Type", "Year", "Month", "Bölge Adı", "Numune Adı", "Yer"]
    for i in range(len(readingTypeArray)):
        if readingTypeArray[i] not in passTypes:
            jsnveri = JsonVeri(bolge, yer, readingTypeArray[i], yil)
            jsn.append(jsnveri)

    return jsn

def allYear(bolge, yer, parametre, yil):
    reading = Reading.objects.select_related("reading_type", "location").filter(
        reading_type__name=parametre, location__bolge_adi=bolge, location__yer=yer
    )
    serialize = TemizSerializer(reading, many=True)

    dateValues = []
    for item in serialize.data:
        if not dateValues.__contains__(item["date"][:4]):
            dateValues.append(item["date"][:4])

    jsn = []
    for i in range(len(dateValues)):
        jsnveri = JsonVeri(bolge, yer, parametre, dateValues[i])
        jsn.append(jsnveri)

    datas = []
    for j in jsn:
        datas.append(j["reading_value"])

    monthValues = []
    monthData = []
    for i in range(12):
        monthData = []
        for k in range(len(datas)):
            monthData.append(datas[k][i])
        monthValues.append(monthData)

    jsnObject = {
        "location": {
            "numune_adi": serialize.data[0]["location"]["numune_adi"],
            "bolge_adi": serialize.data[0]["location"]["bolge_adi"],
            "yer": serialize.data[0]["location"]["yer"],
            "dd_north": serialize.data[0]["location"]["dd_north"],
            "dd_east": serialize.data[0]["location"]["dd_east"],
        },
        "reading_type": {"name": serialize.data[0]["reading_type"]["name"]},
        "table_type": serialize.data[0]["table_type"],
        "reading_value": {
            "Ocak": monthValues[0],
            "Şubat": monthValues[1],
            "Mart": monthValues[2],
            "Nisan": monthValues[3],
            "Mayıs": monthValues[4],
            "Haziran": monthValues[5],
            "Temmuz": monthValues[6],
            "Ağustos": monthValues[7],
            "Eylül": monthValues[8],
            "Ekim": monthValues[9],
            "Kasım": monthValues[10],
            "Aralık": monthValues[11],
        },
        "date": dateValues,
        "referans": jsn[0]['referans'],
        # "colors": referenceAndColors[1],
    }
    return jsnObject

def allParametreYear(bolge, yer, parametre, yil):
    reading = Reading.objects.select_related("reading_type", "location").filter(
        location__bolge_adi=bolge, location__yer=yer
    )
    serialize = TemizSerializer(reading, many=True)

    dateValues = []
    for item in serialize.data:
        if not dateValues.__contains__(item["date"][:4]):
            dateValues.append(item["date"][:4])

    jsn = []
    for i in range(len(dateValues)):
        jsnveri = allParametre(bolge, yer, parametre, dateValues[i])
        jsn.append(jsnveri)

    return jsn


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificReading(request, bolge, yer, parametre, yil):

    # butun parametreler + butun yillar
    if parametre == "all" and yil == "all":
        return Response(allParametreYear(bolge, yer, parametre, yil))

    # butun parametler
    if parametre == "all":
        return Response(allParametre(bolge, yer, parametre, yil))

    # butun yillar
    if yil == "all":
        return Response(allYear(bolge, yer, parametre, yil))

    # bir yildaki specific reading
    return Response(JsonVeri(bolge, yer, parametre, yil))

def allBetweenDates(bolge, yer, parametre, sdata):
    dateValues = []
    for item in sdata:
        if not dateValues.__contains__(item["date"][:4]):
            dateValues.append(item["date"][:4])

    jsn = []
    for i in range(len(dateValues)):
        jsnveri = JsonVeri(bolge, yer, parametre, dateValues[i])
        jsn.append(jsnveri)

    datas = []
    for j in jsn:
        datas.append(j["reading_value"])

    monthValues = []
    monthData = []
    for i in range(12):
        monthData = []
        for k in range(len(datas)):
            monthData.append(datas[k][i])
        monthValues.append(monthData)

    jsnObject = {
        "location": {
            "numune_adi": sdata[0]["location"]["numune_adi"],
            "bolge_adi": sdata[0]["location"]["bolge_adi"],
            "yer": sdata[0]["location"]["yer"],
            "dd_north": sdata[0]["location"]["dd_north"],
            "dd_east": sdata[0]["location"]["dd_east"],
        },
        "reading_type": {"name": parametre},
        "table_type": sdata[0]["table_type"],
        "reading_value": {
            "Ocak": monthValues[0],
            "Şubat": monthValues[1],
            "Mart": monthValues[2],
            "Nisan": monthValues[3],
            "Mayıs": monthValues[4],
            "Haziran": monthValues[5],
            "Temmuz": monthValues[6],
            "Ağustos": monthValues[7],
            "Eylül": monthValues[8],
            "Ekim": monthValues[9],
            "Kasım": monthValues[10],
            "Aralık": monthValues[11],
        },
        "date": dateValues,
        "referans": jsn[0]['referans'],
        # "colors": referenceAndColors[1],
    }
    return jsnObject

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSpecificReadingBetweenDates(request, bolge, yer, parametre, yil1, yil2):
    if int(yil1) < int(yil2):
        start = yil1 + "-01-01"
        end = yil2 + "-12-30"
    else:
        start = yil2 + "-01-01"
        end = yil1 + "-12-30"
    reading = Reading.objects.select_related("reading_type", "location").filter(
        location__bolge_adi=bolge, location__yer=yer, date__range=[start, end],
    )
    serialize = TemizSerializer(reading, many=True)

    if parametre == "all":
        readingTypeArray = []
        for item in serialize.data:
            if not readingTypeArray.__contains__(item["reading_type"]["name"]):
                readingTypeArray.append(item["reading_type"]["name"])
        
        jsn = []
        for i in range(len(readingTypeArray)):
            
            jsnveri = allBetweenDates(bolge, yer, readingTypeArray[i],serialize.data)
            jsn.append(jsnveri)
        return Response(jsn)

    return Response(allBetweenDates(bolge, yer, parametre,serialize.data))

# TODO(ag)

import csv, io
from django.http import HttpResponse
from . import generate_csv, arima

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getDataCSV(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="database_export.csv"'

    writer = csv.writer(response)
    generate_csv.get_data(writer)

    return response

@api_view(["GET"])
def getDataCsv(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="database_export.csv"'

    writer = csv.writer(response)
    generate_csv.get_data(writer)

    return response

@api_view(["GET"])
def getDataCsvWithParams(request, bolge: str, yer: str, yil: int):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="database_export.csv"'

    writer = csv.writer(response)
    generate_csv.get_data_with_params(writer, bolge, yer, yil)

    return response

@api_view(["GET"])
def getArimaResults(request, tip, bolge, yer, parametre):
    assert (tip in ['Akarsu', 'Göl', 'Arıtma', 'Deniz']), ("tip param is wrong: " + tip)

    akarsuParams = ["Fekal Koliform", "Toplam Koliform", "Toplam Fosfor", "Toplam Kjeldahl Azotu", "Kimyasal Oksijen İhtiyacı", "Nitrat Azotu", "Çözünmüş Oksijen"]
    arıtmaParams = ["Biyokimyasal Oksijen İhtiyacı", "Kimyasal Oksijen İhtiyacı", "Toplam Fosfor", "Toplam Azot"]
    gölParams = ["Toplam Fosfor", "Toplam Azot", "Klorofil"]
    denizParams = ["Toplam Koliform", "Fekal Koliform", "Amonyak", "Fekal Streptokok"]
    if tip == 'Akarsu':
        if parametre not in akarsuParams:
            return HttpResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
    if tip == 'Deniz':
        if parametre not in denizParams:
            return Response()
    if tip == 'Göl':
        if parametre not in gölParams:
            return Response()
    if tip == 'Arıtma':
        if parametre not in arıtmaParams:
            return Response()

    fd = io.StringIO()
    writer = csv.writer(fd)
    generate_csv.get_data(writer)
    fd.seek(0)

    data_dict = arima.run_arima(fd, bolge, yer, tip)
    fd.close()

    reading = Reading.objects.select_related("reading_type", "location").filter(
        reading_type__name=parametre, location__bolge_adi=bolge, location__yer=yer
    )
    serialize = TemizSerializer(reading, many=True)

    lastDate = serialize.data.pop()["date"].split("-")

    dateValues = []
    yil = lastDate[0]
    ay = lastDate[1]
    for i in range(10):
        if ay == "12":
            yil = str(int(yil) + 1)
            ay = "01"
        else:
            ay = str(int(ay) + 1)
        
        if len(ay) < 2:
            ay = "0" + ay
        datestr = yil + "-" + ay + "-01"
        dateValues.append(datestr)

    referenceAndColors = []
    referans = []
    colors = []
    
    years = Reference.objects.filter(su_tipi=tip).values_list('yonetmelik_yili', flat=True)
    cleanYears = []
    for y in years:
        if int(y) not in cleanYears:
            cleanYears.append(int(y))
    cleanYears.sort()
    print(cleanYears)
    y_year = cleanYears[cleanYears.__len__() - 1]

    references = Reference.objects.filter(yonetmelik_yili=y_year, su_tipi=tip)
    serialize = ReferenceSerializer(references, many=True)
    p = str(parametre).replace(" ", "_")
    
    for i in range(5):
        if serialize.data[i][p] != None:
            referans.append(serialize.data[i][p])
    
    sinifColors = ["rgb(100, 210, 240)","rgb(200, 220, 140)","rgb(240, 220, 135)","rgb(245, 180, 100)","rgb(245, 100, 125)"]
    
    if parametre == "pH":
        if referans.__len__() != 0:
            for value in data_dict[parametre]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if abs(value - 7) < referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")

    elif parametre == "Çözünmüş Oksijen":
        if referans.__len__() != 0:
            for value in data_dict[parametre]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if value > referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")
    else:     
        if referans.__len__() != 0:
            for value in data_dict[parametre]:
                if value == None:
                    colors.append("rgb(255, 255, 255)")
                else:
                    flag = True
                    for i in range(referans.__len__()):
                        if value < referans[i]:
                            flag = False
                            colors.append(sinifColors[i])
                            break
                    if flag:
                        colors.append("rgb(245, 100, 125)")

    if referans.__len__() == 0:
        referenceAndColors.append(None)
    else:
        referenceAndColors.append(referans)

    if colors.__len__() == 0:
        referenceAndColors.append(None)
    else:
        referenceAndColors.append(colors)

    temiz_dict = {}
    temiz_dict["reading_value"] = data_dict[parametre]
    temiz_dict["date"] = dateValues
    temiz_dict["colors"] = referenceAndColors[1]
    temiz_dict["referans"] = referenceAndColors[0]
    return Response(temiz_dict)


@api_view(["GET"])
def getSpecificMonths(request, tip, bolge, yer, yil):
    dates = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip, location__bolge_adi=bolge, location__yer=yer, date__contains=yil)
    )
    serialize = SpecificDateSerializer(dates, many=True)
    numuneKodu = (
        Reading.objects.select_related("reading_type", "location")
        .filter(table_type=tip, location__bolge_adi=bolge, location__yer=yer).values_list("location__numune_adi", flat=True)
    )
    dateValues = []
    for item in serialize.data:
        if not dateValues.__contains__(item["date"][5:7]):
            dateValues.append(item["date"][5:7])
    
    jsn ={
        "numune_adi": numuneKodu[0],
        "months": dateValues,
    }
    return Response(jsn)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getReference(request, yil, tip):
    references = Reference.objects.filter(yonetmelik_yili=yil, su_tipi=tip)
    parametreler = [
        "Amonyum_Azotu",
        "Elektriksel_İletkenlik",
        "Toplam_Koliform",
        "Tuzluluk",
        "Nitrat_Azotu",
        "Çözünmüş_Oksijen",
        "Biyokimyasal_Oksijen_İhtiyacı",
        "Toplam_Pestisit",
        "Debi",
        "Kimyasal_Oksijen_İhtiyacı",
        "Nitrit_Azotu",
        "Toplam_Kjeldahl_Azotu",
        "Fekal_Koliform",
        "Toplam_Fosfor",
        "Sıcaklık",
        "Toplam_Çözünmüş_Madde",
        "Askıda_Katı_Madde",
        "Orto_Fosfat",
        "Fekal_Streptokok",
        "Amonyak",
        "Toplam_Fenol",
        "Klorofil",
        "Toplam_Azot",
        "Işık_Geçirgenliği",
        "Yağ",
        "pH",
        "Renk",
        "Renk_Koku",
        "Koku",
    ]
    jsnArray = []

    if not references:
        for p in parametreler:
            jsn = {
                'id': p,
                'Sınıf_1': None,
                'Sınıf_2': None,
                'Sınıf_3': None,
                'Sınıf_4': None,
                'Sınıf_5': None,
            }
            jsnArray.append(jsn)
        return Response(jsnArray)

    serialize = ReferenceSerializer(references, many=True)
    for p in parametreler:
        valueArray = []
        for i in range(5):
            
            valueArray.append(serialize.data[i][p])
        jsn = {
            'id': p,
            'Sınıf_1': valueArray[0],
            'Sınıf_2': valueArray[1],
            'Sınıf_3': valueArray[2],
            'Sınıf_4': valueArray[3],
            'Sınıf_5': valueArray[4],
        }
        jsnArray.append(jsn)
    return Response(jsnArray)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def postReference(request):
    siniflar = ['Sınıf_1','Sınıf_2','Sınıf_3','Sınıf_4','Sınıf_5']
    params = []
    data = []
    iler = []
    for i in range(29):
        iler.append(str(i))
    
    for i in iler:
        params.append(request.data[i]['id'])
        values = []
        for s in siniflar:
            values.append(request.data[i][s])
        jsn = {
            request.data[i]['id']: values
        }
        data.append(jsn)

    parametreler = [
			"Amonyum_Azotu",
			"Elektriksel_İletkenlik",
			"Toplam_Koliform",
			"Tuzluluk",
			"Nitrat_Azotu",
			"Çözünmüş_Oksijen",
			"Biyokimyasal_Oksijen_İhtiyacı",
			"Toplam_Pestisit",
			"Debi",
			"Kimyasal_Oksijen_İhtiyacı",
			"Nitrit_Azotu",
			"Toplam_Kjeldahl_Azotu",
			"Fekal_Koliform",
			"Toplam_Fosfor",
			"Sıcaklık",
			"Toplam_Çözünmüş_Madde",
			"Askıda_Katı_Madde",
			"Orto_Fosfat",
			"Fekal_Streptokok",
			"Amonyak",
			"Toplam_Fenol",
			"Klorofil",
			"Toplam_Azot",
			"Işık_Geçirgenliği",
			"Yağ",
			"pH",
			"Renk",
			"Renk_Koku",
			"Koku",
		]
    sinifArray = []
    for i in range(5):
        k = 0
        sinifValues = []
        for p in parametreler:
            sinifValues.append(data[k][p][i])
            k = k+1
        sinifArray.append(sinifValues)
    
    sinifStrings = ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf']

    references = Reference.objects.filter(yonetmelik_yili=request.data["yonetmelik_yili"], su_tipi=request.data["table_type"])
    if not references:
        #create new
        insert_to_db = []
        for i in range(5):
            r = Reference(
                yonetmelik_yili = request.data["yonetmelik_yili"],
                su_tipi = request.data["table_type"],
                sinif = sinifStrings[i],

                Amonyum_Azotu = sinifArray[i][0],
                Elektriksel_İletkenlik = sinifArray[i][1],
                Toplam_Koliform = sinifArray[i][2],
                Tuzluluk = sinifArray[i][3],
                Nitrat_Azotu = sinifArray[i][4],
                Çözünmüş_Oksijen = sinifArray[i][5],
                Biyokimyasal_Oksijen_İhtiyacı = sinifArray[i][6],
                Toplam_Pestisit = sinifArray[i][7],
                Debi = sinifArray[i][8],
                Kimyasal_Oksijen_İhtiyacı = sinifArray[i][9],
                Nitrit_Azotu = sinifArray[i][10],
                Toplam_Kjeldahl_Azotu = sinifArray[i][11],
                Fekal_Koliform = sinifArray[i][12],
                Toplam_Fosfor = sinifArray[i][13],
                Sıcaklık = sinifArray[i][14],
                Toplam_Çözünmüş_Madde = sinifArray[i][15],
                Askıda_Katı_Madde = sinifArray[i][16],
                Orto_Fosfat = sinifArray[i][17],
                Fekal_Streptokok = sinifArray[i][18],
                Amonyak = sinifArray[i][19],
                Toplam_Fenol = sinifArray[i][20],
                Klorofil = sinifArray[i][21],
                Toplam_Azot = sinifArray[i][22],
                Işık_Geçirgenliği = sinifArray[i][23],
                Yağ = sinifArray[i][24],
                pH = sinifArray[i][25],
                Renk = sinifArray[i][26],
                Renk_Koku = sinifArray[i][27],
                Koku = sinifArray[i][28],
            )
            insert_to_db.append(r)
        Reference.objects.bulk_create(insert_to_db)
        return Response()
    else:
        #update
        for i in range(5):
            r = Reference.objects.get(
                yonetmelik_yili = request.data["yonetmelik_yili"],
                su_tipi = request.data["table_type"],
                sinif = sinifStrings[i],
            )
            if sinifArray[i][0] != "":
                r.Amonyum_Azotu = sinifArray[i][0]
            else:
                r.Amonyum_Azotu = None
            if sinifArray[i][1] != "":
                r.Elektriksel_İletkenlik = sinifArray[i][1]
            else:
                r.Elektriksel_İletkenlik = None
            if sinifArray[i][2] != "":
                r.Toplam_Koliform = sinifArray[i][2]
            else:
                r.Toplam_Koliform = None
            if sinifArray[i][3] != "":
                r.Tuzluluk = sinifArray[i][3]
            else:
                r.Tuzluluk = None
            if sinifArray[i][4] != "":
                r.Nitrat_Azotu = sinifArray[i][4]
            else:
                r.Nitrat_Azotu = None
            if sinifArray[i][5] != "":
                r.Çözünmüş_Oksijen = sinifArray[i][5]
            else:
                r.Çözünmüş_Oksijen = None
            if sinifArray[i][6] != "":
                r.Biyokimyasal_Oksijen_İhtiyacı = sinifArray[i][6]
            else:
                r.Biyokimyasal_Oksijen_İhtiyacı = None
            if sinifArray[i][7] != "":
                r.Toplam_Pestisit = sinifArray[i][7]
            else:
                r.Toplam_Pestisit = None
            if sinifArray[i][8] != "":
                r.Debi = sinifArray[i][8]
            else:
                r.Debi = None
            if sinifArray[i][9] != "":
                r.Kimyasal_Oksijen_İhtiyacı = sinifArray[i][9]
            else:
                r.Kimyasal_Oksijen_İhtiyacı = None
            if sinifArray[i][10] != "":
                r.Nitrit_Azotu = sinifArray[i][10]
            else:
                r.Nitrit_Azotu = None
            if sinifArray[i][11] != "":
                r.Toplam_Kjeldahl_Azotu = sinifArray[i][11]
            else:
                r.Toplam_Kjeldahl_Azotu = None
            if sinifArray[i][12] != "":
                r.Fekal_Koliform = sinifArray[i][12]
            else:
                r.Fekal_Koliform = None
            if sinifArray[i][13] != "":
                r.Toplam_Fosfor = sinifArray[i][13]
            else:
                r.Toplam_Fosfor = None
            if sinifArray[i][14] != "":
                r.Sıcaklık = sinifArray[i][14]
            else:
                r.Sıcaklık = None
            if sinifArray[i][15] != "":
                r.Toplam_Çözünmüş_Madde = sinifArray[i][15]
            else:
                r.Toplam_Çözünmüş_Madde = None
            if sinifArray[i][16] != "":
                r.Askıda_Katı_Madde = sinifArray[i][16]
            else:
                r.Askıda_Katı_Madde = None
            if sinifArray[i][17] != "":
                r.Orto_Fosfat = sinifArray[i][17]
            else:
                r.Orto_Fosfat = None
            if sinifArray[i][18] != "":
                r.Fekal_Streptokok = sinifArray[i][18]
            else:
                r.Fekal_Streptokok = None
            if sinifArray[i][19] != "":
                r.Amonyak = sinifArray[i][19]
            else:
                r.Amonyak = None
            if sinifArray[i][20] != "":
                r.Toplam_Fenol = sinifArray[i][20]
            else:
                r.Toplam_Fenol = None
            if sinifArray[i][21] != "":
                r.Klorofil = sinifArray[i][21]
            else:
                r.Klorofil = None
            if sinifArray[i][22] != "":
                r.Toplam_Azot = sinifArray[i][22]
            else:
                r.Toplam_Azot = None
            if sinifArray[i][23] != "":
                r.Işık_Geçirgenliği = sinifArray[i][23]
            else:
                r.Işık_Geçirgenliği = None
            if sinifArray[i][24] != "":
                r.Yağ = sinifArray[i][24]
            else:
                r.Yağ = None
            if sinifArray[i][25] != "":
                r.pH = sinifArray[i][25]
            else:
                r.pH = None
            if sinifArray[i][26] != "":
                r.Renk = sinifArray[i][26]
            else:
                r.Renk = None
            if sinifArray[i][27] != "":
                r.Renk_Koku = sinifArray[i][27]
            else:
                r.Renk_Koku = None
            if sinifArray[i][28] != "":
                r.Koku = sinifArray[i][28]
            else:
                r.Koku = None
            r.save()
        return Response()
