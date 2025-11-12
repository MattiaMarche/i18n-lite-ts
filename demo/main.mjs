/**
 * Build your lib first: `npm run build` (or `pnpm build`), then serve this folder with a local server.
 */
import { I18n } from '../dist/index.mjs';

var translations = {
    en: {
        "created_by": "Created by",
        "greeting": "Hello",
        "farewell": "Goodbye"
    },
    es: {
        "created_by": "Creado por",
        "greeting": "Hola",
        "farewell": "Adiós"
    },
    fr: {
        "created_by": "Créé par",
        "greeting": "Bonjour",
        "farewell": "Au revoir"
    },
    it: {
        "created_by": "Creato da",
        "greeting": "Ciao",
        "farewell": "Addio"
    }
};

window._i18n = new I18n(
    null,
    translations
);


document.addEventListener( 'DOMContentLoaded', () => {
  const lang = window._i18n.getLang();
  document.querySelectorAll( '[class^="lang-"]:not([class$="-' + lang + '"])' ).forEach( el => {
    el.remove();
  });
  document.querySelector( '.created-by' ).textContent = window._i18n.t( 'created_by' );
});
