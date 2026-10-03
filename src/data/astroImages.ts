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
    src: '/images/space/andromeda-galaxy-560mm-fl-3885b3.jpg',
    credit: 'David (Deddy) Dayag · CC BY-SA 4.0',
  },
  m42: {
    src: '/images/space/orion-nebula-hubble-2006-mosaic-18000-cb452b.jpg',
    credit: 'NASA, ESA, M. Robberto (STScI/ESA), Hubble Orion Treasury Team',
  },
  m45: {
    src: '/images/space/pleiades-large-0942fb.jpg',
    credit: 'NASA, ESA, AURA/Caltech, Palomar Gözlemevi',
  },
  m13: {
    src: '/images/space/messier-13-hubble-wikisky-64f677.jpg',
    credit: 'NASA, STScI, WikiSky',
  },
  m51: {
    src: '/images/space/messier51-srgb-5eaed2.jpg',
    credit: 'NASA, ESA, S. Beckwith (STScI), Hubble Heritage Team',
  },
  m57: {
    src: '/images/space/hubble-image-of-the-ring-nebula-messier-57-fa7adc.jpg',
    credit: 'NASA, ESA, C. R. O’Dell (Vanderbilt Üniversitesi)',
  },
  m1: {
    src: '/images/space/crab-nebula-bf6d6a.jpg',
    credit: 'NASA, ESA, J. Hester, A. Loll (Arizona State Üniversitesi)',
  },
  crabInfrared: {
    src: '/images/space/crab-nebula-miri-and-nircam-image-weic2417a-d51f45.jpg',
    credit: 'NASA, ESA, CSA, STScI, T. Temim · CC BY 4.0',
  },
  crabXray: {
    src: '/images/space/chandra-x-ray-images-of-crab-nebula-2009-crab-more-1-crab-xr-b3708e.jpg',
    credit: 'NASA/CXC/SAO/F. Seward',
  },
  crabRadio: {
    src: '/images/space/vla-radio-image-of-the-crab-nebula-m1-comparison-radio-nrao--03b656.jpg',
    credit: 'NRAO/AUI, M. Bietenholz · CC BY 4.0',
  },
  m31Infrared: {
    src: '/images/space/the-infrared-face-of-the-andromeda-galaxy-pia26276-8d528b.jpg',
    credit: 'NASA/JPL-Caltech',
  },
  m31Xray: {
    src: '/images/space/chandra-x-ray-image-of-andromeda-galaxy-m31-2007-m31-more-1-f487a3.jpg',
    credit: 'NASA/CXC/MPE/W. Pietsch ve ark.',
  },
  m31Radio: {
    src: '/images/space/infrared-radio-image-of-the-andromeda-galaxy-m31-2022-027-70560a.jpg',
    credit: 'ESA, NASA/JPL-Caltech, C. Clark (STScI), R. Braun, C. Nieten, M. Smith',
  },
  jwst: {
    src: '/images/space/james-webb-space-telescope-mirror-seen-in-full-bloom-3343327-520afa.jpg',
    credit: 'NASA/Chris Gunn',
  },
  elt: {
    src: '/images/space/outlines-of-the-elt-on-cerro-armazones-armazones-2022-1-672c19.jpg',
    credit: 'G. Hüdepohl (atacamaphoto.com)/ESO · CC BY 4.0',
  },
  alma: {
    src: '/images/space/alma-antennas-on-chajnantor-c0b13a.jpg',
    credit: 'ESO/B. Tafreshi (twanight.org) · CC BY 4.0',
  },
  hubble: {
    src: '/images/space/view-of-hubble-after-being-released-from-the-shuttle-atlanti-b09060.jpg',
    credit: 'NASA',
  },
  tug: {
    src: '/images/space/tug-full-site-130fed.jpg',
    credit: 'Azizkayihan · CC BY-SA 4.0',
  },
} satisfies Record<string, AstroImage>;
