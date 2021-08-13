from strutils import parseUInt, split, strip, contains, join, replace
from sequtils import deduplicate
import types
import tables # for iterating over "column_names"
# import strformat # for "fmt"
import sets # for HashSet
import options # Option[T]
from sugar import collect
import fix_locations

from algorithm import sort

var unknown_columns:  seq[string] = @[]
var unknown_locs_new: seq[string] = @[]

# I <3 compile-time metaprogramming.
# We're generating a list of possible features at
# compile time by iterating over enum fields!
const features: seq[Feature] = collect(newSeq()):
  for f in Feature.items():
    f

const (dirty_to_clean_code, code_to_bolge_yer) = read_locations_from_file()

# The format of row num is "(" + uint +  ")", always.
# Which means we have to ignore the first and last characters.
proc extract_row_num(input: string): uint =
  result = parseUInt(input.strip(true, true, {'(', ')'}))

proc extract_datatype(input: string): EntryType =
  case input:
    of "System.String":   result = EntryType.str
    of "System.Double":   result = EntryType.double
    of "System.DateTime": result = EntryType.date
    of "System.Int16":    result = EntryType.double # ???
    of "System.Int32":    result = EntryType.double # ???
    else: raise newException(ValueError, "Weird data type:" & input)

proc extract_tableinfo(input: string): TableInfo =
  let tableData = input.split("_")

  result.ttype = case tableData[0]:
    of "Akarsu", "AKARSU", "akarsu":    TableType.Akarsu
    of "Arıtma", "ARITMA", "arıtma":    TableType.Aritma
    of "Göl", "Gol", "GÖL", "göl":      TableType.Gol
    of "Deniz", "DENİZ", "deniz":       TableType.Deniz
    of "Yeraltı", "YERALTI", "yeraltı": TableType.Yeralti
    else: raise newException(ValueError, "Weird table type:" & tableData[0])

  result.year  = parseUInt(tableData[1])
  result.month = parseUInt(tableData[2])

proc extract_feature(input: string, tableInfo: TableInfo): Option[Feature] =
  var featureString = input

  var problem = true
  for key in column_names.keys():
    if featureString in column_names[key]:
      featureString = $key
      problem = false
      break

  for enumFeature in Feature.items():
    if featureString == $enumFeature:
      return some(enumFeature)

  # var errorString: string = fmt"{input} in {tableInfo} is not known."
  # unknown_columns.add(errorString) # TODO var columns_to_ignore_for_now: seq[string] = @["KOKU", "No", "N","E", "AY", "AY_SUTUN", "RENK_KOKU"] # , "TOPLAM_COZUNMUS_MADDE_MGL", "MAPINFO_ID"

  return none(Feature)

proc process_line(line: string): Option[Entry] =
  let entryData = line.split("\t")

  if entryData.len < 6:
    echo "Short line: " & line

  var
    resultingEntry: Entry
    data_parsed:    string
    optionalData:   Option[float64]

    filePath    = entryData[0]
    tableName   = entryData[1]
    tableInfo   = extract_tableinfo(tableName)
    row         = extract_row_num(entryData[2])
    column      = extract_feature(entryData[3], tableInfo)
    dataType    = extract_datatype(entryData[4])
    data        = entryData[5]

  if column.isNone: return none(Entry)

  if shouldBeFloat64(column.get):
    optionalData = parseToFloat(data)
    if optionalData.isNone: return none(Entry)
    data_parsed = $(optionalData.get)
  elif shouldBeString(column.get):
    data_parsed = data.replace(',', '.')
  elif shouldBeUInt(column.get): data_parsed = $parseToUInt(data)
  else: raise newException(ValueError, "This shouldn't happen.")

  resultingEntry.fileName  = filePath
  resultingEntry.tableInfo = tableInfo
  resultingEntry.row       = row
  resultingEntry.column    = column.get
  resultingEntry.dataType  = dataType
  resultingEntry.data      = data_parsed

  return some(resultingEntry)

# numune_adi, bolge_adi, yer
proc get_cleaned(code: string): (string, string, string) =
  if dirty_to_clean_code.hasKey(code):
    let clean_code = dirty_to_clean_code[code]
    let (bolge, yer) = code_to_bolge_yer[clean_code]
    return (clean_code, bolge, yer)

  raise newException(ValueError, "thing")

proc newRow(entries: seq[Entry]): string =
  var entryTable = initTable[Feature, string]()
  for e in entries:
    entryTable[e.column] = e.data

  var key = ""
  try:
    key = entryTable[Feature.numune]
  except:
    var condition = ("SINIR DEĞER" in entries[0].data) or (". SINIF" in entries[0].data)
    if not condition:
      echo "Error ----- " & $entries
    return ""

  if not dirty_to_clean_code.hasKey(key):
    # TODO
    let unknown = entryTable[Feature.numune] & " -- " & entryTable[Feature.bolge] & " -- " & entryTable[Feature.yer]
    unknown_locs_new.add(unknown)
    return ""
  else:
    let dirty_code = entryTable[Feature.numune]
    let (clean_numune, clean_bolge, clean_yer) = get_cleaned(dirty_code)
    entryTable[numune] = clean_numune
    entryTable[bolge]  = clean_bolge
    entryTable[yer]    = clean_yer

  let firstEntryTableInfo = entries[0].tableInfo
  var strSeq: seq[string] = @[$firstEntryTableInfo.ttype, $firstEntryTableInfo.year, $firstEntryTableInfo.month]
  for f in features:
    if entryTable.hasKey(f):
      strSeq.add(entryTable[f])
    else:
      strSeq.add("")

  result = strSeq.join(",")

# -------------------------------
proc print_new_features() =
  let
    dataFile = open(dataFilepath2018)
    fileContents = dataFile.readAll()
    lines = fileContents.split('\n')
  close(dataFile)


  var newStuffSet = initHashSet[string]()

  for line in lines:
    let clean_line = line.strip()
    if clean_line == "": continue

    let entryData = line.split("\t")

    newStuffSet.incl(entryData[3])

  echo newStuffSet
# -------------------------------

proc main() =
  let dataFileLines = readDataFiles().split('\n')

  var csvString = ""

  var entries: seq[Entry] = @[]

  let columns = "Table Type,Year,Month," & features.join(",")
  # echo columns

  csvString = csvString & columns & '\n'

  var current_row: uint = 9999999

  for line in dataFileLines:
    let clean_line = line.strip()

    if clean_line == "": continue

    var entryOption = process_line(clean_line)

    if entryOption.isSome:
      let entry: Entry = entryOption.get

      if (entry.row != current_row):
        if entries.len != 0:
          let rowString = newRow(entries)
          if rowString.len > 0: csvString = csvString & rowString & '\n'

        entries = @[entry]
        current_row = entry.row
      elif entry.row == current_row:
        entries.add(entry)

  var csvFile = open("csv_data_clean_names.csv", fmWrite)
  csvFile.write(csvString)
  csvFile.close()

  unknown_locs_new.sort()
  echo unknown_locs_new.deduplicate()

const test_locs: bool = false

when isMainModule and not test_locs:
  main()
else:
  # echo dirty_to_clean_code
  print_new_features()
