export const locales = ['sv', 'en'] as const;
export const defaultLocale = 'sv' as const;
export type Locale = (typeof locales)[number];
