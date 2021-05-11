# 2021 Abdulkerim Güven
# Part of the WQPMS Project.
# Reads Excel .xlsm and .xlsx files provided by the Ministry and converts them into a format which we can use.

import glob, pickle, os
from openpyxl import Workbook, load_workbook

from static_data import *

import pprint # for debugging
pp = pprint.PrettyPrinter(indent = 4) # for debug

excel_files_2020 = glob.glob("./data/2020/*.xlsm") # Get a list of 2020 .xlsm files.
excel_files_2018 = glob.glob("./data/2018/Excel Files/*.xlsx") # Get a list of 2018 .xlsx files.

# Pickle utils --------------
def load_from_pickle(name):
    filename = name + ".pickle"
    data = None
    with open(filename, 'rb') as pickle_file:
        data = pickle.load(pickle_file)
    return data

def dump_to_pickle(data, name):
    filename = name + ".pickle"
    with open(filename, 'wb') as pickle_file:
        pickle.dump(data, pickle_file)
# ---------------------------

class ExcelDataReader(object):
    def __init__(self, filepath):
        self.filepath = filepath
        self.filename = os.path.basename(filepath)
        self.workbook = load_workbook(filepath, keep_vba = True, read_only = True)
        self.data_tables = []
        self.current_worksheet    = None
        self.worksheet_dimensions = None # ( Top-left (row, col), bottom-right (row, col) )
        self.current_data_table   = {}

    def __del__(self):
        # This is only here because I'm curious whether Python objects get cleaned up deterministically. (in CPython)
        # As far as I can tell, objects that go out of scope are deleted immediately. Maybe RC is used?
        print("Destructor called for", self.filename)
        self.close()

    def close(self):
        self.workbook.close()

    def check_worksheet_names(self):
        possible_sheetnames = ['Akarsu', 'Göl', 'Deniz', 'Atıksu', 'Sayfa1', 'Sayfa2', 'Sayfa3', 'RAPOR'] # "RAPOR" is only in 2020 files.
        intersection = [value for value in self.workbook.sheetnames if value in possible_sheetnames]
        return intersection

    def open_worksheet(self, ws_name):
        self.current_worksheet = self.workbook[ws_name]
        
        # Dimension stuff...
        dimensions = self.current_worksheet.calculate_dimension()
        dims = dimensions.split(":")

        top_left     = dims[0]
        bottom_right = dims[1]

        top_left_row     = int(top_left[1:]) # row count
        bottom_right_row = int(bottom_right[1:]) # row count
        
        top_left_col     = ord(top_left[0])     - ord('A') + 1
        bottom_right_col = ord(bottom_right[0]) - ord('A') + 1

        self.current_data_table = {}
        self.worksheet_dimensions = ((top_left_col, top_left_row), (bottom_right_col, bottom_right_row))

    def get_row_names(self):
        assert (self.current_worksheet is not None), ("Use open_worksheet! Worksheet is None in " + self.filename)

        row_names = []
        top_left_column = self.worksheet_dimensions[0][0]
        row_count = self.worksheet_dimensions[1][1]

        for row_idx in range(1, row_count + 1):
            val = self.current_worksheet.cell(row = row_idx, column = top_left_column).value
            

            if val is not None:
                row_names.append(val)

        return row_names

    # TODO make this compatible with type 2018 files.
    def read_row_into_table(self, row_idx, data_table):
        top_left_column = self.worksheet_dimensions[0][0]
        column_name = self.current_worksheet.cell(row = row_idx, column = top_left_column).value
    
        if column_name == 'NUMUNE KODU:': # table start
            data_temp = self.current_worksheet.cell(row = row_idx, column = top_left_column + 1).value
            data_table["NUMUNE KODU"] = data_temp
            return 1 # Started
    
        if column_name not in possible_row_names_2020:
            data_temp = self.current_worksheet.cell(row = row_idx, column = top_left_column).value
            if data_temp is not None:
                data_table["Açıklama"] = data_temp
            return -1 # Ended
    
        if column_name == 'BÖLGE ADI:':
            data_temp = self.current_worksheet.cell(row = row_idx, column = top_left_column + 1).value
            data_table["BÖLGE ADI"] = data_temp
    
        if column_name == 'YER:':
            data_temp = self.current_worksheet.cell(row = row_idx, column = top_left_column + 1).value
            data_table["YER"] = data_temp
    
        if column_name == 'GPS KOORDİNATLARI:':
            data_temp = ((self.current_worksheet.cell(row = row_idx, column = top_left_column + 1).value), (self.current_worksheet.cell(row = row_idx, column = top_left_column + 2).value))
            data_table["GPS KOORDİNATLARI"] = data_temp
    
        if column_name == 'TABLO:':
            data_temp = self.current_worksheet.cell(row = row_idx, column = top_left_column + 1).value
            assert(data_temp == None)
            # data_table["TABLO"] = data_temp
    
        if column_name in rows_with_data_2020:
            data = {}
            data[column_name] = []
            for i in range(1, 6):
                data[column_name].append(self.current_worksheet.cell(row = row_idx, column = top_left_column + i).value)
            data_table[column_name] = data[column_name]
    
        return 0 # Neither ended nor started

    def read_tables(self, log_completion = True):
        last = -1
        table_count = 0
        row_count = self.worksheet_dimensions[1][1]
        
        data_table = {}
        for row_idx in range(1, row_count + 1):
            state = self.read_row_into_table(row_idx, data_table)

            if state == 1: # New table started.
                table_count += 1
            elif state == -1 and last != -1: # Table ended.
                if log_completion:
                    print("--- Table {:2} done. ---".format(table_count))
                self.data_tables.append(data_table)
                data_table = {}

            last = state

# file_path table_name (row_index) param_name System.String value
def read_and_pickle_2020_data():
    total_rowcount = 0

    data_tables = []
    for filepath in excel_files_2020:
        if "Tüm Bölgeler.xlsm" in filepath: break # IMPORTANT: This file includes all the other files' data.

        edr = ExcelDataReader(filepath)
        edr.open_worksheet("RAPOR") # 2020 data only uses this worksheet name.
        print("Current filename:", edr.filename)
        edr.read_tables()
        data_tables += edr.data_tables
        edr.close()

    print("Total number of tables:", len(data_tables))

    dump_to_pickle(data_tables, "tables2020")
    print("Pickled the data. Everything done.")

def analyze_2018_data_format():
    all_row_names = []
    for filepath in excel_files_2018:
        edr = ExcelDataReader(filepath)
        intersections = edr.check_worksheet_names()
        print("{:60}-> Usable sheets: {}".format(edr.filename, intersections)) # TODO Python's .format() justifying is broken when used with UTF-8 chars. Not that it is important here.

        for ws_name in intersections:
            print("Worksheet:", ws_name)
            edr.open_worksheet(ws_name)
            all_row_names += edr.get_row_names()

    print("All row names:")
    print(sorted(set(all_row_names)))

def main():
    # read_and_pickle_2020_data()
    analyze_2018_data_format()

if __name__ == '__main__':
    main()

