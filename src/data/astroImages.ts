/**
 * Verified imagery for deep-sky objects and observatories (Wikimedia Commons).
 * Every entry is the real object it names; licences are public domain or CC —
 * the `credit` line must be shown wherever the image is.
 */
export interface AstroImage {
  src: string;
  credit: string;
}

export const ASTRO_IMAGES = {
  m31: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Andromeda_Galaxy_560mm_FL.jpg/1280px-Andromeda_Galaxy_560mm_FL.jpg',
    credit: 'David (Deddy) Dayag · CC BY-SA 4.0',
  },
  m42: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1280px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
    credit: 'NASA, ESA, M. Robberto (STScI/ESA), Hubble Orion Treasury Team',
  },
  m45: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pleiades_large.jpg/1280px-Pleiades_large.jpg',
    credit: 'NASA, ESA, AURA/Caltech, Palomar Gözlemevi',
  },
  m13: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Messier_13_Hubble_WikiSky.jpg/1280px-Messier_13_Hubble_WikiSky.jpg',
    credit: 'NASA, STScI, WikiSky',
  },
  m51: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg/1280px-Messier51_sRGB.jpg',
    credit: 'NASA, ESA, S. Beckwith (STScI), Hubble Heritage Team',
  },
  m57: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Hubble_image_of_the_Ring_Nebula_%28Messier_57%29.jpg/1280px-Hubble_image_of_the_Ring_Nebula_%28Messier_57%29.jpg',
    credit: 'NASA, ESA, C. R. O’Dell (Vanderbilt Üniversitesi)',
  },
  m1: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/1280px-Crab_Nebula.jpg',
    credit: 'NASA, ESA, J. Hester, A. Loll (Arizona State Üniversitesi)',
  },
  crabInfrared: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Crab_Nebula_%28MIRI_and_NIRCam_image%29_%28weic2417a%29.jpg/1280px-Crab_Nebula_%28MIRI_and_NIRCam_image%29_%28weic2417a%29.jpg',
    credit: 'NASA, ESA, CSA, STScI, T. Temim · CC BY 4.0',
  },
  crabXray: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Chandra_X-ray_Images_of_Crab_Nebula_%282009-crab-more-1_-_crab_xray%29.jpg',
    credit: 'NASA/CXC/SAO/F. Seward',
  },
  crabRadio: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/VLA_Radio_Image_of_the_Crab_Nebula_%28M1-Comparison-Radio-NRAO-2001-cc%29.jpg/1280px-VLA_Radio_Image_of_the_Crab_Nebula_%28M1-Comparison-Radio-NRAO-2001-cc%29.jpg',
    credit: 'NRAO/AUI, M. Bietenholz · CC BY 4.0',
  },
  m31Infrared: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/The_Infrared_Face_of_the_Andromeda_Galaxy_%28PIA26276%29.jpg/1280px-The_Infrared_Face_of_the_Andromeda_Galaxy_%28PIA26276%29.jpg',
    credit: 'NASA/JPL-Caltech',
  },
  m31Xray: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Chandra_X-ray_Image_of_Andromeda_Galaxy_%28M31%29_%282007-m31-more-1_-%29.jpg',
    credit: 'NASA/CXC/MPE/W. Pietsch ve ark.',
  },
  m31Radio: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Infrared-Radio_Image_of_the_Andromeda_Galaxy_%28M31%29_%282022-027%29.png/1280px-Infrared-Radio_Image_of_the_Andromeda_Galaxy_%28M31%29_%282022-027%29.png',
    credit: 'ESA, NASA/JPL-Caltech, C. Clark (STScI), R. Braun, C. Nieten, M. Smith',
  },
  jwst: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/James_Webb_Space_Telescope_Mirror_Seen_in_Full_Bloom_%2833433274343%29.jpg/1280px-James_Webb_Space_Telescope_Mirror_Seen_in_Full_Bloom_%2833433274343%29.jpg',
    credit: 'NASA/Chris Gunn',
  },
  elt: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Outlines_of_the_ELT_on_Cerro_Armazones_%28armazones_2022_1%29.jpg/1280px-Outlines_of_the_ELT_on_Cerro_Armazones_%28armazones_2022_1%29.jpg',
    credit: 'G. Hüdepohl (atacamaphoto.com)/ESO · CC BY 4.0',
  },
  alma: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/ALMA_antennas_on_Chajnantor.jpg/1280px-ALMA_antennas_on_Chajnantor.jpg',
    credit: 'ESO/B. Tafreshi (twanight.org) · CC BY 4.0',
  },
  hubble: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/View_of_Hubble_after_Being_Released_from_the_Shuttle_Atlantis_%2828223588012%29.jpg/1280px-View_of_Hubble_after_Being_Released_from_the_Shuttle_Atlantis_%2828223588012%29.jpg',
    credit: 'NASA',
  },
  tug: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/TUG_full_site.jpg/1280px-TUG_full_site.jpg',
    credit: 'Azizkayihan · CC BY-SA 4.0',
  },
} satisfies Record<string, AstroImage>;
