/**
 * Build the story page in eleven languages.
 *
 *   node build.mjs
 *
 * Emits, from content.mjs:
 *
 *   free-english-books/index.html          canonical English
 *   free-english-books/en/index.html       English at the /en postfix
 *   free-english-books/{hi,vi,pt-br,zh,ar,zh-hant,pl,es,bn,ur}/index.html
 *
 * No install step: GitHub Pages serves whatever is committed here, so the
 * generated HTML is committed alongside this script, and so are the two small
 * libraries lightning.mjs uses to draw the Lightning QR code and check it
 * (_vendor/, see its README). Run it and commit the diff whenever content.mjs
 * changes.
 *
 * Why generate at all, when the repo has three static files and no toolchain:
 * the eleven pages differ only in their text. Hand-maintaining eleven copies
 * of the stylesheet, the hreflang block, the four gift buttons and their two
 * cards is how the Arabic page ends up a version behind the English one, in a
 * way nobody who doesn't read Arabic would notice.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BASE_URL, BCP47, BMC_URL, BOOKS_URL, CONTENT, KOFI_URL, LIGHTNING_ADDRESS, LIGHTNING_LABEL, LOCALES, PAYID, RTL,
} from './content.mjs';
import { LIGHTNING_URI, qrSvg } from './lightning.mjs';

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
  The "English" button, on the ten translated pages only.

  It is deliberately not styled like the four gift buttons: those are filled,
  each in its own colour, and they are the only things on the page anyone is
  being invited to press. A language control that competed with them would
  read as a fifth offer. This one is an outlined pill, quiet, above the
  heading, where a reader who cannot read the page will look first.

  The label stays the English word "English" in all ten. Localising it to
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

// On the two English pages, the same slot carries the other ten languages, so
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
    /* Lightning is Bitcoin orange, as a gradient, with near-black text on it:
       8:1, where white would be 2.3:1. PayID has no colour a reader would
       know, so it gets a plain bank navy. --ok is the "Copied" green. */
    --ln-a: #ffc663; --ln-b: #f7931a; --ln-c: #e0700b; --ln-ink: #1b1204;
    --payid: #1f3a5f;
    --ok: #1d7a46;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ink: #e8e6e1; --muted: #a4a9b3; --bg: #15171c;
      --card: #1e2128; --rule: #2e323b; --link: #7ab6f0;
      --payid: #2d5a8c; --ok: #6fd39a;
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
     Above the heading, quiet, and never mistaken for the gift buttons below:
     outlined rather than filled, no colour of its own, no sheen. It carries
     the page's only inward-pointing decision, so it has to be findable
     without being loud. */
  .lang { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0 0 1.5rem; }
  .lang-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    min-height: 2.5rem; padding: .4rem 1rem;
    border: 1px solid var(--rule); border-radius: 999px;
    text-decoration: none; color: var(--ink);
    transition: border-color .16s ease, color .16s ease;
  }
  .lang-btn:hover, .lang-btn:focus-visible { border-color: var(--link); color: var(--link); }
  .lang-btn:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
  .lang-row .lang-btn { font-size: .9rem; }

  /* ---- Gift buttons ------------------------------------------------------
     Big, obvious and pleasant to hit: at least 56px tall, one column on a
     phone, two by two once there is room. grid-auto-rows: 1fr makes every
     row as tall as the tallest button, so a label that wraps in one language
     grows all four together and they stay the same size.
     The order and the look are the owner's (D9, 2026-10-01): Lightning,
     PayID, Ko-fi, Buy Me a Coffee, all the same size, Lightning the most
     inviting. Ko-fi and BMC carry their providers' own colours and an inline
     SVG cup, so each looks like the page it opens. Lightning and PayID are
     networks rather than brands, so they get a generic bolt and bank, and
     open a card on this page instead (below). Every icon is inline, so no
     button makes an external request to draw itself.
     No countdowns, no fake scarcity, no invented totals: the paragraph above
     promises the tip is voluntary and unnecessary, and a button that argued
     otherwise would contradict it on the same screen. */
  .support {
    margin: 2.25rem 0 1rem;
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: .85rem;
  }
  @media (max-width: 34rem) { .support { grid-template-columns: minmax(0, 1fr); } }
  /* The top copy opens the page rather than following the story, so it gets
     no leading margin and a shorter shadow — enough to read as a set of
     buttons, not enough to compete with the heading that follows it. */
  .support-top { margin: 0 0 .5rem; }
  .btn {
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    min-height: 3.5rem; padding: .9rem 1.4rem;
    border-radius: 999px; border: 0;
    text-decoration: none; text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,.10), 0 8px 20px -6px rgba(0,0,0,.22);
    transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
    position: relative; overflow: hidden;
  }
  .btn svg { flex: none; }
  /* Lightning and PayID have a second, smaller line under the name. Where it
     runs to two lines (vi, pt-br, es), balance keeps a lone word off the
     second one. */
  .btn-two { display: flex; flex-direction: column; align-items: flex-start; text-align: start; line-height: 1.3; }
  .btn-two small { font-size: .82rem; opacity: .88; text-wrap: balance; }
  .btn-kofi { background: var(--kofi); color: #fff; }
  .btn-bmc  { background: var(--bmc);  color: #10121a; }
  .btn-payid { background: var(--payid); color: #fff; }
  /* Lightning, the one meant to be pressed first: a warm glow that breathes
     and a brighter sheen than the other three. It stands out by colour and
     light, not by size. On hover the glow keeps running in place of the lift
     shadow the others get. */
  .btn-ln {
    color: var(--ln-ink);
    background: linear-gradient(135deg, var(--ln-a) 0%, var(--ln-b) 52%, var(--ln-c) 100%);
    box-shadow: 0 0 0 1px rgba(224,112,11,.35), 0 8px 22px -6px rgba(247,147,26,.6), 0 2px 4px rgba(0,0,0,.10);
    animation: ln-glow 2.8s ease-in-out infinite;
  }
  @keyframes ln-glow {
    0%, 100% { box-shadow: 0 0 0 1px rgba(224,112,11,.35), 0 8px 22px -6px rgba(247,147,26,.55), 0 2px 4px rgba(0,0,0,.10); }
    50% { box-shadow: 0 0 0 1px rgba(224,112,11,.55), 0 10px 30px -4px rgba(247,147,26,.95), 0 0 20px 2px rgba(255,190,90,.45), 0 2px 4px rgba(0,0,0,.10); }
  }
  .btn:hover, .btn:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,.14), 0 14px 28px -8px rgba(0,0,0,.3);
    filter: saturate(1.08);
  }
  .btn:active { transform: translateY(0); }
  .btn:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
  /* A slow sheen that crosses the button, so the set reads as tappable at a
     glance on a page that is otherwise plain text. */
  .btn::after {
    content: ""; position: absolute; inset: 0 auto 0 -60%;
    width: 55%; transform: skewX(-20deg);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
    animation: sheen 4.5s ease-in-out infinite;
  }
  .btn-bmc::after, .btn-ln::after { background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent); }
  .btn-payid::after { background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent); }
  @keyframes sheen {
    0%, 62% { left: -60%; }
    92%, 100% { left: 115%; }
  }
  .support-note { margin: 0 0 2.5rem; font-size: .92rem; color: var(--muted); }

  /* ---- The Lightning and PayID cards -------------------------------------
     Pressing either button opens its card over the page: centred on a
     computer, a sheet rising from the bottom on a phone (D9, the owner's
     choice). It is the browser's own popover, so Esc, the close button and a
     tap outside all close it.
     The script adds .pop to <html> once it knows the browser has popovers,
     and every pop-up rule hangs off it, so nothing floats unless it can also
     be closed. Without it the card is plain content after the lower buttons:
     - in a browser without popovers (before Chrome 114, Safari 17 or
       Firefox 125) both cards always show there, and the buttons are links
       that jump to them;
     - with scripts off, a browser with popovers keeps them hidden until a
       button's link names one (:target), then shows that one there. */
  .gift-pop {
    position: static; width: auto; height: auto; overflow: visible;
    margin: 0 0 1.25rem; padding: 1.1rem 1.25rem 1.25rem;
    background: var(--card); color: var(--ink);
    border: 1px solid var(--rule); border-radius: 20px;
    box-shadow: 0 10px 22px -14px rgba(0,0,0,.35);
  }
  .gift-ln { border-top: 4px solid var(--ln-b); }
  .gift-payid { border-top: 4px solid var(--payid); }
  html:not(.pop) .gift-pop:target { display: block; }
  .pop .gift-pop {
    position: fixed; inset: 0; margin: auto;
    width: min(23.5rem, calc(100vw - 2rem)); height: fit-content; max-height: calc(100dvh - 2rem);
    overflow: auto; overscroll-behavior: contain; border: 0;
    box-shadow: 0 30px 80px -20px rgba(0,0,0,.55), 0 0 0 1px var(--rule);
    opacity: 0; transform: translateY(10px) scale(.98);
    transition: opacity .2s ease, transform .2s ease, overlay .2s allow-discrete, display .2s allow-discrete;
  }
  .pop .gift-pop:popover-open { opacity: 1; transform: none; }
  @starting-style { .pop .gift-pop:popover-open { opacity: 0; transform: translateY(10px) scale(.98); } }
  .gift-pop::backdrop { background: rgba(10,12,18,.5); }
  @media (max-width: 34rem) {
    .pop .gift-pop {
      inset: auto 0 0 0; margin: 0; width: 100%; max-width: 100%; max-height: 94dvh;
      border-radius: 22px 22px 0 0;
      padding-bottom: calc(1.25rem + env(safe-area-inset-bottom));
      transform: translateY(100%);
    }
    .pop .gift-pop::before {
      content: ""; display: block; width: 2.5rem; height: 4px; border-radius: 4px;
      background: var(--rule); margin: -.35rem auto .75rem;
    }
    @starting-style { .pop .gift-pop:popover-open { transform: translateY(100%); } }
  }

  .gc-head { display: flex; align-items: center; gap: .65rem; margin: 0 0 .2rem; }
  .gc-icon { flex: none; width: 2.3rem; height: 2.3rem; border-radius: 50%; display: grid; place-items: center; }
  .gift-ln .gc-icon {
    background: linear-gradient(135deg, var(--ln-a), var(--ln-b) 55%, var(--ln-c)); color: var(--ln-ink);
    box-shadow: 0 4px 14px -4px rgba(247,147,26,.8);
  }
  .gift-payid .gc-icon { background: var(--payid); color: #fff; }
  .gc-title { flex: 1; font-size: 1.15rem; line-height: 1.25; margin: 0; }
  .gc-close {
    flex: none; width: 2.4rem; height: 2.4rem; border-radius: 50%; display: none; place-items: center;
    border: 1px solid var(--rule); background: transparent; color: var(--muted); cursor: pointer; padding: 0; font: inherit;
  }
  .pop .gc-close { display: grid; }
  .gc-close:hover { color: var(--ink); border-color: var(--muted); }
  .gc-close:focus-visible, .gc-btn:focus-visible { outline: 3px solid var(--link); outline-offset: 2px; }
  .gc-sub { margin: 0 0 1rem; margin-inline-start: 2.95rem; color: var(--muted); font-size: .95rem; }
  /* The code keeps its own white ground in dark mode: scanners want dark on
     light, with a quiet margin, which the SVG draws in. */
  .gc-qr {
    width: min(13rem, 100%); margin: 0 auto .9rem; border-radius: 14px; overflow: hidden; background: #fff;
    box-shadow: 0 0 0 1px var(--rule), 0 10px 26px -14px rgba(0,0,0,.35);
  }
  .qr { display: block; width: 100%; height: auto; }
  /* On a 320px phone the Lightning address is wider than the card: it breaks
     after the @ (a <wbr> there), and only mid-word if even half won't fit. */
  .gc-addr { margin: 0 0 1rem; text-align: center; }
  .gc-addr code {
    display: inline-block; max-width: 100%; padding: .45rem .75rem; border-radius: 10px;
    font: 500 .95rem/1.4 ui-monospace, "Cascadia Mono", Consolas, monospace; overflow-wrap: anywhere;
    background: var(--bg); border: 1px solid var(--rule); -webkit-user-select: all; user-select: all;
  }
  .gc-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr)); gap: .6rem; margin: 0 0 .9rem; }
  /* The pop-up is too narrow for two buttons side by side: in 8 of the 11
     languages "Open in wallet" or "Copy address" broke onto two lines, and
     in all 11 the "Selected: copy it" fallback did, so the card jumped. In
     the pop-up they stack; the wider in-place card keeps the pair. */
  .pop .gc-actions { grid-template-columns: minmax(0, 1fr); }
  .gc-btn {
    font: inherit; font-size: .98rem; font-weight: 600; line-height: 1.2;
    min-height: 3rem; padding: .7rem 1rem; border-radius: 999px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
    border: 1px solid var(--rule); background: transparent; color: var(--ink); text-decoration: none;
    transition: filter .16s ease, transform .16s ease;
  }
  .gc-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .gc-btn svg { flex: none; }
  .gift-ln .gc-primary {
    border: 0; color: var(--ln-ink);
    background: linear-gradient(135deg, var(--ln-a), var(--ln-b) 55%, var(--ln-c));
    box-shadow: 0 6px 18px -8px rgba(247,147,26,.9);
  }
  .gift-payid .gc-primary { border: 0; color: #fff; background: var(--payid); }
  .gc-btn.is-done { border-color: var(--ok); color: var(--ok); }
  .gc-primary.is-done { color: #fff; background: #1d7a46; }
  .gc-help { margin: 0; font-size: .88rem; line-height: 1.5; color: var(--muted); }

  @media (prefers-reduced-motion: reduce) {
    .btn, .btn::after, .gc-btn, .pop .gift-pop { transition: none; animation: none; }
    .btn::after { display: none; }
  }

  .note { margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid var(--rule); font-size: .92rem; color: var(--muted); }
  .note a { color: var(--link); }
</style>`;

// Without scripts the copy buttons cannot copy, so they are hidden and the
// address stays on the card as text that selects in one tap. "Open in wallet"
// is an ordinary link and stays.
const NOSCRIPT = '<noscript><style>[data-copy], .gift-payid .gc-actions { display: none; }</style></noscript>';

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

// Generic marks for the two networks, drawn rather than taken from any
// provider: a bolt for Lightning (not the ⚡ emoji, which is yellow on Windows
// and Android and vanishes against orange) and a bank for PayID.
const BOLT_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.4 2.4 4.7 13.3a.7.7 0 0 0 .55 1.13h5.2l-1.5 6.9c-.15.7.72 1.1 1.17.54l8.7-10.9a.7.7 0 0 0-.55-1.13h-5.2l1.5-6.9c.15-.7-.72-1.1-1.17-.54Z" fill="currentColor"/>
    </svg>`;

const BANK_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 9.2 12 4.2l8.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 11v6M10 11v6M14 11v6M18 11v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M3.5 20h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;

// The cards' small icons: copy, wallet, close.
const COPY_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 8.5V6.5A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2" stroke="currentColor" stroke-width="1.8"/></svg>`;
const WALLET_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 9.5h16" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="14.5" r="1.4" fill="currentColor"/></svg>`;
const CLOSE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

/*
  The four gift buttons, factored out so the top and bottom copies cannot
  drift — one definition, rendered twice. Requested 2026-08-16 for the
  Ko-fi/BMC pair: a reader who lands on this page from a shared link or a
  screenshot may never scroll to the original pair after the story, so the
  same choice is offered before it too. Lightning and PayID joined both
  copies on 2026-10-01 (D9), first and second.
  `topCopy` trims the surrounding note to one line and skips the top margin a
  mid-page block needs, since here it opens the page rather than following a
  paragraph.

  Ko-fi and BMC link to the providers' pages. Lightning and PayID link to
  their cards (#lightning, #payid), which the script turns into pop-ups. For
  all four, the money moves on the provider's site or in the reader's own
  wallet or bank app, never on this page, which is what the note under the
  buttons tells the reader.
*/
function supportBlock(c, { topCopy = false } = {}) {
  return `<div class="support${topCopy ? ' support-top' : ''}">
  <a class="btn btn-ln" href="#lightning" data-gift>
    ${BOLT_SVG}
    <span class="btn-two"><span>${LIGHTNING_LABEL}</span><small>${c.lnSub}</small></span>
  </a>
  <a class="btn btn-payid" href="#payid" data-gift>
    ${BANK_SVG}
    <span class="btn-two"><span>${c.payid}</span><small>${c.payidSub}</small></span>
  </a>
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

`;
}

/*
  The Lightning and PayID cards: one of each per page, after the lower
  buttons, and the top and bottom buttons open the same one. Everything on
  them is drawn here and nothing is fetched: the QR code is an inline SVG made
  when this script runs (lightning.mjs), and the script at the foot of the
  page only opens the cards and copies.

  The Lightning address shows as text under the code, because a reader on a
  phone cannot scan their own screen: "Open in wallet" hands the LNURL to the
  phone's Lightning wallet, and the copy button serves every other wallet.
  PayID gets a copy button and no code (D9): it is pasted into a bank app's
  pay-a-PayID screen. The card titles are the button names, and the two
  addresses are the same on every page.
*/
function giftCards(c) {
  return `<section popover id="lightning" class="gift-pop gift-ln" aria-labelledby="lightning-h">
  <div class="gc-head">
    <span class="gc-icon">${BOLT_SVG}</span>
    <h2 class="gc-title" id="lightning-h">${LIGHTNING_LABEL}</h2>
    <button type="button" class="gc-close" popovertarget="lightning" popovertargetaction="hide" aria-label="${c.close}">${CLOSE_SVG}</button>
  </div>
  <p class="gc-sub">${c.lnCardSub}</p>
  <div class="gc-qr">${qrSvg(c.qr)}</div>
  <p class="gc-addr"><code dir="ltr">${LIGHTNING_ADDRESS.replace('@', '@<wbr>')}</code></p>
  <div class="gc-actions">
    <a class="gc-btn gc-primary" href="${LIGHTNING_URI}">${WALLET_SVG}${c.lnOpen}</a>
    <button type="button" class="gc-btn" data-copy="${LIGHTNING_ADDRESS}" data-done="${c.copied}" data-selected="${c.selected}">${COPY_SVG}<span class="lbl" aria-live="polite">${c.lnCopy}</span></button>
  </div>
  <p class="gc-help">${c.lnHelp}</p>
</section>

<section popover id="payid" class="gift-pop gift-payid" aria-labelledby="payid-h">
  <div class="gc-head">
    <span class="gc-icon">${BANK_SVG}</span>
    <h2 class="gc-title" id="payid-h">${c.payid}</h2>
    <button type="button" class="gc-close" popovertarget="payid" popovertargetaction="hide" aria-label="${c.close}">${CLOSE_SVG}</button>
  </div>
  <p class="gc-sub">${c.payidCardSub}</p>
  <p class="gc-addr"><code dir="ltr">${PAYID.replace('@', '@<wbr>')}</code></p>
  <div class="gc-actions">
    <button type="button" class="gc-btn gc-primary" data-copy="${PAYID}" data-done="${c.copied}" data-selected="${c.selected}">${COPY_SVG}<span class="lbl" aria-live="polite">${c.payidCopy}</span></button>
  </div>
  <p class="gc-help">${c.payidHelp}</p>
</section>

`;
}

/*
  Opens the cards and runs the copy buttons; the page reads fully without it.
  Only once it knows the browser has popovers does it add .pop to <html> and
  take over the Lightning and PayID links, so a failure anywhere leaves them
  as the plain links to the cards that they are in the markup.
  A copy that the browser refuses (no clipboard access) selects the address
  instead, and the button says so.
*/
const SCRIPT = `<script>
(() => {
  const root = document.documentElement;
  const canPop = typeof root.showPopover === 'function';
  let opener = null;

  function open(card, from) {
    opener = from;
    card.showPopover();
    card.querySelector('.gc-primary').focus({ preventScroll: true });
  }

  if (canPop) {
    root.classList.add('pop');
    for (const a of document.querySelectorAll('a[data-gift]')) a.setAttribute('aria-haspopup', 'dialog');
    for (const card of document.querySelectorAll('.gift-pop')) {
      card.setAttribute('role', 'dialog');
      // Back to the button that opened it, so a keyboard reader carries on
      // from where they were.
      card.addEventListener('toggle', (e) => {
        if (e.newState === 'closed' && opener && !document.querySelector('.gift-pop:popover-open')) {
          opener.focus({ preventScroll: true });
          opener = null;
        }
      });
    }
  }

  async function copy(btn) {
    const lbl = btn.querySelector('.lbl');
    if (!btn.dataset.label) btn.dataset.label = lbl.textContent;
    let msg = btn.dataset.done;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(btn.closest('.gift-pop').querySelector('.gc-addr code'));
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      msg = btn.dataset.selected;
    }
    lbl.textContent = msg;
    btn.classList.add('is-done');
    clearTimeout(btn.doneTimer);
    btn.doneTimer = setTimeout(() => {
      lbl.textContent = btn.dataset.label;
      btn.classList.remove('is-done');
    }, 2200);
  }

  document.addEventListener('click', (e) => {
    const gift = e.target.closest('a[data-gift]');
    if (gift && canPop) {
      e.preventDefault();
      open(document.getElementById(gift.hash.slice(1)), gift);
      return;
    }
    const btn = e.target.closest('[data-copy]');
    if (btn) {
      copy(btn);
      return;
    }
    // A click on the dimmed page around an open card lands on the card
    // itself; close it, as a tap outside should.
    const card = e.target.closest('.gift-pop');
    if (card && e.target === card && card.matches(':popover-open')) {
      const r = card.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) card.hidePopover();
    }
  });

  // A link that names a card (…/#lightning, …/#payid) opens it.
  const named = canPop && /^#(lightning|payid)$/.test(location.hash) && document.getElementById(location.hash.slice(1));
  if (named) open(named, null);
})();
</script>`;

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
${NOSCRIPT}
</head>
<body>
${isEnglish ? languageRow(locale) : englishButton(c)}<!--
  Duplicate of the gift buttons below, added 2026-08-16 at the top of the
  page on request. Same buttons, same links, same order — a reader who never
  reaches the bottom (a shared screenshot, a slow connection, a link that
  only shows the fold) still sees the choice once. The lower set, after the
  story, is the one a reader who came for the account reaches after reading
  it, not instead of it. Two buttons until 2026-10-01, four since (D9):
  Lightning and PayID joined Ko-fi and Buy Me a Coffee in both places.
-->
${supportBlock(c, { topCopy: true })}<h1>${c.title}</h1>

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

${supportBlock(c)}${giftCards(c)}<p class="note">
  ${backArrow} <a href="${BOOKS_URL}">${c.back}</a>
</p>
${SCRIPT}
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
