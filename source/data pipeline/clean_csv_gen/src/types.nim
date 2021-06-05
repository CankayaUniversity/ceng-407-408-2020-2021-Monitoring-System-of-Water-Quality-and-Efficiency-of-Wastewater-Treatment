import tables
import options # Option[T]
from strutils import parseUInt, parseFloat, replace, strip, contains # for parsing floats.
from math import pow

const dataFilepath2005* = "A:/mdb_databases/tsv.txt"
const dataFilepath2018* = "A:/Bitirme/ceng-407-408-2020-2021-Monitoring-System-of-Water-Quality-and-Efficiency-of-Wastewater-Treatment/source/data pipeline/excel_read/2018_2020.tsv"

proc readDataFiles*(): string =
  var
    dataFileOld  = open(dataFilepath2005)
    dataFileNew  = open(dataFilepath2018)
    fileContents = dataFileOld.readAll() & dataFileNew.readAll()

  close(dataFileOld)
  close(dataFileNew)

  return fileContents


type Feature* = enum
  bolge            = "Bölge Adı",
  numune           = "Numune Adı",
  yer              = "Yer",
  amonyak          = "Amonyak",
  amonyum_azot     = "Amonyum Azotu",
  kati_madde       = "Askıda Katı Madde", # "TOPLAM_COZUNMUS_MADDE_MGL" aynı şey mi?
  toplam_cozunmus  = "Toplam Çözünmüş Madde",
  cozunmus_o       = "Çözünmüş Oksijen",
  debi_gun         = "Debi (Gün)",
  debi_sn          = "Debi (Saniye)",
  iletkenlik       = "Elektriksel İletkenlik",
  fekal_streptekok = "Fekal Streptokok",
  fekal_koliform   = "Fekal Koliform",
  toplam_koliform  = "Toplam Koliform",
  fosfor           = "Toplam Fosfor",
  azot             = "Toplam Azot",
  kjeldahl_azot    = "Toplam Kjeldahl Azotu",
  pestisit         = "Toplam Pestisit",
  fenol            = "Toplam Fenol",
  isik_gec         = "Işık Geçirgenliği",
  koi              = "Kimyasal Oksijen İhtiyacı",
  boi              = "Biyokimyasal Oksijen İhtiyacı",
  ph               = "pH",
  nitrat_azot      = "Nitrat Azotu",
  nitrat           = "Nitrat",
  nitrit           = "Nitrit Azotu",
  sicaklik         = "Sıcaklık",
  klorofil         = "Klorofil",
  tarih            = "Tarih",
  tuzluluk         = "Tuzluluk",
  # nkoord           = "Koordinat - N", # UTM'e çeviri (?)
  # ekoord           = "Koordinat - E", # UTM'e çeviri (?)
  # utmx             = "Universal Transverse Mercator - X", # (E) Koordinat sistemine ya da sisteminden çeviri yapılmalı.
  # utmy             = "Universal Transverse Mercator - Y", # (N) Koordinat sistemine ya da sisteminden çeviri yapılmalı.
  yag              = "Yağ",
  fosfat           = "Orto Fosfat",
  aciklama         = "Açıklama",
  renk             = "Renk",
  koku             = "Koku",
  renk_koku        = "Renk / Koku",
  # mapinfo_id       = "MapInfo ID"

type
  EntryType* = enum
    str, double, date

  TableType* = enum
    Akarsu  = "Akarsu",
    Gol     = "Göl",
    Deniz   = "Deniz",
    Aritma  = "Arıtma",
    Yeralti = "Yeraltı"

  TableInfo* = object
    ttype*: TableType
    year*:  uint
    month*: uint

  Entry* = object
    fileName*:   string
    tableInfo*:  TableInfo
    row*:        uint
    column*:     Feature
    dataType*:   EntryType
    data*:       string

const column_names* = {
    # Feature.mapinfo_id: @["MAPINFO_ID"], # Çöp
    # Feature.nkoord: @["N"], # Bunlar bir kere girilip silinecek
    # Feature.ekoord: @["E"], # Bunlar bir kere girilip silinecek
    # Feature.utmx: @["X_UTM", "X_UTM"],
    # Feature.utmy: @["Y","Y_UTM","Y_UTM"],
    # feature.gps ??? -> @["GPS Koordinatları"]
    Feature.koku: @["KOKU", "Koku (TON)"],
    Feature.renk_koku: @["RENK_KOKU"], # TODO What is this?
    Feature.toplam_cozunmus: @["TOPLAM_COZUNMUS_MADDE_MGL"], # TODO What is this?
    Feature.amonyak: @["AMONYAK (MG/ L)", "AMONYAK (MG/ L)", "AMONYAK_MGL", "AMONYAK_MGL", "Amonyak (mg/ L)"],
    Feature.amonyum_azot: @["AMONYUM_AZOTU_MGL", "AMONYUM_AZOTU_MGL", "Amonyum Azotu (mg/ L)", "Amonyum Azotu (mg/L)"],
    Feature.kati_madde: @["ASKIDA_KATI_MADDE_MGL", "ASKIDA_KATI_MADDE_MGL", "Askıda Katı Madde (mg/ L)", "Askıda Katı Madde (mg/L)"],
    Feature.cozunmus_o: @[
        "ÇÖZÜNMÜŞ O_MGLKSİJEN_",
        "COZUNMUS_O_MGL",
        "COZUNMUS_O_MGL",
        "COZUNMUS_O_MGL",
        "ÇÖZÜNMÜŞ_OKSİJEN_MGL",
        "ÇÖZÜNMÜŞ_OKSİJEN_MGL",
        "Çözünmüş Oksijen (mg/ L)",
        "Çözünmüş Oksijen (mg/L)",
        # Percent below, mg/l above.
        "COZUNMUS_O_YUZDe",
        "COZUNMUS_O_YUZDE",
        "COZUNMUS_O_YUZDe",
        "COZUNMUS_O_YUZDE",
        "ÇÖZÜNMÜŞ_O_YÜZDE",
        "ÇÖZÜNMÜŞ_OKSİJEN_YUZDE",
        "ÇÖZÜNMÜŞ_OKSİJEN_YÜZDE",
        "ÇÖZÜNMÜŞ_OKSİJEN_YUZDE",
        "ÇÖZÜNMÜŞ_OKSİJEN_YÜZDE",
        "ÇÖZÜNMÜS OKSİJEN (%)",
        "O2 (%)",
    ],
    Feature.boi: @["BOI_MGL", "BOİ_MGL", "BOI_MGL", "BOİ_MGL", "Biyokimyasal Oksijen İhtiyacı (mg/ L)", "Biyokimyasal Oksijen İhtiyacı (mg/L)"],
    Feature.debi_gun: @["DEBI_M3_GUN", "DEBI_M3_GUN", "Debi (m3/gün)"],
    Feature.debi_sn: @["DEBI_M3_SN", "DEBI_M3_SN", "DEBİ_M3_SN", "Debi (m3/ sn)", "Debi (m3/sn)"],
    Feature.bolge: @["BOLGE_ADI", "Bölge Adı"],
    Feature.iletkenlik: @[
        "ELEKTRIKSEL_ILETKENLIK_MIKROS",
        "ELEKTRIKSEL_İLETKENLİK_MIKROS",
        "ELEKTRIKSEL_ILETKENLIK_MIKROS",
        "ELEKTRIKSEL_İLETKENLİK_MIKROS",
        "ELEKTRİKSEL_İLETKENLİK_MİKROS",
        "Elektriksel İletkenlik (µS/ cm)",
        "Elektriksel İletkenlik (μs/cm)",
        "İletkenlik (μs/cm)"
    ],
    Feature.fekal_streptekok: @[
        "FEKAL STREPTOKOK (CFU/ 100ML)",
        "FEKAL_STREPTEKOK_CFU_100ML",
        "FEKAL_STREPTEKOK_CFU_100ML",
        "FEKAL_STREPTOKOK_CFU_100ML",
        "FEKAL_STREPTOKOK_CFU_100ML",
        "FEKAL_STREPTOKOK_KOB_100ML",
        "Fekal Streptekok (CFU/ 100 mL)",
        "FekalStreptekok  (CFU/ 100mL)",
        "FekalStreptekok (CFU/ 100mL)",
    ],
    Feature.fekal_koliform: @[
        "FEKAL KOLİFORM (CFU/ 100ML)",
        "FEKAL_KOLIFORM_CFU_100ML",
        "FEKAL_KOLIFORM_CFU_100ML",
        "FEKAL_KOLIFORM_CFU_100ML",
        "FEKAL_KOLIFORM_CFU_100ML",
        "FEKAL_KOLİFORM_CFU_100ML",
        "FEKAL_KOLIFORM_KOB_100ML",
        "FEKAL_KOLIFORM_KOB_100ML",
        "FEKALKOLİFORM_CFU_100ML",
        "FEKALKOLIFORM_CFU_100ML",
        "FKOLIFORM_CFU_100ML",
        "FKOLİFORM_CFU_100ML",
        "FKOLIFORM_CFU_100ML",
        "FKOLİFORM_CFU_100ML",
        "FKOLIFORM_CFU_100M",
        "FKOLİFORM_CFU_100ML",
        "FKOLIFORM_CFU-100 ml",
        "Fekal  Koliform  (CFU/ 100 mL)",
        "Fekal Koliform  (CFU/ 100mL)",
        "Fekal Koliform (CFU/ 100 mL)",
        "Fekal Koliform (CFU/ 100mL)",
        "Fekal Koliform (CFU/100mL)"
    ],
    Feature.isik_gec: @[
        "IŞIK GEÇİRGENLİĞİ (M)",
        "IŞIK GEÇİRGENLİĞİ (M)",
        "IŞIK_GEÇİRGENİĞİ_M",
        "IŞIK_GEÇİRGENİĞİ_M",
        "ISIK_GECIRGENLIGI_M",
        "IŞIK_GEÇİRGENLİĞİ_M",
        "ISIK_GECIRGENLIGI_M",
        "IŞIK_GEÇİRGENLİĞİ_M",
        "Işık Geçirgenliği (M)",
        "Işık Geçirgenliği (m)"
    ],
    Feature.koi: @[
        "KIMYASAL_OKSIJEN_IHTIYACI",
        "KIMYASAL_OKSIJEN_IHTIYACI",
        "KOI_MGL",
        "KOI_MGL",
        "KOİ_MGL",
        "Kimyasal Oksijen İhtiyacı (mg/L)",
        "Kimyasal Oksijen İhtiyacı (mg/ L)",
    ],
    Feature.ph: @["pH", "PH", "pH", "PH", "pH"],
    Feature.nitrat_azot: @[
        "NITRAT_AZOTU_MGL",
        "NITRAT_AZOTU_MGL",
        "NİTRAT_AZOTU_MGL",
        "Nitrat Azotu (mg/L)",
        "Nitrat Azotu (mg/ L)",
    ],
    Feature.nitrat: @["NITRAT_MGL", "NITRAT_MGL"],
    Feature.nitrit: @["NITRIT_AZOTU_MGL", "NITRIT_AZOTU_MGL", "NİTRİT_AZOTU_MGL", "Nitrit Azotu (mg/ L)", "Nitrit Azotu (mg/L)"],
    Feature.sicaklik: @[
        "SICAKLIK_0C",
        "SICAKLIK_0C",
        "SICAKLIK_C",
        "SICAKLIK_C",
        "SICAKLIK_C",
        "Sıcaklık (0C)",
        "Sıcaklık (oC)",
        "Sıcaklık(0C)",
    ],
    Feature.klorofil: @["KLOROFİL_A", "KLOROFİL_A", "KLOROFIL_A_MIKRO", "KLOROFIL_A_MIKRO", "Klorofil-A (µg/ L)", "Klorofil-a (μg/L)"],
    Feature.tarih: @["TARIH", "TARIH", "TARİH", "Numune Alma Tarihi"],
    Feature.azot: @["TOPLAM_AZOT", "TOPLAM_AZOT", "TOPLAM_AZOT_MGL", "TOPLAM_AZOT_MGL", "Toplam Azot (mg/ L)", "Toplam Azot (mg/L)", "Toplam Azot (μg/L)"],
    Feature.kjeldahl_azot: @["TOPLAM_KJELDAHL_AZOTU_MGL", "TOPLAM_KJELDAHL_AZOTU_MGL", "Toplam Kjeldahl Azotu (mg/ L)", "Toplam Kjeldahl Azotu (mg/L)"],
    Feature.numune: @["NUMUNE_ADI", "Numune Kodu"],
    Feature.tuzluluk: @[
        "TUZLULUK_BINDE",
        "TUZLULUK_BINDE",
        "TUZLULUK_BİNDE",
        "Tuzluluk (‰)"
    ],
    Feature.toplam_koliform: @[
        "TKOLIFORM_CFU_100ML",
        "TKOLIFORM_CFU_100ML",
        "TKOLIFORM_CFU_100ML",
        "TKOLIFORM_CFU_100ML",
        "TKOLİFORM_CFU_100ML",
        "TKOLIFORM_KOB_100ML",
        "TKOLIFORM_KOB_100ML",
        "TOPLAM_KOLIFORM_CFU_100ML",
        "TOPLAM_KOLİFORM_CFU_100ML",
        "TOPLAM_KOLIFORM_CFU_100ML",
        "TOPLAM_KOLİFORM_CFU_100ML",
        "TOPLAM KOLİFORM (CFU/ 100ML)",
        "Toplam Koliform  (CFU/ 100 mL)",
        "Toplam Koliform  (CFU/ 100mL)",
        "Toplam Koliform (CFU/ 100mL)",
        "Toplam Koliform (CFU/100mL)",
    ],
    Feature.fosfor: @["TOPLAM_FOSFOR", "TOPLAM_FOSFOR", "TOPLAM_FOSFOR_MGL", "TOPLAM_FOSFOR_MGL", "Toplam Fosfor (mg/ L)", "Toplam Fosfor (mg/L)", "Toplam Fosfor (μg/L)"],
    Feature.pestisit: @[
        "Toplam Pestisit",
        "TOPLAM_PESTISIT",
        "TOPLAM_PESTİSİT",
        "TOPLAM_PESTISIT",
        "TOPLAM_PESTİSİT",
        "TOPLAM_PESTİSİT_MİKROGL",
        "Toplam Pestisid (mg/ L)",
        "Toplam Pestisit (mg/L)",
    ],
    Feature.yag: @["YAĞ_GRES", "YAĞ_GRES", "YAĞ-GRES", "Yağ-Gres (mg/ L)", "Yağ-Gres (mg/L)"],
    Feature.yer: @["YER", "Yer"],
    Feature.fosfat: @["ORTO_FOSFAT", "ORTO_FOSFAT", "ORTO_FOSFAT_MGL"],
    Feature.fenol: @["TOPLAM _FENOL", "TOPLAM _FENOL", "TOPLAM FENOL (MG/L)", "TOPLAM_FENOL_MGL", "Toplam Fenol (mg/ L)", "Toplam Fenol (mg/L)"],
    Feature.aciklama: @["ACIKLAMA", "Açıklama"],
    Feature.renk: @["RENK", "RENK (Pt-Co)", "Renk (Pt-Co)"],
}.toTable.static # static is supposed to make sure that the variable is evaluated at compile-time


proc shouldBeFloat64*(input: Feature): bool =
  result = case input:
    of Feature.amonyak, Feature.amonyum_azot, Feature.kati_madde, Feature.toplam_cozunmus,
      Feature.cozunmus_o, Feature.debi_gun, Feature.debi_sn, Feature.iletkenlik, Feature.fekal_streptekok,
      Feature.fekal_koliform, Feature.toplam_koliform, Feature.fosfor, Feature.azot, Feature.kjeldahl_azot,
      Feature.pestisit, Feature.fenol, Feature.isik_gec, Feature.koi, Feature.boi, Feature.ph,
      Feature.nitrat_azot, Feature.nitrat, Feature.nitrit, Feature.sicaklik, Feature.klorofil,
      Feature.tuzluluk,  Feature.yag,
      Feature.fosfat: true
    else: false

proc shouldBeString*(input: Feature): bool =
  result = case input:
    of Feature.bolge, Feature.numune, Feature.yer: true
    of Feature.aciklama, Feature.renk, Feature.koku, Feature.renk_koku, Feature.tarih: true
    # of Feature.nkoord, Feature.ekoord: true
    else: false

proc shouldBeUInt*(input: Feature): bool =
  result = case input:
    # of Feature.mapinfo_id, Feature.utmx, Feature.utmy: true
    else: false

proc parseToUInt*(input: string): uint =
  result = parseUInt(input)

proc parseToFloat*(input: string): Option[float64] =
  var corrected: string = input
  var lesser:  bool = false
  var greater: bool = false
  let multiplier: float64 = pow(10.float64, -5)
  var wasWeird = false
  var parsed: float64

  corrected = corrected.replace(" ", "") # This is not a regular whitespace character. It is 0xA8 which is not in ASCII.
  corrected = corrected.strip(true, true, {' ', '$'}) # The dollar sign, I can't even
  corrected = corrected.strip(false, true, {',', '.'}) # No trailing dots!

  if ('.' in input) and (',' in input):
    corrected = corrected.replace(".", "")

  if '.' notin corrected and ',' in corrected:
    corrected = corrected.replace(',', '.')

  if ".." in corrected:
    corrected = corrected.replace("..", ".")

  if ';' in input:
    corrected = corrected.replace(';', '.')

  if input.contains("Ölçülememiştir") or corrected == "":
    return none(float64)

  if '<' in input:
    corrected = corrected.strip(true, false, {'<'})
    lesser = true

  if '>' in input:
    corrected = corrected.strip(true, false, {'>'})
    greater = true

  corrected = corrected.strip() # "< 10"... facepalm

  try:
    parsed = parseFloat(corrected)
  except:
    return none(float64)

  let offset = (parsed * multiplier)
  if lesser:
    parsed = parsed - offset
  elif greater:
    parsed = parsed + offset

  return some(parsed)
