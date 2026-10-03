/**
 * Film mode (`?film=1`): the promo-video recorder (tools/film) plays the real site
 * frame by frame and drives it through `window.__film`. Regular visitors never see it.
 * The flag is set on <html data-film> by the inline head script in the root layout.
 */

export type FilmFn = (...args: (number | string)[]) => unknown;

export interface FilmApi {
  /** True once the document, fonts and every image (lazy ones forced eager) are loaded. */
  hazir: () => boolean;
  /** GSAP scroll to a selector or a y offset; `ofset` is subtracted from the target. */
  kaydir: (hedef: string | number, sure?: number, ofset?: number) => void;
  /** Real click on the n-th element matching the selector. */
  tikla: (secici: string, sira?: number) => void;
  /** Sets a range/text input the way React expects (native setter + input event). */
  deger: (secici: string, deger: number | string) => void;
  /** Actions registered by components, e.g. `eylemler.gokyuzu.bak(az, polar)`. */
  eylemler: Record<string, Record<string, FilmFn>>;
}

declare global {
  interface Window {
    __film?: FilmApi;
    /** Actions registered before the film API was installed. */
    __filmPending?: Record<string, Record<string, FilmFn>>;
  }
}

export function isFilm(): boolean {
  return typeof document !== 'undefined' && document.documentElement.hasAttribute('data-film');
}

/** Exposes component-level actions to the recorder; returns the cleanup. */
export function registerFilm(name: string, actions: Record<string, FilmFn>): () => void {
  if (!isFilm()) return () => {};
  const pending = (window.__filmPending ??= {});
  if (window.__film) window.__film.eylemler[name] = actions;
  else pending[name] = actions;
  return () => {
    if (window.__film?.eylemler[name] === actions) delete window.__film.eylemler[name];
    if (pending[name] === actions) delete pending[name];
  };
}
