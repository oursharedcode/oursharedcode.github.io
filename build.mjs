/**
 * Build the story page in six languages.
 *
 *   node build.mjs
 *
 * Emits, from content.mjs:
 *
 *   free-english-books/index.html          canonical English
 *   free-english-books/en/index.html       English at the /en postfix
 *   free-english-books/{hi,vi,pt-br,zh,ar}/index.html
 *
 * No dependencies and no install step: GitHub Pages serves whatever is
 * committed here, so the generated HTML is committed alongside this script.
 * Run it and commit the diff whenever content.mjs changes.
 *
 * Why generate at all, when the repo has three static files and no toolchain:
 * the six pages differ only in their text. Hand-maintaining six copies of the
 * stylesheet, the hreflang block and the two payment buttons is how the
 * Arabic page ends up a version behind the English one, in a way nobody who
 * doesn't read Arabic would notice.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASE_URL, BCP47, BMC_URL, BOOKS_URL, CONTENT, KOFI_URL, LOCALES, RTL } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, 'free-english-books');

// The canonical English URL is the bare directory, not /en. It is the URL that
// has been published and linked since 2026-08-13, it is the one the UDRP
// memorandum cites, and rehoming a cited URL to gain a two-letter suffix buys
// nothing. /en exists because the localised pages need a stable "English"
// target that sits in the same shape as the others; it serves the same page
// and points its canonical here, so search engines index one English page.
const canonicalFor = (locale) => (locale === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${locale}/`);

// hreflang, on every page, listing every page. x-default is the canonical
// English URL rather than /en, for the same reason.
function alternates(locale) {
  const rows = LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${BCP47[l]}" href="${canonicalFor(l)}">`,
  );
  rows.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
  return rows.map((r) => `${r}\n`).join('');
}

/*
  The "English" button, on the five translated pages only.

  It is deliberately not styled like the two payment buttons: those are the
  providers' own colours and they are the only things on the page anyone is
  being invited to press. A language control that competed with them would
  read as a third offer. This one is an outlined pill, quiet, above the
  heading, where a reader who cannot read the page will look first.

  The label stays the English word "English" in all five. Localising it to
  "अंग्रेज़ी" would be correct and useless: the person who needs this button is
  the person who cannot read the page it sits on.
*/
function englishButton(c) {
  return `<p class="lang">
  <a class="lang-btn" href="${BASE_URL}/en/" hreflang="en" lang="en" dir="ltr">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/>
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" stroke="currentColor" stroke-width="1.7"/>
    </svg>
    ${c.englishLabel}
  </a>
</p>

`;
}

// On the two English pages, the same slot carries the other five languages, so
// the switch works in both directions rather than only inwards.
function languageRow(current) {
  const links = LOCALES.filter((l) => l !== 'en' && l !== current)
    .map(
      (l) =>
        `<a class="lang-btn" href="${canonicalFor(l)}" hreflang="${BCP47[l]}" lang="${BCP47[l]}"` +
        `${RTL.includes(l) ? ' dir="rtl"' : ''}>${CONTENT[l].nativeName}</a>`,
    )
    .join('\n  ');
  return `<p class="lang lang-row">
  ${links}
</p>

`;
}

const STYLE = `<style>
  :root {
    /* This page defines its own dark palette below, so tell the browser to
       stop auto-inverting. Without it, Chrome's Android "auto dark theme"
       rewrites the brand buttons — the yellow one came out white-on-yellow,
       which is both off-brand and hard to read. */
    color-scheme: light dark;
    --ink: #1e2430;
    --muted: #5a6270;
    --bg: #fdfcfa;
    --card: #fff;
    --rule: #e6e2da;
    --link: #0a5ea6;
    --kofi: #ff5e5b;
    --bmc: #ffdd00;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ink: #e8e6e1; --muted: #a4a9b3; --bg: #15171c;
      --card: #1e2128; --rule: #2e323b; --link: #7ab6f0;
    }
  }
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    max-width: 40rem; margin: 0 auto; padding: 3rem 1.25rem 4rem;
    line-height: 1.65; color: var(--ink); background: var(--bg);
    -webkit-text-size-adjust: 100%;
  }
  h1 { font-size: clamp(1.6rem, 5vw, 2.1rem); line-height: 1.2; margin: 0 0 1.75rem; letter-spacing: -.01em; }
  p { margin: 0 0 1.25rem; }
  a { color: var(--link); }
  .lede { font-size: 1.05rem; }

  /* ---- Language switch ---------------------------------------------------
     Above the heading, quiet, and never mistaken for the payment pair below:
     outlined rather than filled, no colour of its own, no sheen. It carries
     the page's only inward-pointing decision, so it has to be findable
     without being loud. */
  .lang { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0 0 1.5rem; }
  .lang-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    min-height: 2.5rem; padding: .4rem 1rem;
    border: 1px solid var(--rule); border-radius: 999px;
    font: 500 .95rem/1.2 inherit; text-decoration: none; color: var(--ink);
    transition: border-color .16s ease, color .16s ease;
  }
  .lang-btn:hover, .lang-btn:focus-visible { border-color: var(--link); color: var(--link); }
  .lang-btn:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
  .lang-row .lang-btn { font-size: .9rem; }

  /* ---- Support buttons ---------------------------------------------------
     Big, obvious and pleasant to hit: 56px tall, full width on a phone, side
     by side once there is room. Each carries its provider's own colour and an
     inline SVG cup, so the button looks like the page it opens and there is
     no external request to make it work.
     No countdowns, no fake scarcity, no invented totals: the paragraph above
     promises the tip is voluntary and unnecessary, and a button that argued
     otherwise would contradict it on the same screen. */
  .support { margin: 2.25rem 0 1rem; display: flex; flex-wrap: wrap; gap: .85rem; }
  .btn {
    flex: 1 1 15rem;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    min-height: 3.5rem; padding: .9rem 1.4rem;
    border-radius: 999px; border: 0;
    font: 600 1.05rem/1.2 inherit; text-decoration: none; text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,.10), 0 8px 20px -6px rgba(0,0,0,.22);
    transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
    position: relative; overflow: hidden;
  }
  .btn svg { flex: none; }
  .btn-kofi { background: var(--kofi); color: #fff; }
  .btn-bmc  { background: var(--bmc);  color: #10121a; }
  .btn:hover, .btn:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,.14), 0 14px 28px -8px rgba(0,0,0,.3);
    filter: saturate(1.08);
  }
  .btn:active { transform: translateY(0); }
  .btn:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
  /* A slow sheen that crosses the button, so the pair reads as tappable at a
     glance on a page that is otherwise plain text. */
  .btn::after {
    content: ""; position: absolute; inset: 0 auto 0 -60%;
    width: 55%; transform: skewX(-20deg);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
    animation: sheen 4.5s ease-in-out infinite;
  }
  .btn-bmc::after { background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent); }
  @keyframes sheen {
    0%, 62% { left: -60%; }
    92%, 100% { left: 115%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .btn, .btn::after { transition: none; animation: none; }
    .btn::after { display: none; }
  }
  .support-note { margin: 0 0 2.5rem; font-size: .92rem; color: var(--muted); }

  .note { margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid var(--rule); font-size: .92rem; color: var(--muted); }
  .note a { color: var(--link); }
</style>`;

const KOFI_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h12a1 1 0 0 1 1 1v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V6a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".95"/>
      <path d="M17 7h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M9.6 8.6c.7-.8 1.9-.5 2.1.5.2-1 1.4-1.3 2.1-.5.6.7.3 1.7-.6 2.4l-1.5 1.2-1.5-1.2c-.9-.7-1.2-1.7-.6-2.4Z" fill="#ff5e5b"/>
      <path d="M4 20h13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;

const BMC_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z" fill="currentColor"/>
      <path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M8 5.2c0-.8 1-.9 1-1.7M11 5.2c0-.8 1-.9 1-1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M4 20.5h13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;

function page(locale) {
  const c = CONTENT[locale];
  const rtl = RTL.includes(locale);
  const isEnglish = locale === 'en';

  // In RTL the "back" arrow points right, because that is the direction the
  // reader came from. A hard-coded ← would send them the wrong way.
  const backArrow = rtl ? '&rarr;' : '&larr;';

  return `<!doctype html>
<html lang="${BCP47[locale]}"${rtl ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${c.description}">
<!--
  GENERATED FILE — edit content.mjs and run \`node build.mjs\`, not this.

  Indexable since 2026-08-13. This carried \`noindex\` from the months when it
  was a bare support stub: two payment buttons under a title promising a story
  it did not tell, which is a page worth keeping out of search results. The
  story is now here, so the reason is gone.

  It was never a privacy control either — the page is linked by name from the
  homepage of freeieltsbooks.net, so \`noindex\` hid it from readers looking for
  it and from nobody else.

  The title deliberately carries no trademark and targets no branded query, so
  this page ranks on its own account and never competes for the mark. If that
  ever changes, the \`noindex\` comes back with it.
-->
<link rel="canonical" href="${canonicalFor(locale)}">
${alternates(locale)}${STYLE}
</head>
<body>
${isEnglish ? languageRow(locale) : englishButton(c)}<h1>${c.title}</h1>

<p class="lede">
  ${c.lede}
</p>

<p>
  ${c.affiliation}
</p>

<!--
  The story the title promises. Added 2026-08-13 from the owner's own account;
  translated into the other five locales 2026-08-14.

  Until then this page was titled "From Band 5.5 to Band 8 — A True Story" over
  text that stated the band 8 result and told no story. A title is a promise,
  and that one went unkept for months.

  Everything here is the owner's: the self-talk, "a bad thing" against "an
  economic disaster", the collocations notebook, recording their own voice,
  copying rhythm from news and podcasts, nineteen months. Nothing was added to
  round it out — no tutor, no course, no method they did not mention — because
  an invented detail on this page is the one that would matter. The five
  translations carry exactly those facts and add none: a translation is the
  easiest place in this project for a detail to appear that the owner never
  said, and the hardest place for him to catch it.

  It also promises the reader nothing. Book 1's own front matter says no book
  can promise a band, and a personal account that ends "so you will get an 8"
  would contradict the books it links to.
-->
${c.story.map((p) => `<p>\n  ${p}\n</p>`).join('\n\n')}

<!--
  This sentence is the canonical wording, and twenty-five other published
  copies say the same thing: \`disclaimerP5\` on freeieltsbooks.net in six
  locales, the IMPRINT map in books/build/build.mjs printed in all thirteen
  book editions, and the seven files of this page in six languages.

  It had been the other way around for a few hours on 2026-08-13. Nineteen of
  those copies said "hosting and domains' costs only" and this page named a
  third category, so one of the two had to move; the owner settled it in
  favour of the fuller list, which is the honest one — translation is a real
  recurring cost of producing the editions, and a notice that under-describes
  where the money goes is no better than one that over-describes it.

  The English is identical everywhere, down to the comma list. The five
  translations take their noun list verbatim from that locale's own
  \`disclaimerP5\`, so a reader who compares this page with the imprint of the
  book they just downloaded finds no daylight in their own language either.
  Each carries the same three categories with its own conjunction, because an
  asyndetic list reads as clipped rather than plain outside English.

  One deliberate asymmetry, recorded rather than smoothed over: the five
  translations keep the word "only" (केवल, chỉ, apenas, 仅, فقط) and the
  English does not. The English sentence is the owner's own and makes the
  restriction with "nothing is sold" instead; the translations take the clause
  from their locale's \`disclaimerP5\`, where "only" is what the memo's
  noncommercial argument rests on at ¶16. Dropping it to match the English
  would quietly widen the claim in five languages to gain a symmetry no reader
  can see, since nobody reads two of these pages at once.

  So: twenty-six copies, one claim. If the cost basis ever genuinely changes,
  they all move together, or none of them do.
-->
<p>
  ${c.tip}
</p>

<div class="support">
  <a class="btn btn-kofi" href="${KOFI_URL}" rel="noopener">
    ${KOFI_SVG}
    ${c.kofi}
  </a>
  <a class="btn btn-bmc" href="${BMC_URL}" rel="noopener">
    ${BMC_SVG}
    ${c.bmc}
  </a>
</div>

<p class="support-note">${c.tipNote}</p>

<p class="note">
  ${backArrow} <a href="${BOOKS_URL}">${c.back}</a>
</p>
</body>
</html>
`;
}

let written = 0;
for (const locale of LOCALES) {
  // English is served twice: at the canonical bare directory and at /en.
  const dirs = locale === 'en' ? [ROOT, join(ROOT, 'en')] : [join(ROOT, locale)];
  for (const dir of dirs) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), page(locale), 'utf8');
    written += 1;
  }
}

console.log(`Built ${written} pages in ${LOCALES.length} languages.`);
