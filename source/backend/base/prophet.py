import numpy as np
import pandas as pd
from fbprophet import Prophet
import io
from . import generate_csv

def run_prophet(bolge = 'Foça', yer = 'Foça Atıksu Arıtma Tesisi Çıkış', tip = 'Arıtma'): # TODO
    # Get latest data as CSV
    fd = io.StringIO
    writer = csv.writer(fd)
    generate_csv.get_data(writer)

    # Read df and split
    df = pd.read_csv(fd, low_memory = False)
    df.columns = [c.replace(' ', '_') for c in df.columns]
    df.index = pd.to_datetime(df.index, yearfirst = True)
    df = df.drop(labels = ['Numune_Adı'], axis = 1)

    fd.close()
    frlist = []

    if (tip == 'Akarsu'):
        akarsu_df = df.loc[df['Table_Type'] == 'Akarsu']

        rel_col_names_akarsu = ['Tarih', 'Bölge_Adı', 'Yer','Fekal_Koliform', 'Toplam_Koliform', 'Toplam_Fosfor', 'Toplam_Kjeldahl_Azotu', 'Kimyasal_Oksijen_İhtiyacı', 'Nitrat_Azotu', 'Çözünmüş_Oksijen']
        akarsu = akarsu_df[rel_col_names_akarsu]
        akarsu = akarsu.set_index('Tarih')

        temp = akarsu.copy()
        temp['chunkID'] = temp.groupby('Yer').ngroup()
        temp = temp.sort_values(by=['chunkID', 'Yer', 'Tarih',])
        temp = temp.dropna()
        c43 = temp.loc[temp['chunkID'] == 29]

        akarsu_cols = ['Fekal_Koliform', 'Toplam_Koliform', 'Toplam_Fosfor', 'Toplam_Kjeldahl_Azotu', 'Kimyasal_Oksijen_İhtiyacı', 'Nitrat_Azotu', 'Çözünmüş_Oksijen']
        for i in akarsu_cols:
            f = c43[[i]].reset_index()
            fa = f.rename(columns={'Tarih': 'ds', i: 'y'})
            fa = fa.dropna()
            m = Prophet()
            m.fit(fa)
            forecast = m.predict(fa)
            forecast_dict = forecast.to_dict()
            forecast_dict["Reading_Type"] = i
            frlist.append(forecast_dict)
            #fig1 = m.plot(forecast, xlabel = 'Date', ylabel = i)

    elif (tip == 'Göl'):
        gol_df = df.loc[df['Table_Type'] == 'Göl']

        rel_col_names_gol = ['Tarih', 'Bölge_Adı', 'Yer','Toplam_Fosfor', 'Toplam_Azot', 'Klorofil']
        gol = gol_df[rel_col_names_gol]
        gol = gol.set_index('Tarih')

        temp = gol.copy()
        temp['chunkID'] = temp.groupby('Yer').ngroup()
        temp = temp.sort_values(by=['chunkID', 'Yer', 'Tarih',])
        temp = temp.dropna()
        c43 = temp.loc[temp['chunkID'] == 29]

        gol_cols = ['Toplam_Fosfor', 'Toplam_Azot', 'Klorofil']
        for i in gol_cols:
            f = c43[[i]].reset_index()
            fa = f.rename(columns={'Tarih': 'ds', i: 'y'})
            fa = fa.dropna()
            m = Prophet()
            m.fit(fa)
            forecast = m.predict(fa)
            forecast_dict = forecast.to_dict()
            forecast_dict["Reading_Type"] = i
            frlist.append(forecast_dict)

    elif (tip == 'Arıtma'):
        aritma_df = df.loc[df['Table_Type'] == 'Arıtma']

        rel_col_names_aritma = ['Tarih', 'Bölge_Adı', 'Yer','Biyokimyasal_Oksijen_İhtiyacı', 'Kimyasal_Oksijen_İhtiyacı', 'Toplam_Fosfor', 'Toplam_Azot']
        aritma = aritma_df[rel_col_names_aritma]
        aritma = aritma.set_index('Tarih')

        temp = aritma.copy()
        temp['chunkID'] = temp.groupby('Yer').ngroup()
        temp = temp.sort_values(by=['chunkID', 'Yer', 'Tarih',])
        temp = temp.dropna()
        c43 = temp.loc[temp['chunkID'] == 29]

        aritma_cols = ['Biyokimyasal_Oksijen_İhtiyacı', 'Kimyasal_Oksijen_İhtiyacı', 'Toplam_Fosfor', 'Toplam_Azot']

        for i in aritma_cols:
            f = c43[[i]].reset_index()
            fa = f.rename(columns={'Tarih': 'ds', i: 'y'})
            fa = fa.dropna()
            m = Prophet()
            m.fit(fa)
            forecast = m.predict(fa)
            forecast_dict = forecast.to_dict()
            forecast_dict["Reading_Type"] = i
            frlist.append(forecast_dict)

    elif (tip == 'Deniz'):
        deniz_df = df.loc[df['Table_Type'] == 'Deniz']

        rel_col_names_deniz = ['Tarih', 'Bölge_Adı', 'Yer','Toplam_Koliform', 'Fekal_Koliform', 'Amonyak', 'Fekal_Streptokok']
        deniz = deniz_df[rel_col_names_deniz]
        deniz = deniz.set_index('Tarih')

        temp = deniz.copy()
        temp['chunkID'] = temp.groupby('Yer').ngroup()
        temp = temp.sort_values(by=['chunkID', 'Yer', 'Tarih',])
        temp = temp.dropna()

        c43 = temp.loc[temp['chunkID'] == 29]

        deniz_cols = ['Toplam_Koliform', 'Fekal_Koliform', 'Amonyak', 'Fekal_Streptokok']
        for i in deniz_cols:
            f = c43[[i]].reset_index()
            fa = f.rename(columns={'Tarih': 'ds', i: 'y'})
            fa = fa.dropna()
            m = Prophet()
            m.fit(fa)
            forecast = m.predict(fa)
            forecast_dict = forecast.to_dict()
            forecast_dict["Reading_Type"] = i
            frlist.append(forecast_dict)

    else:
        print('Unknown location type: Should be Akarsu, Arıtma, Deniz or Göl')

    return frlist
