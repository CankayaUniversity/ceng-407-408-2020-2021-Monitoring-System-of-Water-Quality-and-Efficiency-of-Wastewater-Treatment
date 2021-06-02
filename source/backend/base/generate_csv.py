from .models import *

reading_type_names = [
    "Table Type", "Year", "Month", "Bölge Adı", "Numune Adı", "Yer", "Amonyak", "Amonyum Azotu", "Askıda Katı Madde",
    "Toplam Çözünmüş Madde", "Çözünmüş Oksijen", "Debi (Gün)", "Debi (Saniye)", "Elektriksel İletkenlik", "Fekal Streptokok",
    "Fekal Koliform", "Toplam Koliform", "Toplam Fosfor", "Toplam Azot", "Toplam Kjeldahl Azotu", "Toplam Pestisit",
    "Toplam Fenol", "Işık Geçirgenliği", "Kimyasal Oksijen İhtiyacı", "Biyokimyasal Oksijen İhtiyacı", "pH", "Nitrat Azotu",
    "Nitrat", "Nitrit Azotu", "Sıcaklık", "Klorofil", "Tarih", "Tuzluluk", "Yağ", "Orto Fosfat", "Açıklama", "Renk", "Koku", "Renk / Koku"
]

def readings_to_csv(readings_list):
    loc = None
    date = None
    data = {}
    data_list = []
    for reading in readings_list:
        if (reading.location != loc or reading.date != date) or (date == None and loc == None):
            if data: # dict not empty
                if len(data.keys()) == 1 and "Table Type" in data.keys():
                    pass
                else:
                    data["Tarih"] = date.isoformat() # yyyy-mm-dd
                    data["Bölge Adı"] = loc.bolge_adi
                    data["Yer"] = loc.yer
                    data_list.append(data)

            data = {}
            loc = reading.location
            date = reading.date

        flt_val = reading.reading_value
        str_val = reading.reading_string_value

        if flt_val != None:
            data[reading.reading_type.name] = flt_val
        elif str_val != None:
            data[reading.reading_type.name] = str_val
        else:
            pass

    if data:
        data_list.append(data)
    return data_list

def get_data():
    orm_response = Reading.objects.select_related('location', 'reading_type').all()
    reading_list = readings_to_csv(list(orm_response))
    return reading_list
