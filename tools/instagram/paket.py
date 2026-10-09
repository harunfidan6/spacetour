# Bütün üretilmiş Instagram görsellerini ve açıklamalarını tek klasörde toplar: python3 tools/instagram/paket.py → paylasim/
# (BENİ-OKU.txt ayrıca yazılır; görsellerin yanındaki .txt dosyaları *.md planlarındaki açıklamalardan çıkarılır.)
import re, shutil, os
R='/home/user/spacetour'; I=R+'/tools/instagram'; C=I+'/cikti'; P=R+'/paylasim'
shutil.rmtree(P, ignore_errors=True)
def md(n): return open(f'{I}/{n}',encoding='utf8').read()
def blok(text, baslik_re, nth=0):
    m=re.search(baslik_re, text, re.M); assert m, baslik_re
    rest=text[m.end():]
    bl=re.findall(r'^```\n(.*?)^```', rest, re.M|re.S)
    return bl[nth].rstrip()+'\n'
def koy(src, dst_dir, ad, metin=None):
    os.makedirs(f'{P}/{dst_dir}', exist_ok=True)
    ext=os.path.splitext(src)[1]
    shutil.copy2(src, f'{P}/{dst_dir}/{ad}{ext}')
    if metin: open(f'{P}/{dst_dir}/{ad}.txt','w',encoding='utf8').write(metin)
    return f'{dst_dir}/{ad}{ext}'
satirlar=[]

# 1 · Tarihsiz seri
k=md('kalici-gonderiler.md')
seri, site = k.split('# Site tarzı seri')
koy(f'{C}/gonderi/kalici-isik-yolculugu.png','1-tarihsiz-seri','01-isik-yolculugu', blok(seri, r'^## № 01 '))
for f in sorted(os.listdir(f'{C}/gonderi')):
    m=re.match(r'kalici-(\d\d)-(.+)\.png', f)
    if m: koy(f'{C}/gonderi/{f}','1-tarihsiz-seri',f'{m[1]}-{m[2]}', blok(seri, rf'^## № {m[1]} '))
# 2 · Evren arşivi (site tarzı)
kapanis = blok(site, r'^Ortak kapanış')
for f in sorted(os.listdir(f'{C}/gonderi')):
    m=re.match(r'site-(\d\d)-(.+)\.png', f)
    if m:
        t=blok(site, rf'^## № {m[1]} ').rstrip('\n').split('\n')
        # kapanışı etiketlerin önüne ekle
        t = t[:-1] + [kapanis.rstrip(), ''] + t[-1:] if t[-1].startswith('#') else t + ['', kapanis.rstrip()]
        koy(f'{C}/gonderi/{f}','2-evren-arsivi',f'{m[1]}-{m[2]}', '\n'.join(t)+'\n')
# 3 · 1. hafta kartları (7–13 Ekim)
h=md('hafta-1.md')
for f in sorted(os.listdir(C)):
    m=re.match(r'(\d\d)-(.+)\.png', f)
    if m: koy(f'{C}/{f}','3-hafta-1-kartlar',f'{m[1]}-{m[2]}', blok(h, rf'^## .*`{m[1]}-{re.escape(m[2])}\.png`'))
# 4 · Reels
g9=md('gun-2026-10-09.md'); g8=md('gun-2026-10-08.md')
koy(f'{R}/video/spacetour-gece-dikey.mp4','4-reels','bu-gece-gokyuzu-9-ekim', blok(g9, r'^## Reels'))
koy(f'{R}/video/spacetour-gunluk-dikey.mp4','4-reels/eski-deneme','site-kaydi-8-ekim', blok(g8, r'^## 2 · Reels'))
# 5 · 8 Ekim günlük
koy(f'{C}/gonderi/2026-10-08-gok-almanagi.png','5-gunluk-8-ekim','gonderi-gok-almanagi', blok(g8, r'^## 3 · Gönderi'))
koy(f'{C}/hikaye-tek/2026-10-08-gokyuzu-tarifesi.png','5-gunluk-8-ekim','hikaye-gokyuzu-tarifesi')
koy(f'{C}/hikaye-tek/2026-10-08-yeni-aya-2-gun.png','5-gunluk-8-ekim','hikaye-yedek-yeni-aya-2-gun')
# 6 · Burç hikâyeleri
for d in sorted(os.listdir(f'{C}/hikaye')):
    for f in sorted(os.listdir(f'{C}/hikaye/{d}')):
        koy(f'{C}/hikaye/{d}/{f}', f'6-burc-hikayeleri/{d}', os.path.splitext(f)[0])
pay=md('hikaye-burc.md')
pay=pay[pay.index('## Paylaşım'):pay.index('## Notlar')]
open(f'{P}/6-burc-hikayeleri/PAYLASIM.txt','w',encoding='utf8').write(pay)
open(f'{P}/5-gunluk-8-ekim/PAYLASIM.txt','w',encoding='utf8').write(md('gun-2026-10-08.md'))
print('ok')
