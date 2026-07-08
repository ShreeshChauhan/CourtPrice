# Search Frontend

A minimal, single-page frontend with a centered search bar. The rest of the page is left empty on purpose, so you can build your own content around it.

## Files

- `index.html` — the entire app (HTML, CSS, and JS in one file)

## Getting started

No build tools or dependencies needed. Just open `index.html` in a browser, or serve it locally:

```bash
# Python
python3 -m http.server

# Node
npx serve
```

Then visit `http://localhost:8000` (or whatever port your server prints).

## Structure

- `.search-wrap` / `.search-bar` — the centered search input, styled as a rounded pill with a focus ring
- `#content-area` — an empty container below the search bar, ready for your own content
- The search form's submit handler currently just logs the query to the console — hook up your own search logic in the `<script>` block

## Customizing

Colors and spacing are controlled by CSS variables at the top of the `<style>` block:

```css
--bg           /* page background */
--text         /* main text color */
--muted        /* placeholder / icon color */
--border       /* default border color */
--border-focus /* border color when the search bar is focused */
```

Change these to restyle the whole page without touching the rest of the CSS.

## Next steps

- Wire up real search logic (API call, filtering, routing, etc.) in the `search-form` submit handler
- Add your own content inside or around `#content-area`
- Adjust `max-width` on `.search-wrap` if you want a wider or narrower search bar