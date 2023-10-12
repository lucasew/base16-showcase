const i18n = {
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
  no_themes_loaded: {
    en_US: "No themes loaded",
    pt_BR: "Nenhum tema carregado"
  },
  title: {
     en_US: "Base16 theme showcase",
     pt_BR: "Demonstração de temas Base16"
  },
  instruction_supported_formats: {
    en_US: "You can load a nix-colors structured JSON or a base16 YAML theme file.",
    pt_BR: "Você pode carregar um JSON estruturado de acordo com o nix-colors ou um tema YAML no formato do base16"
  },
  instruction_other_details: {
    en_US: "Some other details may be covered by this app.",
    pt_BR: "Alguns outros detalhes podem ser cobertos por este app."
  },
  instruction_ingestion: {
    en_US: "You can drag-and-drop the files or double-click anywhere in the app to open a file selector.",
    pt_BR: "Você pode arrastar e soltar os arquivos ou dar um duplo clique em qualquer lugar do app para abrir um seletor de arquivos."
  },
  instruction_load_default_colors: {
    en_US: "You can also load the default pre-defined colorscheme pack.",
    pt_BR: "Você também pode carregar o conjunto pré-definido de esquemas de cores."
  }
};

export type i18nKeys = keyof typeof i18n

export type i18Led = Record<string, string> | string;

const DEFAULT_LOCALE = 'en_US'

export function i18nGet(txt: i18Led) {
  const locale =
    navigator.language || (navigator as any).userLanguage || "en_US";
  const string = txt[locale.replaceAll("-", "_")]
  if (!string) {
      return txt[DEFAULT_LOCALE]
  }
  return string
}

export function i18nString(label: i18nKeys) {
    return i18nGet(i18n[label])
}

export default i18n;
