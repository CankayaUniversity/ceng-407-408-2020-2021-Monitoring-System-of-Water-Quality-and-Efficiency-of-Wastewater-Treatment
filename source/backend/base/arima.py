import pandas as pd
from pmdarima import auto_arima

def arima_predict(df, start_date, end_date, col_name):
    model = auto_arima(df, trace=True, error_action='ignore', suppress_warnings=True)
    model.fit(df)
    
    forecast_new = model.predict(start = pd.to_datetime(start_date), dynamic = False)
    forecast_new = pd.DataFrame(forecast_new, index = pd.date_range(start = start_date, end = end_date, freq='M'), columns = [col_name])

    return forecast_new

def run_arima(fd, bolge, yer, tip, start_date, end_date):
    assert (tip in ['Akarsu', 'Göl', 'Arıtma', 'Deniz']), ("tip param is wrong: " + tip)
    
    df = pd.read_csv(fd, low_memory = False)

    df.columns = [c.replace(' ', '_') for c in df.columns]
    df = df.set_index('Tarih')
    df.index = pd.to_datetime(df.index, yearfirst = True)

    df = df.loc[df['Table_Type'] == tip]
    df = df.loc[df['Yer'] == yer]
    df = df.loc[df['Bölge_Adı'] == bolge]

    cols_to_use = []

    if (tip == 'Akarsu'):
        cols_to_use = ['Fekal_Koliform', 'Toplam_Koliform', 'Toplam_Fosfor', 'Toplam_Kjeldahl_Azotu', 'Kimyasal_Oksijen_İhtiyacı', 'Nitrat_Azotu', 'Çözünmüş_Oksijen']

    elif (tip == 'Göl'):
        cols_to_use = ['Toplam_Fosfor', 'Toplam_Azot', 'Klorofil']

    elif (tip == 'Arıtma'):
        cols_to_use = ['Biyokimyasal_Oksijen_İhtiyacı', 'Kimyasal_Oksijen_İhtiyacı', 'Toplam_Fosfor', 'Toplam_Azot']

    elif (tip == 'Deniz'):
        cols_to_use = ['Toplam_Koliform', 'Fekal_Koliform', 'Amonyak', 'Fekal_Streptokok']

    df = df[cols_to_use].dropna()

    forecast_arr = []
    for col in cols_to_use:
        res = arima_predict(df[col], start_date, end_date, col)
        forecast_arr.append(res)

    forecast_data = {}
    for column_idx in range(len(cols_to_use)):
        arima_predictions = forecast_arr[column_idx].reset_index().values.tolist() # [forecast_arr[column_idx].columns.tolist()] --> This returns the column name inside a list.

        predictions = []
        for ap in arima_predictions:
            assert (len(ap) == 2), ("Corrupt ARIMA prediction")
            timestring = ap[0].isoformat()
            prediction_value = ap[1]
            predictions.append((timestring, prediction_value))

        forecast_data[cols_to_use[column_idx]] = predictions

    return forecast_data

"""
import io, pprint

pp = pprint.PrettyPrinter(indent = 4)

fd = read_from_file_and_return_as_stringio('../database_export.csv')
pp.pprint(run_arima(fd, bolge, yer, tip))
fd.close()

def read_from_file_and_return_as_stringio(filename):
    content = ""
    with open(filename) as f:
        content = f.readlines()

    fake_file = io.StringIO()
    for line in content:
        line.strip()
        fake_file.write(line)

    fake_file.seek(0) # Go back to the start of the "file"
    return fake_file


Tested with:

127.0.0.1:8000/api/arima/Akarsu/Fethiye-Göcek/DSİ Kanalının Denize Dökülmeden Önceki Noktası/2021-01/2021-11/
127.0.0.1:8000/api/arima/Arıtma/Foça/Foça Atıksu Arıtma Tesisi Çıkış/2021-01/2021-11/
127.0.0.1:8000/api/arima/Göl/Göksu Deltası/Paradeniz Hurma/2021-01/2021-11/
127.0.0.1:8000/api/arima/Deniz/Belek/Çolaklı-Kumköy Derin Deniz Deşarj Noktası/2021-01/2021-11/
"""

