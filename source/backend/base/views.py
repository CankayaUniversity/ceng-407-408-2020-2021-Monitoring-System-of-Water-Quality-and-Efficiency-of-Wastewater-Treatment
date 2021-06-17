from django.shortcuts import render

from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from . import referansAraliklari
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.views import APIView

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

# def is_decision_maker(user):
#     if user.groups.filter(name= "veriGorsellestirici").exists():
#         return True
#     if user.groups.filter(name = "veriGirisci").exists():
#         return False

# @api_view(["POST"])
# def handleLogin(request):
#     username = request.data["username"]
#     password = request.data["password"]

#     user = authenticate(request, username = username, password = password)
#     if user is not None:
#         login(request, user)
#         if is_decision_maker(user):
#             veri = {
#                 "username": username,
#                 "group": "veriGorsellestirici"
#             }
#             return Response(data=veri)
#         else:
#             veri = {
#                 "username": username,
#                 "group": "veriGirisci"
#             }
#             return Response(data=veri)
#     else:
#         print("basarisiz")
#     return Response()




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def postVeriGirisi(request):
    insert_to_db = []

    # get parameters
    readingTypeArray = clearReadingTypes(request.data["table_type"])

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

    Reading.objects.bulk_create(insert_to_db)
    return Response()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getRoutes(request):
    routes = [
        'api/locations/',
        'api/locations/<str:tip>',
        'api/locations/<str:tip>/<str:bolge>',
        'api/locations/<str:tip>/<str:bolge>/<str:yer>',
        'api/locations/<str:tip>/<str:bolge>/<str:yer>/<str:parametre>',
        'api/reading/',
        'api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil>/',
        'api/reading/<str:bolge>/<str:yer>/<str:parametre>/<str:yil1>/<str:yil2>',
        'api/readingtypes/',
        'api/readingtypes/<str:tip>',
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
def getReading(request):
    pass
    # reading = Reading.objects.all()
    # serializer = ReadingSerializer(reading, many= True)
    # return Response(serializer.data)


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

def fillEmptyData(data,date):
    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", ]
    k=0
    filledReading = []
    filledDate = []
    for i in range(12):
        if k < len(date):
            splittedDate = date[k].split("-")
            if(splittedDate[1] == months[i]):
                filledReading.append(data[k])
                filledDate.append(date[k])
                k += 1
            else:
                filledReading.append(None)
                dataValue = splittedDate[0] + "-" + months[i] + "-" + splittedDate[2]
                filledDate.append(dataValue)
        elif k>0:
            filledReading.append(None)
            dataValue = splittedDate[0] + "-" + months[i] + "-" + splittedDate[2]
            filledDate.append(dataValue)
        else:
            filledReading.append(None)
            filledDate.append(months[i])
    filledData = []
    filledData.append(filledReading)
    filledData.append(filledDate)

    return filledData

def getReferenceAndColors(data, table_type, parametre):
    referenceAndColors = []
    referans = []
    colors = []
    print(parametre)
    if table_type == "Akarsu":
        for aralik in referansAraliklari.akarsuAralık:
            if aralik[0] == parametre:
                if len(aralik[1]) < 4:
                    referans.append(None)
                    colors.append("rgb(200, 255, 55)")
                else:
                    referans.append(aralik[1])
                    print(referans)
                    for value in data[0]:
                        if value == None:
                            colors.append("rgb(255, 255, 255)")
                        elif value < referans[0][0]:
                            colors.append("rgb(102, 209, 242)")
                        elif value < referans[0][1]:
                            colors.append("rgb(197, 218, 141)")
                        elif value < referans[0][2]:
                            colors.append("rgb(240, 221, 137)")
                        else:
                            colors.append("rgb(245, 103, 126)")
    elif table_type == "Deniz":
        for aralik in referansAraliklari.denizAralık:
            if aralik[0] == parametre:
                if len(aralik[1]) < 4:
                    referans.append(None)
                    colors.append("rgb(200, 255, 55)")
                else:
                    referans.append(aralik[1])
                    print(referans)
                    for value in data[0]:
                        if value == None:
                            colors.append("rgb(255, 255, 255)")
                        elif value < referans[0][0]:
                            colors.append("rgb(102, 209, 242)")
                        elif value < referans[0][1]:
                            colors.append("rgb(197, 218, 141)")
                        elif value < referans[0][2]:
                            colors.append("rgb(240, 221, 137)")
                        else:
                            colors.append("rgb(245, 103, 126)")
    elif table_type == "Göl":
        for aralik in referansAraliklari.gölAralık:
            if aralik[0] == parametre:
                if len(aralik[1]) < 4:
                    referans.append(None)
                    colors.append("rgb(200, 255, 55)")
                else:
                    referans.append(aralik[1])
                    print(referans)
                    for value in data[0]:
                        if value == None:
                            colors.append("rgb(255, 255, 255)")
                        elif value < referans[0][0]:
                            colors.append("rgb(102, 209, 242)")
                        elif value < referans[0][1]:
                            colors.append("rgb(197, 218, 141)")
                        elif value < referans[0][2]:
                            colors.append("rgb(240, 221, 137)")
                        else:
                            colors.append("rgb(245, 103, 126)")
    elif table_type == "Arıtma":
        for aralik in referansAraliklari.arıtmaAralık:
            if aralik[0] == parametre:
                if len(aralik[1]) < 4:
                    referans.append(None)
                    colors.append("rgb(200, 255, 55)")
                else:
                    referans.append(aralik[1])
                    print(referans)
                    for value in data[0]:
                        if value == None:
                            colors.append("rgb(255, 255, 255)")
                        elif value < referans[0][0]:
                            colors.append("rgb(102, 209, 242)")
                        elif value < referans[0][1]:
                            colors.append("rgb(197, 218, 141)")
                        elif value < referans[0][2]:
                            colors.append("rgb(240, 221, 137)")
                        else:
                            colors.append("rgb(245, 103, 126)")
    else:
        return None

    if referans == None:
        referenceAndColors.append(None)
    else:
        referenceAndColors.append(referans[0])

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
    dateValues = []
    for item in serialize.data:
        readingValues.append(item["reading_value"])
        dateValues.append(item["date"])

    filledData = fillEmptyData(readingValues, dateValues)
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
        "date": filledData[1],
        "referans": referenceAndColors[0],
        "colors": referenceAndColors[1],
    }
    print("done")
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
    reading = Reading.objects.all()

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
    start = yil1 + "-01-01"
    end = yil2 + "-12-30"
    reading = Reading.objects.select_related("reading_type", "location").filter(
        location__bolge_adi=bolge, location__yer=yer, date__range=[start, end],
    )
    serialize = TemizSerializer(reading, many=True)

    if parametre == "all":
        readingTypeArray = []
        for item in serialize.data:
            if not readingTypeArray.__contains__(item["reading_type"]["name"]):
                readingTypeArray.append(item["reading_type"]["name"])
        print(readingTypeArray)
        jsn = []
        for i in range(len(readingTypeArray)):
            print(readingTypeArray[i])
            jsnveri = allBetweenDates(bolge, yer, readingTypeArray[i],serialize.data)
            jsn.append(jsnveri)
        return Response(jsn)

    return Response(allBetweenDates(bolge, yer, parametre,serialize.data))

# TODO(ag)

import csv
from django.http import HttpResponse
from . import generate_csv
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getDataCSV(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="database_export.csv"'

    writer = csv.writer(response)
    generate_csv.get_data(writer)

    return response
