export interface Theme {
  name: string;
  author: string;
  colors: {
    base00: string;
    base01: string;
    base02: string;
    base03: string;
    base04: string;
    base05: string;
    base06: string;
    base07: string;
    base08: string;
    base09: string;
    base0a: string;
    base0b: string;
    base0c: string;
    base0d: string;
    base0e: string;
    base0f: string;
  };
}

export type i18Led = Record<string, string> | string;

export function i18nGet(txt: i18Led) {
  const locale =
    navigator.language || (navigator as any).userLanguage || "default";
  return txt[locale.replaceAll("-", "_")] || txt;
}

export type Maybe<T> = T | null;
