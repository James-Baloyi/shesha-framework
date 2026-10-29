import { isNullOrWhiteSpace } from '@/utils/nullables';

/** Google-hosted families offered by the font picker (see `fontTypes`), keyed by lowercased name.
 * `weights` holds the weights each family actually serves - css2 rejects the whole request otherwise. */
const GOOGLE_FONTS: Record<string, { apiName: string; weights: string }> = {
  'roboto': { apiName: 'Roboto', weights: '100;300;400;500;700;900' },
  'open sans': { apiName: 'Open Sans', weights: '300;400;500;600;700;800' },
  'lato': { apiName: 'Lato', weights: '100;300;400;700;900' },
  'ubuntu': { apiName: 'Ubuntu', weights: '300;400;500;700' },
  'merriweather': { apiName: 'Merriweather', weights: '300;400;500;700;900' },
  'pt sans': { apiName: 'PT Sans', weights: '400;700' },
  'source sans pro': { apiName: 'Source Sans Pro', weights: '200;300;400;600;700;900' },
  'fira sans': { apiName: 'Fira Sans', weights: '100;300;400;500;700;900' },
  'playfair display': { apiName: 'Playfair Display', weights: '400;500;700;900' },
  'noto sans': { apiName: 'Noto Sans', weights: '100;300;400;500;700;900' },
  'droid sans': { apiName: 'Droid Sans', weights: '400;700' },
  'crimson text': { apiName: 'Crimson Text', weights: '400;600;700' },
  'pt serif': { apiName: 'PT Serif', weights: '400;700' },
};

const requested = new Set<string>();

const preconnect = (href: string): void => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (href.includes('gstatic')) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/** Loads the Google-hosted font for `family` (the first name in a stack) on first use. No-op for bundled/system fonts and on the server. */
export const ensureGoogleFont = (family: string | null | undefined): void => {
  if (isNullOrWhiteSpace(family) || typeof document === 'undefined') return;
  const primary = (family.split(',')[0] ?? '').trim().replace(/^['"]|['"]$/g, '');
  const spec = GOOGLE_FONTS[primary.toLowerCase()];
  if (!spec || requested.has(spec.apiName)) return;
  requested.add(spec.apiName);
  if (document.head.querySelector(`link[data-sha-google-font="${spec.apiName}"]`)) return;
  if (!document.head.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')) {
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com');
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${spec.apiName.replace(/ /g, '+')}:wght@${spec.weights}&display=swap`;
  link.dataset.shaGoogleFont = spec.apiName;
  document.head.appendChild(link);
};
