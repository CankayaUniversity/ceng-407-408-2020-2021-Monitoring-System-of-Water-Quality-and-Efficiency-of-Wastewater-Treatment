from .models import *

reading_type_names = [
    "Table Type", "Year", "Month", "Bölge Adı", "Numune Adı", "Yer", "Amonyak", "Amonyum Azotu", "Askıda Katı Madde",
    "Toplam Çözünmüş Madde", "Çözünmüş Oksijen", "Debi (Gün)", "Debi (Saniye)", "Elektriksel İletkenlik", "Fekal Streptokok",
    "Fekal Koliform", "Toplam Koliform", "Toplam Fosfor", "Toplam Azot", "Toplam Kjeldahl Azotu", "Toplam Pestisit",
    "Toplam Fenol", "Işık Geçirgenliği", "Kimyasal Oksijen İhtiyacı", "Biyokimyasal Oksijen İhtiyacı", "pH", "Nitrat Azotu",
    "Nitrat", "Nitrit Azotu", "Sıcaklık", "Klorofil", "Tarih", "Tuzluluk", "Yağ", "Orto Fosfat", "Açıklama", "Renk", "Koku", "Renk / Koku"
]

def reading_list_to_dict_list(readings_list):
    loc = None
    date = None
    row_id = 0
    data = {}
    data_list = []
    for reading in readings_list:
        if (reading.unique_row_id != row_id): # if (reading.location != loc or reading.date != date) or (date == None and loc == None):
            if data: # dict not empty
                row_id += 1
                if len(data.keys()) == 1 and "Table Type" in data.keys():
                    pass
                else:
                    data["Tarih"] = date.isoformat() # yyyy-mm-dd
                    data["Bölge Adı"] = loc.bolge_adi
                    data["Yer"]   = loc.yer
                    data["Year"]  = date.year
                    data["Month"] = date.month
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
        data["Tarih"] = date.isoformat() # yyyy-mm-dd
        data["Bölge Adı"] = loc.bolge_adi
        data["Yer"]   = loc.yer
        data["Year"]  = date.year
        data["Month"] = date.month
        data_list.append(data)
    return data_list

def dict_list_to_csv(dict_list, csv_writer):
    csv_writer.writerow(reading_type_names)

    csv_things = []
    count = 0
    for item in dict_list:
        count += 1

        # TODO(ag) for debugging, delete this later
        # if count > 500:
        #     break

        for name in reading_type_names:
            if name in item.keys():
                csv_things.append(str(item[name]))
            else:
                csv_things.append("") # None / null

        csv_writer.writerow(csv_things)
        csv_things = []

def get_data(csv_writer):
    orm_response = Reading.objects.select_related('location', 'reading_type').all()
    reading_list = reading_list_to_dict_list(list(orm_response))

    dict_list_to_csv(reading_list, csv_writer)
