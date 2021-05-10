# 2021 Abdulkerim Güven
# Part of the WQPMS Project.
# Reads Excel .xlsm files provided by the Ministry and converts them into a format which we can use.

import glob
from openpyxl import Workbook, load_workbook

import pprint # for debugging
import pickle

pp = pprint.PrettyPrinter(indent=4)

excel_files = glob.glob("*.xlsm") # Get all .xlsm files in cwd.

reading_types = [
    'NUMUNE KODU:',
    'BÖLGE ADI:',
    'YER:',
    'GPS KOORDİNATLARI:',
    'TABLO:',
    'NUMUNE ALMA TARİHİ',
    'PARAMETRE', # This is kind of useless since we have 'NUMUNE ALMA TARİHİ' anyway.
    'Amonyak (mg/ L)',
    'Amonyum Azotu (mg/ L)',
    'Askıda Katı Madde (mg/ L)',
    'Biyokimyasal Oksijen İhtiyacı (mg/ L)',
    'Debi (m3/ sn)',
    'Elektriksel İletkenlik (µS/ cm)',
    'Fekal  Koliform  (CFU/ 100 mL)',
    'Fekal Koliform (CFU/ 100 mL)',
    'Fekal Streptekok (CFU/ 100 mL)',
    'Işık Geçirgenliği (M)',
    'Kimyasal Oksijen İhtiyacı (mg/ L)',
    'Klorofil-A (µg/ L)',
    'Koku (TON)',
    'Nitrat Azotu (mg/ L)',
    'Nitrit Azotu (mg/ L)',
    'O2 (%)',
    'Orta Fosfat (mg/ L)',
    'Renk (Pt-Co)',
    'Sıcaklık (0C)',
    'Toplam Azot (mg/ L)',
    'Toplam Fenol (mg/ L)',
    'Toplam Fosfor (mg/ L)',
    'Toplam Kjeldahl Azotu (mg/ L)',
    'Toplam Koliform  (CFU/ 100 mL)',
    'Toplam Pestisid (mg/ L)',
    'Tuzluluk (‰)',
    'Yağ-Gres (mg/ L)',
    'pH',
    'Çözünmüş Oksijen (mg/ L)',
    'İletkenlik (µS/ cm)'
]

data_col_count = [
    'NUMUNE ALMA TARİHİ',
    'PARAMETRE',
    'Amonyak (mg/ L)',
    'Amonyum Azotu (mg/ L)',
    'Askıda Katı Madde (mg/ L)',
    'Biyokimyasal Oksijen İhtiyacı (mg/ L)',
    'Debi (m3/ sn)',
    'Elektriksel İletkenlik (µS/ cm)',
    'Fekal  Koliform  (CFU/ 100 mL)',
    'Fekal Koliform (CFU/ 100 mL)',
    'Fekal Streptekok (CFU/ 100 mL)',
    'Işık Geçirgenliği (M)',
    'Kimyasal Oksijen İhtiyacı (mg/ L)',
    'Klorofil-A (µg/ L)',
    'Koku (TON)',
    'Nitrat Azotu (mg/ L)',
    'Nitrit Azotu (mg/ L)',
    'O2 (%)',
    'Orta Fosfat (mg/ L)',
    'Renk (Pt-Co)',
    'Sıcaklık (0C)',
    'Toplam Azot (mg/ L)',
    'Toplam Fenol (mg/ L)',
    'Toplam Fosfor (mg/ L)',
    'Toplam Kjeldahl Azotu (mg/ L)',
    'Toplam Koliform  (CFU/ 100 mL)',
    'Toplam Pestisid (mg/ L)',
    'Tuzluluk (‰)',
    'Yağ-Gres (mg/ L)',
    'pH',
    'Çözünmüş Oksijen (mg/ L)',
    'İletkenlik (µS/ cm):'
]

def get_row_names(ws, rowcount):
    row_names = []
    for row in range(1, rowcount + 1):
        val = ws.cell(row = row_idx, column = 2) # val1 = ws["A1"].value
        value = val.value
        if value is not None:
            if value not in reading_types:
                print(value)
            else:
                row_names.append(value)
    return row_names


# Columns in data that correspond to specific months in 2020:
# C (August), D (September), E (October), F (November), G (December)
def get_row_data(ws, row_idx: int, data_table: dict):
    cell_pos = "B" + str(row_idx)
    column_name = ws[cell_pos].value

    if column_name == 'NUMUNE KODU:': # table start
        data_temp = ws.cell(row = row_idx, column = 2 + 1).value
        data_table["NUMUNE KODU"] = data_temp
        return 1 # Started

    if column_name not in reading_types:
        data_temp = ws.cell(row = row_idx, column = 2).value
        if data_temp is not None:
            data_table["Açıklama"] = data_temp
        return -1 # Ended

    if column_name == 'BÖLGE ADI:':
        data_temp = ws.cell(row = row_idx, column = 2 + 1).value
        data_table["BÖLGE ADI"] = data_temp

    if column_name == 'YER:':
        data_temp = ws.cell(row = row_idx, column = 2 + 1).value
        data_table["YER"] = data_temp

    if column_name == 'GPS KOORDİNATLARI:':
        data_temp = ((ws.cell(row = row_idx, column = 2 + 1).value), (ws.cell(row = row_idx, column = 2 + 2).value))
        data_table["GPS KOORDİNATLARI"] = data_temp

    if column_name == 'TABLO:':
        data_temp = ws.cell(row = row_idx, column = 2 + 1).value
        assert(data_temp == None)
        # data_table["TABLO"] = data_temp

    if column_name in data_col_count:
        data = {}
        data[column_name] = []
        for i in range(1, 6):
            data[column_name].append(ws.cell(row = row_idx, column = 2 + i).value)
        data_table[column_name] = data[column_name]

    return 0 # Neither ended nor started

    # B col is col 2.

def get_datasheet(wb):
    assert(len(wb.sheetnames) == 1) # Must be ["RAPOR"]
    ws = wb[wb.sheetnames[0]]
    
    # Dimension stuff...
    dimensions = ws.calculate_dimension()
    dims = dimensions.split(":")
    top_left = dims[0]
    assert(top_left == "B1" or top_left == "B2") # A is always empty, data starts at B2 or B1.
    
    bottom_right = dims[1]
    assert(bottom_right[0] == "K") # The data we have always ends at the K column, so...
    rowcount = int(bottom_right[1:])

    return (ws, rowcount)

# file_path table_name (row_index) param_name System.String value
def main():
    all_rows = []
    total_rowcount = 0

    all_data_dicts = []
    for filename in excel_files:
        if filename == "Tüm Bölgeler.xlsm": break # IMPORTANT: This file includes all the other files' data.

        wb = load_workbook(filename, keep_vba = True, read_only = True)
        sheet, rowcount = get_datasheet(wb)
        total_rowcount += rowcount
        print(filename, "->", rowcount)
        
        data_table = {}

        last = -1
        table_count = 0
        for row_idx in range(1, rowcount + 1):
            state = get_row_data(sheet, row_idx, data_table)
            if state == 1:
                table_count += 1
                # print("--- Table {} started. ---".format(table_count))
            elif state == -1 and last != -1:
                print("--- Table {} done. ---".format(table_count))
                # pp.pprint(data_table)
                all_data_dicts.append(data_table)
                data_table = {}
            last = state

        wb.close()

    print("Total number of tables:", len(all_data_dicts))

    with open("all_tables.pickle", 'wb') as pickle_file:
        pickle.dump(all_data_dicts, pickle_file)

    print("Pickled the data. Everything done.")

if __name__ == '__main__':
    main()

def get_from_pickle():
    all_data_dicts = None
    with open("all_tables.pickle", 'rb') as pickle_file:
        all_data_dicts = pickle.dump(pickle_file)
    return all_data_dicts
