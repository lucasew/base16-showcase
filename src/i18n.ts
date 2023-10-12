const i18n = {
  loading: {
    en: "Loading...",
    pt: "Carregando...",
  },
  error: {
    en: "Error",
    pt: "Erro",
  },
  load: {
    en: "Load",
    pt: "Carregar",
  },
  no_themes_loaded: {
    en: "No themes loaded",
    pt: "Nenhum tema carregado"
  },
  title: {
     en: "Base16 theme showcase",
     pt: "Demonstração de temas Base16"
  },
  instruction_supported_formats: {
    en: "You can load a nix-colors structured JSON or a base16 YAML theme file.",
    pt: "Você pode carregar um JSON estruturado de acordo com o nix-colors ou um tema YAML no formato do base16"
  },
  instruction_other_details: {
    en: "Some other details may be covered by this app.",
    pt: "Alguns outros detalhes podem ser cobertos por este app."
  },
  instruction_ingestion: {
    en: "You can drag-and-drop the files or double-click anywhere in the app to open a file selector.",
    pt: "Você pode arrastar e soltar os arquivos ou dar um duplo clique em qualquer lugar do app para abrir um seletor de arquivos."
  },
  instruction_load_default_colors: {
    en: "You can also load the default pre-defined colorscheme pack.",
    pt: "Você também pode carregar o conjunto pré-definido de esquemas de cores."
  }
};

export type i18nKeys = keyof typeof i18n

export type i18Led = Record<string, string> | string;

const DEFAULT_LOCALE = 'en'

export function i18nGet(txt: i18Led) {
  let locale =
    navigator.language || (navigator as any).userLanguage || "en_US";

  locale = locale.replaceAll("-", "_")
  return txt[locale] || txt[locale.split('_')[0]] || txt[DEFAULT_LOCALE]
}

export function i18nString(label: i18nKeys) {
    return i18nGet(i18n[label])
}

export default i18n;
