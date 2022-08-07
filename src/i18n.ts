import type { i18Led } from "./Model";

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

export default i18n;
