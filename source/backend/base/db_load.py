from .models import *
import csv
import datetime

float_keys = ['Amonyak', 'Amonyum Azotu', 'Askıda Katı Madde', 'Toplam Çözünmüş Madde', 'Çözünmüş Oksijen',
              'Debi (Gün)', 'Debi (Saniye)', 'Elektriksel İletkenlik', 'Fekal Streptokok', 'Fekal Koliform',
              'Toplam Koliform', 'Toplam Fosfor', 'Toplam Azot', 'Toplam Kjeldahl Azotu', 'Toplam Pestisit',
              'Toplam Fenol', 'Işık Geçirgenliği', 'Kimyasal Oksijen İhtiyacı', 'Biyokimyasal Oksijen İhtiyacı',
              'pH', 'Nitrat Azotu', 'Nitrat', 'Nitrit Azotu', 'Sıcaklık', 'Klorofil', 'Tuzluluk', 'Yağ', 'Orto Fosfat']
string_keys = ['Table Type', 'Açıklama', 'Renk', 'Koku', 'Renk / Koku']

# TODO(ag) dd_north ve dd_east eklenecek!

def db_load():
    filename = "csv_data_clean_names.csv"
    csvfile = open(filename, encoding="utf-8")
    reader = csv.DictReader(csvfile)
    all_data = list(reader) # print(all_data)
    csvfile.close()
    
    import pickle

    coord_fd = open("coordinates.pickle", "rb")
    all_coordinates = pickle.load(coord_fd)
    coord_fd.close()

    total = len(all_data)
    count = 0

    insert_to_db = []

    for row in all_data:
        count += 1
        print("Row", count, "of", total)

        _bolge  = row["Bölge Adı"].strip()
        _numune = row["Numune Adı"].strip()
        _yer    = row["Yer"].strip()
        _tablo_tipi = row["Table Type"].strip()
        _date  = datetime.date(int(row["Year"]), int(row["Month"]), 1)
        _north = None
        _east  = None

        coord_key = (_bolge, _yer)
        if coord_key in all_coordinates.keys():
            _north = all_coordinates[coord_key][0]
            _east  = all_coordinates[coord_key][1]

        (loc, created_loc) = Location.objects.get_or_create(bolge_adi = _bolge, numune_adi = _numune, yer = _yer, dd_north = _north, dd_east = _east)
        if created_loc:
            print("New location inserted:", _bolge, _yer, "Coordinates:", _north, _east)

        for key, val in row.items():
            # if key not in reading_types:
            (reading_type, created_reading_type) = ReadingType.objects.get_or_create(name = key, min_value = None, max_value = None)

            val_float = None
            val_string = None

            if len(val) == 0:
                continue

            if key in float_keys:
                val_float = float(val)
            elif key in string_keys:
                val_string = val
            else:
                continue # raise ValueError("Bunun olmaması lazım :D:D:D:D:D:D:D!!111", key)
            reading_for_db = Reading(
                                    reading_type = reading_type,
                                    table_type = _tablo_tipi,
                                    location = loc,
                                    added_by = None,
                                    reading_value = val_float,
                                    reading_string_value = val_string,
                                    date = _date,
                                    unique_row_id = count,
                             )

            insert_to_db.append(reading_for_db)

    print("Inserting", len(insert_to_db), "items.")
    Reading.objects.bulk_create(insert_to_db)
    print("Done!")
