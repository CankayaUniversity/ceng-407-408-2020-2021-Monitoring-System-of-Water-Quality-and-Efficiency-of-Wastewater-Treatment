# Sadly, the locations in the data provided are not consistent.
# The plan is to supply a cleaned list of locations and unconsistent data with consistent
# ones. The cleaned data is in the "temiz_nby.txt".
# This file contains the procedures to construct a hashmap that maps from inconsistent location
# strings to cleaned location strings.
# - ag, 2021-03-06
from strutils import starts_with, split, strip
import tables
# import sets
# import strformat

proc read_locations_from_file*(): (Table[string, string], Table[string, (string, string)]) =
  var dataFile = open("temiz_nby.txt")
  defer: close(dataFile)

  var dirty_to_clean_code = initTable[string, string]()
  var code_to_bolge_yer = initTable[string, (string, string)]()
 
  var count = 0
  for line in dataFile.lines():
    count += 1
    if line.strip().starts_with(';'):
      break
    elif line.strip.len == 0:
      continue

    let
      before_and_after = line.split("->")
      before = before_and_after[0].strip()
      after  = before_and_after[1].strip()

      before_splits = before.split("--")
      b_code  = before_splits[0].strip()
      b_bolge = before_splits[1].strip()
      b_yer   = before_splits[2].strip()

      after_splits = after.split("--")
      a_code  = after_splits[0].strip()
      a_bolge = after_splits[1].strip()
      a_yer   = after_splits[2].strip()
    
    if not dirty_to_clean_code.hasKey(b_code):
      dirty_to_clean_code[b_code] = a_code
    
    if not code_to_bolge_yer.hasKey(a_code):
      code_to_bolge_yer[a_code] = (a_bolge, a_yer)


  return (dirty_to_clean_code, code_to_bolge_yer)
