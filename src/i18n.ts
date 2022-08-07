let i18n: Record<string, i18Led> = {
  loading: {
    en_US: "Loading...",
    pt_BR: "Carregando...",
  },
  error: {
    en_US: "Error",
    pt_BR: "Erro",
  },
  load: {
    en_US: "Load",
    pt_BR: "Carregar",
  },
};

export type i18Led = Record<string, string> | string;

export function i18nGet(txt: i18Led) {
  const locale =
    navigator.language || (navigator as any).userLanguage || "default";
  return txt[locale.replaceAll("-", "_")] || txt;
}

export default i18n;
