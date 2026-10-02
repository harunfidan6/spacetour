/**
 * Documentary imagery for sections, modules and zodiac signs (Wikimedia Commons).
 * Every file is public domain or Creative Commons; `credit` must be shown with the image.
 */
import type { AstroImage } from './astroImages';

export const DOC_IMAGES = {
  'ansik-gok-cisimleri': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/The_Planets_%28and_an_Exoplanet%29_in_True_Color.jpg/1920px-The_Planets_%28and_an_Exoplanet%29_in_True_Color.jpg',
    credit: 'Danny William Wilson · CC BY-SA 3.0 IGO',
  },
  'ansik-takimyildizlar': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Sidney_Hall_-_Urania%27s_Mirror_-_Ursa_Major.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Ursa_Major.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'astro-ay-evreleri': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg',
    credit: 'Gregory H. Revera · CC BY-SA 3.0',
  },
  'astro-burc-uyumu': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Zodiaque_de_Dend%C3%A9ra_-_Mus%C3%A9e_du_Louvre_Antiquit%C3%A9s_Egyptiennes_D_38_%3B_E_13482.jpg/1920px-Zodiaque_de_Dend%C3%A9ra_-_Mus%C3%A9e_du_Louvre_Antiquit%C3%A9s_Egyptiennes_D_38_%3B_E_13482.jpg',
    credit: 'Dendera zodyağı, Louvre · Shonagon · CC0',
  },
  'astro-burclar': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Harmonia_macrocosmica%2C_seu%2C_Atlas_universalis_et_novus%2C_totius_universi_creati_cosmographiam_generalem%2C_et_novam_exhibens_-_in_qu%C3%A2_omnium_totius_mundi_orbium_harmonica_constructio%2C_secundum_LOC_2011589506-26.jpg/1920px-thumbnail.jpg',
    credit: 'Andreas Cellarius, Harmonia Macrocosmica (1660)',
  },
  'astro-dogum-haritasi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Horoscope_of_Lehna_Singh_Majithia%2C_folio_of_the_work_%27Sarvasiddh%C4%81ntatattva-cu%E1%B8%8D%C4%81ma%E1%B9%87i%27_%28%E2%80%9CThe_Jewel_of_the_Essence_of_All_Sciences%E2%80%9D%29%2C_1840.jpg',
    credit: 'Lehna Singh Majithia’nın yıldız haritası, el yazması',
  },
  'astro-gunluk-burc': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Anatomical_Man.jpg',
    credit: 'Limbourg Kardeşler, Très Riches Heures (1410’lar)',
  },
  'astro-numeroloji': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1920px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg',
    credit: 'Raffaello, Atina Okulu (1511)',
  },
  'astro-retrolar': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Mars_path_2003.png',
    credit: 'Mars’ın 2003 geri hareket yolu · kamu malı',
  },
  'astro-sinastri': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/The_Lovers_%28Rider-Waite_Smith_tarot_deck%29.png/1920px-The_Lovers_%28Rider-Waite_Smith_tarot_deck%29.png',
    credit: 'Pamela Colman Smith, Aşıklar (1909)',
  },
  'astro-tarot': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_Star_%28Rider-Waite_Smith_tarot_deck%29.png/1920px-The_Star_%28Rider-Waite_Smith_tarot_deck%29.png',
    credit: 'Pamela Colman Smith, Yıldız (1909)',
  },
  'astro-transitler': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cellarius_Harmonia_Macrocosmica_-_Theoria_Trium_Superiorum_Planetarum.jpg/1920px-Cellarius_Harmonia_Macrocosmica_-_Theoria_Trium_Superiorum_Planetarum.jpg',
    credit: 'Andreas Cellarius, Harmonia Macrocosmica (1660)',
  },
  'astro-yildiz-fali': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Cellarius_ptolemaic_system.jpg/1920px-Cellarius_ptolemaic_system.jpg',
    credit: 'Jan van Loon / Andreas Cellarius (1660)',
  },
  'canli-arsiv': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Pillars_of_Creation_%28NIRCam_Image%29.jpg/1920px-Pillars_of_Creation_%28NIRCam_Image%29.jpg',
    credit: 'NASA, ESA, CSA, STScI',
  },
  'canli-bu-gece': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Three_people%2C_three_telescopes_and_three_planets.jpg/1920px-Three_people%2C_three_telescopes_and_three_planets.jpg',
    credit: 'ESO · CC BY 4.0',
  },
  'canli-iss': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ISS_from_the_SpaceX_Crew_Dragon_Endeavor_during_Flyaround_%28iss066e079887%29.jpg/1920px-ISS_from_the_SpaceX_Crew_Dragon_Endeavor_during_Flyaround_%28iss066e079887%29.jpg',
    credit: 'NASA / Thomas Pesquet',
  },
  'canli-sondalar': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png',
    credit: 'NASA',
  },
  'canli-uzay-havasi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NASA%27s_SDO_Observes_an_X-class_Solar_Flare_%2815562323166%29.jpg/1920px-NASA%27s_SDO_Observes_an_X-class_Solar_Flare_%2815562323166%29.jpg',
    credit: 'NASA Goddard / SDO',
  },
  'gozle-akademi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Grappling_the_Hubble_Space_Telescope.jpg/1920px-Grappling_the_Hubble_Space_Telescope.jpg',
    credit: 'NASA · CC BY 2.0',
  },
  'gozle-gozlemevleri': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Paranal_and_the_Pacific_at_sunset_%28dsc4088%2C_retouched%2C_cropped%29.jpg/1920px-Paranal_and_the_Pacific_at_sunset_%28dsc4088%2C_retouched%2C_cropped%29.jpg',
    credit: 'ESO / G. Hüdepohl · CC BY 4.0',
  },
  'gozle-radyo': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/U.S._Route_60_Very_Large_Array%2C_NM_%2824341009940%29.jpg/1920px-U.S._Route_60_Very_Large_Array%2C_NM_%2824341009940%29.jpg',
    credit: 'Mobilus In Mobili · CC BY-SA 2.0',
  },
  'gozle-spektroskopi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Solar_spectrum%2C_visible_%28noao-01771%29.jpg/1920px-Solar_spectrum%2C_visible_%28noao-01771%29.jpg',
    credit: 'NSO / AURA / NSF · CC BY 4.0',
  },
  'gozle-spektrum': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Crab_Nebula_NGC_1952_%28composite_from_Chandra%2C_Hubble_and_Spitzer%29.jpg/1920px-Crab_Nebula_NGC_1952_%28composite_from_Chandra%2C_Hubble_and_Spitzer%29.jpg',
    credit: 'X-ışını NASA/CXC/SAO · Optik NASA/ESA · Kızılötesi NASA/JPL-Caltech',
  },
  'gozle-transit': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/SDO%27s_Ultra-high_Definition_View_of_2012_Venus_Transit_--_Path_Sequence.jpg/1920px-SDO%27s_Ultra-high_Definition_View_of_2012_Venus_Transit_--_Path_Sequence.jpg',
    credit: 'NASA / SDO, AIA · CC BY 2.0',
  },
  'gozle-webb-hubble': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Hubble_and_Webb_Showcase_the_Pillars_of_Creation_%28Side_by_Side%29_%28weic2216d%29.jpeg/1920px-Hubble_and_Webb_Showcase_the_Pillars_of_Creation_%28Side_by_Side%29_%28weic2216d%29.jpeg',
    credit: 'NASA, ESA, CSA, STScI; J. DePasquale, A. Koekemoer, A. Pagan · CC BY 4.0',
  },
  'harita-bortle': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/ISS-62_City_lights_at_the_intersection_of_Europe_and_Asia.jpg/1920px-ISS-62_City_lights_at_the_intersection_of_Europe_and_Asia.jpg',
    credit: 'NASA (ISS-62) · İstanbul ve Marmara geceleyin',
  },
  'harita-parlak-yildizlar': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Orion_-_Flickr_-_gjdonatiello.jpg/1920px-Orion_-_Flickr_-_gjdonatiello.jpg',
    credit: 'Giuseppe Donatiello · CC0',
  },
  'harita-planetaryum': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/ESO_-_Milky_Way.jpg/1920px-ESO_-_Milky_Way.jpg',
    credit: 'ESO / S. Brunier · CC BY 4.0',
  },
  'harita-polaris': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Trails_Near_and_Far_%28iotw2009a%29.jpg/1920px-Trails_Near_and_Far_%28iotw2009a%29.jpg',
    credit: 'CTIO / NOIRLab / NSF / AURA / D. Munizaga · CC BY 4.0',
  },
  'lab-asteroit': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Meteor_Crater_-_Arizona.jpg/1920px-Meteor_Crater_-_Arizona.jpg',
    credit: 'USGS / National Map',
  },
  'lab-cmb': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/WMAP_2012.png/1920px-WMAP_2012.png',
    credit: 'NASA / WMAP Bilim Ekibi',
  },
  'lab-hohmann': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Mars_23_aug_2003_hubble_%28cropped%29.jpg',
    credit: 'NASA, ESA, Hubble Heritage Team',
  },
  'lab-karadelik': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Black_hole_-_Messier_87.jpg/1920px-Black_hole_-_Messier_87.jpg',
    credit: 'Event Horizon Telescope · CC BY 4.0',
  },
  'lab-kutlecekim': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/John_W._Young_on_the_Moon.jpg/1920px-John_W._Young_on_the_Moon.jpg',
    credit: 'NASA / Charlie Duke (Apollo 16)',
  },
  'lab-ligo': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/LIGO_Hanford_aerial_05.jpg/1920px-LIGO_Hanford_aerial_05.jpg',
    credit: 'LIGO Laboratuvarı',
  },
  'lab-olcek': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Planets_and_sun_size_comparison.jpg/1920px-Planets_and_sun_size_comparison.jpg',
    credit: 'Lsmpascal · CC BY-SA 3.0',
  },
  'lab-orrery': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Wright_of_Derby%2C_The_Orrery.jpg/1920px-Wright_of_Derby%2C_The_Orrery.jpg',
    credit: 'Joseph Wright of Derby, Orrery Üzerine Ders Veren Filozof (1766)',
  },
  'lab-otegezegen': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Rocky_Exoplanet_TRAPPIST-1_c_%28Artist_Concept%29.jpg/1920px-Rocky_Exoplanet_TRAPPIST-1_c_%28Artist_Concept%29.jpg',
    credit: 'NASA, ESA, CSA, J. Olmsted (STScI)',
  },
  'lab-zaman': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/1920px-Hubble_ultra_deep_field.jpg',
    credit: 'NASA, ESA (Hubble Ultra Deep Field)',
  },
  'sec-ansiklopedi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/1920px-Saturn_during_Equinox.jpg',
    credit: 'NASA / JPL / Space Science Institute (Cassini)',
  },
  'sec-astroloji': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Cellarius_Harmonia_Macrocosmica_-_Planisphaerium_Braheum.jpg/1920px-Cellarius_Harmonia_Macrocosmica_-_Planisphaerium_Braheum.jpg',
    credit: 'Andreas Cellarius, Harmonia Macrocosmica (1660)',
  },
  'sec-canli': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/1920px-International_Space_Station_after_undocking_of_STS-132.jpg',
    credit: 'NASA / STS-132 mürettebatı',
  },
  'sec-gozlemevi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/VLT_Laser_Guide_Star_%28img_4310%29.jpg/1920px-VLT_Laser_Guide_Star_%28img_4310%29.jpg',
    credit: 'ESO / H. H. Heyer · CC BY 4.0',
  },
  'sec-harita': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Laser_Towards_Milky_Ways_Centre.jpg/1920px-Laser_Towards_Milky_Ways_Centre.jpg',
    credit: 'ESO / Y. Beletsky · CC BY 4.0',
  },
  'sec-takvim': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2017_Total_Solar_Eclipse_%28NHQ201708210106%29.jpg/1920px-2017_Total_Solar_Eclipse_%28NHQ201708210106%29.jpg',
    credit: 'NASA / Aubrey Gemignani',
  },
  'sec-yolculuk': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1920px-The_Earth_seen_from_Apollo_17.jpg',
    credit: 'NASA / Apollo 17 mürettebatı',
  },
  'sign-akrep': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sidney_Hall_-_Urania%27s_Mirror_-_Scorpio.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Scorpio.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-aslan': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Sidney_Hall_-_Urania%27s_Mirror_-_Leo_Major_and_Leo_Minor.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Leo_Major_and_Leo_Minor.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-balik': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Sidney_Hall_-_Urania%27s_Mirror_-_Pisces.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Pisces.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-basak': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Sidney_Hall_-_Urania%27s_Mirror_-_Virgo.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Virgo.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-boga': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Taurus_-_Sidy._Hall%2C_sculpt._LCCN2002695510.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-ikizler': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sidney_Hall_-_Urania%27s_Mirror_-_Gemini.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Gemini.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-koc': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Sidney_Hall_-_Urania%27s_Mirror_-_Aries_and_Musca_Borealis.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Aries_and_Musca_Borealis.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-kova': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Sidney_Hall_-_Urania%27s_Mirror_-_Aquarius%2C_Piscis_Australis_%26_Ballon_Aerostatique.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Aquarius%2C_Piscis_Australis_%26_Ballon_Aerostatique.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-oglak': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Sidney_Hall_-_Urania%27s_Mirror_-_Capricornus.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Capricornus.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-terazi': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Sidney_Hall_-_Urania%27s_Mirror_-_Libra.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Libra.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-yay': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Sidney_Hall_-_Urania%27s_Mirror_-_Sagittarius_and_Corona_Australis%2C_Microscopium%2C_and_Telescopium.png/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Sagittarius_and_Corona_Australis%2C_Microscopium%2C_and_Telescopium.png',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
  'sign-yengec': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Sidney_Hall_-_Urania%27s_Mirror_-_Cancer.jpg/1920px-Sidney_Hall_-_Urania%27s_Mirror_-_Cancer.jpg',
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
  },
} satisfies Record<string, AstroImage>;

export type DocImageKey = keyof typeof DOC_IMAGES;
