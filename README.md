# Дитячі ігри

Free browser games for kids. No ads, no sign-up. Live at
https://artem-vovchenko01.github.io/kids-games/

Each game is a static page in `games/<name>/index.html`. GitHub Pages serves
the files; the game runs in the player's browser.

## Languages

`lang.js` holds the language list (Ukrainian, English, Polish, Russian) and
the picker. The first visit picks the language from the device time zone,
then the browser language, then English. A choice in the picker is saved in
the browser and carries across pages. `?lang=pl` forces one.

A page marks text with `data-i18n="key"` (or `data-i18n-attr="attr:key"`),
adds `<select class="lang-pick">`, and calls `I18N.init(texts, onChange)` with
`texts = {uk: {...}, en: {...}, pl: {...}, ru: {...}}`. Keys `title` and
`description` also set the page title and meta description.

## Add a game

1. Put the game in `games/<name>/index.html`. Include `../../lang.js`, give
   the page a `← All games` link to `../../`, a canonical URL and the
   `hreflang` links (copy them from Koleso), and texts in all four languages.
2. Copy one `<li>` card in `index.html`, change its link, picture and keys,
   and add the card texts to the four languages there.
3. Add the game URL to `sitemap.xml`.
4. Check it on a phone: text sizes in `rem`, touch controls under
   `@media (pointer:coarse)`.

## Search engines

`google76afe9976e66fe65.html` proves site ownership to Google Search Console.
Keep it: removing it unverifies the site.
