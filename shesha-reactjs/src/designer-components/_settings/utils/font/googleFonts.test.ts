import { ensureGoogleFont } from './googleFonts';
import { withFontFallback } from './utils';

const fontLinks = (): HTMLLinkElement[] => Array.from(document.head.querySelectorAll('link[data-sha-google-font]'));
const linkFor = (apiName: string): HTMLLinkElement | null => document.head.querySelector(`link[data-sha-google-font="${apiName}"]`);

describe('ensureGoogleFont', () => {
  it('injects a css2 stylesheet link with the supported weights, once', () => {
    ensureGoogleFont('Ubuntu');
    ensureGoogleFont('Ubuntu');
    const link = linkFor('Ubuntu');
    expect(link?.href).toBe('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
    expect(fontLinks().filter((l) => l.dataset.shaGoogleFont === 'Ubuntu')).toHaveLength(1);
  });

  it('maps picker names to the exact API name', () => {
    ensureGoogleFont('Pt Sans');
    expect(linkFor('PT Sans')?.href).toContain('family=PT+Sans:wght@400;700');
  });

  it('uses the first family of a stack and ignores quotes', () => {
    ensureGoogleFont("'Merriweather', 'Inter Variable', sans-serif");
    expect(linkFor('Merriweather')).not.toBeNull();
  });

  it('ignores non-Google families', () => {
    const before = fontLinks().length;
    ensureGoogleFont('Arial');
    ensureGoogleFont('Segoe UI');
    ensureGoogleFont(undefined);
    expect(fontLinks()).toHaveLength(before);
  });

  it('adds preconnect links for the font hosts', () => {
    expect(document.head.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]')).not.toBeNull();
    expect(document.head.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')).not.toBeNull();
  });

  it('is triggered by withFontFallback', () => {
    withFontFallback('Playfair Display');
    expect(linkFor('Playfair Display')).not.toBeNull();
  });
});
