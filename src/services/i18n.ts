import { Translations } from "../types/i18n";


/**
 * @description Internationalization singleton class, for super lite and performance friendly translations with TypeScript.
 */
export class I18n {
    /**
     * STATIC VARIABLES
     */
    /**
     * @description {string} Default i18n language code (used in fallbacks).
     */
    private static DEFAULT_LANG: string = 'en';
    /**
     * @description {I18n | null} Default i18n instance.
     */
    private static _instance: I18n | null = null;

    /**
     * VARIABLES
     */
    /**
     * @description {boolean} Whether this instance has been initialized.
     */
    private initialized: boolean = false;
    /**
     * @description {string} Language code to use for this instance.
     */
    private lang: string = I18n.DEFAULT_LANG;
    /**
     * @description {Translations} Translations for this instance.
     */
    private translations: Translations = {};


    /**
     * CONSTRUCTOR AND HOOKS
     */

    /**
     * @description Router service class, performing a basic performance oriented routing for React.
     * @param {string | null} lang Language code to use for this instance.
     * If null, the language will be detected automatically: first checking the 'lang' query parameter in the URL,
     * then falling back to the browser's language settings.
     * @param {Translations | string} translations Translations to use for this instance.
     * Can be an object, a JSON string or an URL used to fetch the translations from.
     * Default: {}.
     * @return {I18n} New instance of this class.
     */
    constructor ( lang: string | null, translations: Translations | string = {} ) {
        this.setLang( lang );
        this.setTranslations( translations );
    }


    /**
     * STATIC METHODS
     */

    /**
     * @description {I18n} Initializes and gets the default i18n instance.
     * If no instance exists, a new one will be created with specified parameters or the default language I18n.DEFAULT_LANG.
     * It's an async method to allow fetching translations from a URL knowing when the initialization is done.
     * @param {string} lang (Optional) Language code to use for this instance.
     * If not specified, the language will be detected automatically: first checking the 'lang' query parameter in the URL,
     * then falling back to the browser's language settings.
     * Default: null.
     * @param {Translations | string} translations (Optional) Translations to use for this instance.
     * Can be an object, a JSON string or an URL used to fetch the translations from. Default: {}.
     * @return {Promise<I18n>} Promise that resolves to the I18n instance.
     */
    public static async asyncInit( lang: string | null = null, translations: Translations | string = {} ): Promise<I18n> {
        if ( !I18n._instance ) {
            I18n._instance = new I18n( lang );
            if ( translations ) {
                await I18n._instance.setTranslations( translations );
            }
        }
        return I18n._instance;
    }

    /**
     * @description {I18n} Initializes and gets the default i18n instance.
     * If no instance exists, a new one will be created with specified parameters or the default language I18n.DEFAULT_LANG.
     * @param {string} lang (Optional) Language code to use for this instance.
     * If not specified, the language will be detected automatically: first checking the 'lang' query parameter in the URL,
     * then falling back to the browser's language settings.
     * Default: null.
     * @param {Translations | string} translations (Optional) Translations to use for this instance.
     * Can be an object, a JSON string or an URL used to fetch the translations from. Default: {}.
     * @return {I18n} I18n instance.
     */
    public static init( lang: string | null = null, translations: Translations | string = {} ): I18n {
        if ( !I18n._instance ) {
            I18n._instance = new I18n( lang, translations );
        }
        return I18n._instance;
    }

    /**
     * @description {void} Set the default language code for new instances.
     * @param {string} lang New default language code to set.
     * @return {void}
     */
    public static setDefaultLanguage ( lang: string ): void {
        if ( lang && typeof lang === 'string' ) {
            I18n.DEFAULT_LANG = lang;
        }
    }

    /**
     * @description {I18n} Get the default i18n instance.
     * If no instance exists, a new one will be created with the default language I18n.DEFAULT_LANG.
     * @return {I18n} Default i18n instance.
     */
    public static get instance(): I18n {
        if ( !I18n._instance ) {
            I18n._instance = new I18n( I18n.DEFAULT_LANG );
        }
        return I18n._instance;
    }


    /**
     * PUBLIC METHODS
     */

    /**
     * @description {string} Translate a key to the current language.
     * If the key does not exist, the key itself will be returned.
     * @param {string} key Key to translate.
     * @return {string} Translated string.
     */
    public _t( key: string ): string {
        return this.t( key );
    }

    /**
     * @description Detects the user's preferred language.
     * It first checks for a 'lang' query parameter in the URL.
     * If not found, it falls back to the browser's language settings.
     * If the detected language is not supported, it defaults to the specified default language.
     * @return {string} Detected language code (e.g., 'en', 'it').
     */
    public detectLanguage () {
        let urlParams: URLSearchParams = new URLSearchParams( window.location.search );
        let lang: string = I18n.DEFAULT_LANG;
        if ( urlParams && urlParams.has( 'lang' ) ) {
            lang = ( urlParams.get( 'lang' ) as string ).toLowerCase();
        } else if ( window && window.navigator ) {
            lang = window.navigator.language || ( window.navigator as any ).userLanguage;
        }
        if ( lang.indexOf( '-' ) !== -1 ) {
            lang = lang.split( '-' )[0].toLowerCase();
        } else {
            lang = lang.toLowerCase();
        }
        return lang;
    };

    /**
     * @description {string} Get the current language code.
     * @return {string} Current language code.
     */
    public getLang(): string {
        return this.lang;
    }

    /**
     * @description {void} Set the current language code.
     * @param {string | null} lang New language code to set.
     * If null, the language will be detected automatically: first checking the 'lang' query parameter in the URL,
     * then falling back to the browser's language settings.
     * @return {void}
     */
    public setLang( lang: string | null ): void {
        if ( lang === null ) {
            lang = this.detectLanguage();
        }
        if ( !lang ) {
          return;
        }
        this.lang = lang;
    }

    /**
     * @description {boolean} Set the translations for this instance.
     * @param {{ [key: string]: { [key: string]: string } } | string} translations New translations to set.
     * Can be an object, a JSON string or an URL used to fetch the translations from.
     * @return {Promise<boolean>} Promise that resolves when translations are set, with a boolean indicating whether the translations were successfully set.
     */
    public async setTranslations( translations: { [key: string]: { [key: string]: string } } | string ): Promise<boolean> {
        if ( typeof translations === 'string' ) {
            if ( translations.startsWith( 'http' ) || translations.startsWith( '/' ) ) {
                await fetch( translations )
                    .then( response => response.json() )
                    .then( data => {
                        this.translations = data;
                        this.initialized = true;
                    } )
                    .catch( error => {
                        console.warn( '[I18n.setTranslations] Warning: failed to fetch translations from URL.', error );
                        this.translations = {};
                        this.initialized = false;
                    });
                return this.initialized;
            }
            try {
                this.translations = JSON.parse( translations );
                this.initialized = true;
                return this.initialized;
            } catch ( error: any ) {
                console.warn( '[I18n.setTranslations] Warning: failed to parse translations JSON string.', error );
                this.translations = {};
                this.initialized = false;
                return this.initialized;
            }
        } else {
            this.translations = translations;
            this.initialized = true;
            return this.initialized;
        }
    }

    /**
     * @description {string} Translate a key to the current language.
     * If the key does not exist, the key itself will be returned.
     * @param {string} key Key to translate.
     * @return {string} Translated string.
     */
    public t( key: string ): string {
        if ( this.translations.hasOwnProperty( this.lang ) ) {
            return this.translations[ this.lang ][ key ] || key;
        }
        if ( !this.translations.hasOwnProperty( I18n.DEFAULT_LANG ) ) {
            return key;
        }
        return this.translations[ I18n.DEFAULT_LANG ][ key ] || key;
    }

    /**
     * @description {string} Translate a key to the current language.
     * If the key does not exist, the key itself will be returned.
     * @param {string} key Key to translate.
     * @return {string} Translated string.
     */
    public translate( key: string ): string {
        return this.t( key );
    }
}
