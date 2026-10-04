export const locales = ['en', 'bn'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function getMessages(locale: Locale) {
  switch (locale) {
    case 'bn':
      return import('./messages/bn.json')
    default:
      return import('./messages/en.json')
  }
}
