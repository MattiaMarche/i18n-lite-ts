# I18n Lite

`i18n-lite-ts` is a TypeScript localization module created to add super simple translations to a web app.

It's framework agnostic, but super easy to use and tested with React.


## Quick start

You can use it in any web page:

### Install the module

```bash
npm install @mattiamarchesini/i18n-lite-ts
```

### Just use it

- Import the `I18n` class
- Instantiate it once, and use it all around the app


## Guide

### Translations

Create an object containing translations:

```ts
export const translations: Translations = { "en": { "hello": "Hello" }, "it": { "hello": "Ciao" } };
```

Or a JSON file (for example: `/data/translations.json`):

```json
{ "en": { "hello": "Hello" }, "it": { "hello": "Ciao" } }
```

### Initialization

Create a new instance:

```ts
export const i18n = new I18n(
    null,           // Current language as language code: keep it null to let the class detect it from a 'lang' query parameter (if present), or from the browser's settings
    translations   // Object containing translations
);
```

### Usage

Now you just need to invoke the translation method with your instance:

```ts
i18n.t( 'hello' );
```

For example in contexts or methods:

```ts
alert( i18n.t( 'hello' ) );
```

Or in JSX:

```jsx
<div>
    <h3>{ i18n.t( 'hello' ) }</h3>
</div>
```


## JSON fetching

Don't want to fetch JSONs by yourself? Just pass the JSON file's URL:

```ts
export const i18n = new I18n(
    null,                       // Current language as language code: keep it null to let the class detect it from a 'lang' query parameter (if present), or from the browser's settings
    '/data/translations.json'   // Path to the JSON file to fetch to get translations
);
```

Be aware that fetching takes some milliseconds, so your app could render faster and you'll not see translations.

To have full control of timings just instantiate it normally and await the translations after:

```ts
export const i18n = new I18n(
    null,   // Current language as language code: keep it null to let the class detect it from a 'lang' query parameter (if present), or from the browser's settings
    {}      // Ignore translations for now, will fetch them manually in the next lines
);

await i18n.setTranslations( '/data/translations.json' );

// Here you will be sure that translations are available
```

### React

If you use React:

- Instantiate I18n outside the components
- Await for translations just once when rendering the app

```tsx
export const i18n = new I18n(
    null,   // Current language as language code: keep it null to let the class detect it from a 'lang' query parameter (if present), or from the browser's settings
    {}      // Ignore translations for now, will fetch them manually in the next lines
);

const App: React.FC = () => {
    const [ loaded, setLoaded ] = useState<boolean>( false );

    const loadTranslations = async () => {
        await i18n.setTranslations( '/data/translations.json' );
        setLoaded( true );
    };

    useEffect( () => {
        loadTranslations();
    }, [] );

    if ( !loaded ) {
        return <div>
            <p>...</p>
        </div>;
    }

    return <div>
        <h3>{ i18n.t( 'hello' ) }</h3>
    </div>;
};
```

## Default language

Need to change the default language used for fall backs?
Just call:

```ts
I18n.setDefaultLanguage( 'en' );
```


## Demo - Quick start

This repo comes with a fully working demo in `/demo/index.html`, to see it run:

```bash
npm install
npm run demo
```

And open [http://127.0.0.1:5173/demo/](http://127.0.0.1:5173/demo/) in your browser.


## Author

- Name: Mattia
- Surname: Marchesini
- Email: [info@mattiamarchesini.com](info@mattiamarchesini.com)
- Country: Italy


## License

This project is licensed under the **Attribution License (MIT-Style)**.
You are free to use and modify the code, would be really appreciated if you give credit to the original author.

© 2025 [Mattia Marchesini](https://github.com/MattiaMarche)
