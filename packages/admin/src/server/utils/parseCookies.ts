import http from 'node:http';

export interface Cookies {
  readonly theme?: ReduxStore['ui']['theme'];
  readonly locale?: ReduxStore['ui']['locale'];
  readonly fontSize?: ReduxStore['ui']['fontSize'];
  readonly accessToken?: ReduxStore['auth']['accessToken'];
  readonly refreshToken?: ReduxStore['auth']['refreshToken'];
}

export const isTheme = (value: string | null): value is ReduxStore['ui']['theme'] => {
  const variants: ReduxStore['ui']['theme'][] = ['standardLight', 'standardDark'];

  return variants.includes(value as ReduxStore['ui']['theme']);
};

export const isLocale = (value: string | null): value is ReduxStore['ui']['locale'] => {
  const variants: ReduxStore['ui']['locale'][] = ['ru-RU'];

  return variants.includes(value as ReduxStore['ui']['locale']);
};

export const isFontSize = (value: string | null): value is ReduxStore['ui']['fontSize'] => {
  const variants: ReduxStore['ui']['fontSize'][] = ['small', 'normal', 'medium', 'large'];

  return variants.includes(value as ReduxStore['ui']['fontSize']);
};

export const parseCookiesFromHeaders = <TCookie extends { [key: string | number | symbol]: any }>(
  headers: http.IncomingHttpHeaders,
): Partial<Record<keyof TCookie, string>> => {
  const cookies: { [key: string]: string } = {};
  const fields = String(headers.cookie).split(';');

  fields.forEach(pair => {
    const index = pair.indexOf('=');
    if (index > -1) {
      const key = pair.substring(0, index).trim();
      let valueString = pair.substring(index + 1, pair.length).trim();
      if (valueString[0] === '"') {
        valueString = valueString.slice(1, -1);
      }
      cookies[key] = decodeURIComponent(valueString);
    }
  });

  return cookies as TCookie;
};

export const getCookies = (headers: http.IncomingHttpHeaders): Partial<Cookies> => {
  const cookiesObject = parseCookiesFromHeaders<Cookies>(headers);
  const cookies: Partial<Mutable<Cookies>> = {};

  Object.entries(cookiesObject).forEach(([key, value]) => {
    switch (key) {
      case 'theme':
        if (isTheme(value)) {
          cookies.theme = value;
        }
        break;
      case 'fontSize':
        if (isFontSize(value)) {
          cookies.fontSize = value;
        }
        break;
      case 'locale':
        if (isLocale(value)) {
          cookies.locale = value;
        }
        break;
      case 'accessToken':
        try {
          cookies.accessToken = JSON.parse(value);
        } catch (err) {
          cookies.accessToken = null;
        }
        break;
      case 'refreshToken':
        try {
          cookies.refreshToken = JSON.parse(value);
        } catch (err) {
          cookies.refreshToken = null;
        }
        break;

      default:
        break;
    }
  });

  return { ...cookies };
};
