#Çözünmüş oksijen (%) - Sıcaklık - Tuzluluk parametreleri bulunun bölgeye göre (Ege, Akdeniz vs.) farklı referans aralığı.
#pH değeri (7.5 - X) -x burada okunan gerçek değer- sonucunun yollanması ile değerlendirilmesi gerekiyo.
#O2(%) ve O2(mg/l) azalarak gidiyor.
#4. verilere gerek yok sanırım.

akarsuAralık = [
    ["Amonyum Azotu", [0.2, 1, 2, 2]],
    ["Elektriksel İletkenlik", [400, 1000, 3000, 3000]],
    ["Toplam Koliform", [100, 20000, 100000, 100000]],
    ["Tuzluluk", []],
    ["Nitrat Azotu", [5, 10, 20, 20]],
    ["Çözünmüş Oksijen", []],
    ["Biyokimyasal Oksijen İhtiyacı", [4, 8, 20, 20]],
    ["Toplam Pestisit", [0.001, 0.01, 0.1, 0.1]],
    ["Debi (Saniye)", []],
    ["Kimyasal Oksijen İhtiyacı", [25, 50, 70, 70]],
    ["Nitrit Azotu", [0.002, 0.01, 0.05, 0.05]],
    ["Toplam Kjeldahl Azotu", [0.5, 1.5, 5, 5]],
    ["Fekal Koliform", [10, 200, 2000, 2000]],
    ["Toplam Fosfor", [0.03, 0.16, 0.65, 0.65]],
    ["Sıcaklık", [25, 25, 30, 30]],
    ["Toplam Çözünmüş Madde", [500, 1500, 5000, 5000]],
    ["Askıda Katı Madde", [35]],
    # ["pH", [1, 1, 1.5, 1.5]],
    ["pH", []],
    ["Orto Fosfat", [0.5, 0.16, 0.65, 0.65]],
    ["Açıklama", []],
]

denizAralık = [
    ["Fekal Streptokok", [100]],
    ["Amonyak", [0.02]],
    ["Toplam Koliform", [100, 20000, 100000, 100000]],
    ["Yağ", [0.5, 1.5, 5, 5]],
    ["Renk", []],
    ["Çözünmüş Oksijen", []],
    ["Fekal Koliform", [10, 200, 2000, 2000]],
    ["Işık Geçirgenliği", []],
    ["Sıcaklık", [25, 25, 30, 30]],
    # ["pH", [1, 1, 1.5, 1.5]],
    ["pH", []],
    ["Toplam Fenol", [0.002, 0.01, 0.1, 0.1]],
    ["Renk / Koku", []],
    ["Koku", []],
    ["Açıklama", []],
]

gölAralık = [
    ["Kimyasal Oksijen İhtiyacı", [3, 8]],
    ["Toplam Koliform", [1000, 1000]],
    ["Askıda Katı Madde", [5, 15]],
    ["Tuzluluk", []],
    ["Çözünmüş Oksijen", []],
    ["Işık Geçirgenliği", []],
    ["Toplam Fosfor", [0.005, 0.1]],
    ["Klorofil", [0.008, 0.025]],
    ["Sıcaklık", []],
    ["Toplam Azot", [0.1, 1]],
    # ["pH", [1,1.5]],
    ["pH", []],
    ["Toplam Pestisit", [0.001, 0.01, 0.1, 0.1]],
    ["Elektriksel İletkenlik", [400, 1000, 3000, 3000]],
    ["Açıklama", []],
]

arıtmaAralık = [
    ["Kimyasal Oksijen İhtiyacı", [25, 50, 70, 70]],
    ["Askıda Katı Madde", [35]],
    ["Toplam Koliform", [100, 20000, 100000, 100000]],
    ["Tuzluluk", []],
    ["Çözünmüş Oksijen", []],
    ["Fekal Koliform", [10, 200, 2000, 2000]],
    ["Biyokimyasal Oksijen İhtiyacı", [4, 8, 20, 20]],
    ["Toplam Fosfor", [0.03, 0.16, 0.65, 0.65]],
    ["Sıcaklık", []],
    ["Toplam Azot", [15]],
    # ["pH", [1, 1, 1.5, 1.5]],
    ["pH", []],
    ["Debi (Gün)", []],
    ["Debi (Saniye)", []],
    ["Elektriksel İletkenlik", [400, 1000, 3000, 3000]],
    ["Açıklama", []],
]