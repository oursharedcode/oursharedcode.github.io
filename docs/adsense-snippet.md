# Putting AdSense on a new page

Reference for future-you. The short version: **there is no page list to
maintain.** AdSense approves the domain once, not page by page. A page carries
ads if — and only if — it contains the code below. Adding a page is a
copy-paste here, with nothing to do in the AdSense dashboard and no review to
wait for.

That is also the mechanism that keeps ads *off* a page: leave the snippet out
and the page stays clean permanently. It is not a setting that could be
flipped by accident somewhere else.

## How the account is set up

Decided on 19 August 2026, recorded so none of it has to be re-derived:

- **Site registered as `oursharedcode.com`**, not `www.oursharedcode.com`.
  AdSense rejects a `www` subdomain with "URL must be a valid top-level
  domain". The apex covers every subdomain, `www` included.
- **Ownership verified by meta tag**, not by the AdSense code snippet. The
  snippet option wants the ad loader in `<head>` site-wide, which would have
  put ads on `/free-english-books/`. The meta tag proves ownership and loads
  nothing. It lives in `index.html` and only needs to be on the homepage.
- **Consent message: the three-choice layout** (consent / do not consent /
  manage options). The two-button version hides refusal behind "manage
  options", the pattern EU regulators have fined. It rides along with the ad
  script, so it appears only on pages that carry ads.

## The first review: rejected, 7 September 2026

AdSense reviewed the domain and returned **Needs attention — Low value
content**. Ads.txt status was *Authorised*, so nothing technical was blocking
it. The verdict was about the site itself.

It was a fair verdict. Measured against the live domain that day:

| Path | Crawlable words |
| ---- | --------------- |
| `/` | 459 |
| `/privacy/` | ~1,180 |
| `/free-english-books/` | ~1,712, in ten languages, and its purpose is to send the reader to freeieltsbooks.net |
| `/prompt-engineering-studio/` | **53** — a React app, so nothing was in the served HTML |
| `/robots.txt`, `/sitemap.xml` | 404 |

Four pages, roughly 4,300 words, one of them pointing off-domain and one of them
effectively empty to anything that does not run JavaScript. A reviewer opening
that saw about a page and a half of original material.

### What was built in response, 7–8 September 2026

The domain now runs to 13 pages and ~13,300 crawlable words.

- **The studio page** carries ~730 words of static prose below the React root —
  visible content, not hidden text for crawlers.
- **Six guides**, ~8,000 words, at `/prompt-engineering-studio/guides/`. They
  are the bulk of the domain's original material and the substance of the case
  for approval.
- **`/about/`** — who runs the site, including the IELTS band 5.5 to 8 story
  that explains why the books exist. Every fact in it was already published on
  this domain.
- **`/contact/`** — one address, no form, and honest expectations about reply
  times. See below.
- **`robots.txt` and `sitemap.xml`** — 21 URLs. `/free-english-books/en/` is
  excluded on purpose: its canonical points at the parent, and the hreflang set
  on all ten book pages gives the "en" slot to the parent rather than to `/en/`,
  so listing it would be the only claim on the site that it is a page in its own
  right.
- **Google Search Console** — domain property verified 8 September via
  Cloudflare (Google added the TXT record itself through DomainConnect), sitemap
  submitted.

### The re-review has not been requested

**As of 8 September 2026 the button has deliberately not been pressed.** The
plan is to wait until Search Console shows the guides indexed — three to five
days — and only then use AdSense → Sites → the `oursharedcode.com` row →
*Request review*.

The reasoning: an AdSense content review is a person opening pages, so waiting
changes nothing they would see. But a second rejection costs weeks, and Search
Console will say whether the new pages are reachable and renderable before that
is put to the test. The wait costs nothing, because no ads are running either
way.

**Do not add pages while a review is in flight.** A site that changes shape
mid-review is harder to assess, not easier.

### One thing this episode settled

Volume of URLs is not the lever. Ten translations of one page are ten URLs
carrying one page's content, and the books subtree already demonstrates it — it
is the weakest branch on the domain despite being the largest by URL count.
Machine-translating the guides to repeat the pattern would fall under Google's
scaled-content-abuse policy, published into a site under active review. If
anything here is ever translated, it is `/about/`, into the book locales, by a
human.

## The contact address

`hello@oursharedcode.com`, live since 8 September 2026, is the site's one
published address — on `/contact/`, on `/about/`, and in `/privacy/`, which
previously published a personal gmail address in two places.

It is Cloudflare Email Routing on this zone forwarding to a personal inbox. Two
consequences worth knowing before touching it:

- **It receives only.** Replies leave from the personal address unless "Send
  mail as" with an SMTP relay is configured separately. `/contact/` says so
  rather than letting people wonder.
- **Gmail spam-files forwarded mail** — a gmail.com sender arriving via
  Cloudflare's servers fails DMARC alignment. A Gmail filter
  (`to:(hello@oursharedcode.com)` → *Never send it to Spam*) fixes it. If mail
  stops arriving, check that filter exists before suspecting the routing.

The apex now carries two TXT records that must both survive: the SPF record for
mail, and the Search Console verification. Removing either breaks something
quietly.

## Publisher ID

```
ca-pub-1213781225888339
```

The ID is not a secret — it ships in the page source of every site that runs
AdSense. Note the `ca-` prefix is used in page code but *not* in `ads.txt`,
which wants the bare `pub-1213781225888339`.

## The snippet

Loader goes in `<head>`, once per page:

```html
<script async crossorigin="anonymous"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1213781225888339"></script>
```

Ad unit goes wherever the ad should appear — replace `data-ad-slot` with the
slot ID of an ad unit created in the AdSense dashboard:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1213781225888339"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

The same `data-ad-slot` can be reused on every page. Create a separate ad unit
per page only when the per-page revenue split is worth having in reporting —
the ads serve identically either way.

## Which pages carry ads today

| Path | Repo | Ads |
| ---- | ---- | --- |
| `/prompt-engineering-studio/` | `prompt-engineering-studio` | Yes — injected by `src/AdRail.jsx`, one unit in the right rail. Dormant until `adsenseSlot` is filled in: the rail checks for *both* `adsenseClient` and `adsenseSlot` and shows a placeholder unless it has each |
| `/prompt-engineering-studio/guides/**` | `prompt-engineering-studio` | No — six written guides, plain HTML, no ad code |
| `/free-english-books/` | this repo, generated by `build.mjs` | No, deliberately |
| `/` | this repo, `index.html` | No |
| `/about/`, `/contact/`, `/privacy/` | this repo | No |

The studio's ad code lives in its own repo and compiles only into its own
bundle, so it cannot reach the pages here even by mistake. Two repos, two
builds, no shared surface.

## ads.txt

Already in place at [`/ads.txt`](../ads.txt) in this repo, holding:

```
google.com, pub-1213781225888339, DIRECT, f08c47fec0942fa0
```

That one file at the domain root covers every page on
the domain forever. It never needs a per-page copy, and a copy sitting at a
subpath is ignored: Google reads the root and nowhere else.

It is worth being clear about what the file does, because the name suggests
more than it is. `ads.txt` declares which vendors may sell this domain's ad
inventory. It does not place ads, and adding it does not put ads on any page.
Missing it does not block approval either — it just quietly suppresses some
revenue once ads are live.

## Auto ads: leave it off

Auto ads lets Google decide placement, so a page needs only the loader and no
`<ins>` block. Convenient for a plain text page, wrong for the studio, whose
layout is deliberate — the studio gets one unit in the right rail, and Auto
ads would scatter more through the interface.

The setting is site-wide, so switching it on for a simple page would also
reshape the studio. If that trade is ever worth making, AdSense's **Advanced
URL settings** (Ads → By site) scope Auto ads to specific paths. Until then,
manual units keep every page predictable.

## Before adding ads to a new page

Give the page real content first. Ads on thin or auto-generated pages invite a
site-level policy review, and that review lands on the whole domain — the
studio included. Substance on each page is what protects the rest.

## Blocker: a page for children changes the rules

**If a page on this domain is ever aimed at children — a kids' game, for
instance — `/privacy/` must be updated before that page goes live, not
after.**

The policy currently states the site "is not directed at children under 13."
Publishing a page for children makes that sentence false, and a privacy policy
that contradicts the site is a problem in its own right, quite apart from the
law it fails to satisfy.

What the law adds: COPPA treats cookies and other persistent identifiers as
personal information once they are collected from a child under 13, and the
GDPR sets a consent age of 13 to 16 depending on the member state. Google, for
its part, forbids *personalised* ads on child-directed content and expects the
content to be tagged as child-directed.

The simplest way through all of that is to **serve no ads on a children's page
at all**, exactly as `/free-english-books/` does. AdSense enforces at the
account level, so one mishandled child-directed page puts the studio's ads and
the account itself at risk. Non-personalised ads on a kids' page would not earn
enough to be worth that exposure.

Three questions decide the wording of the update, and none of them can be
answered in advance: whether the page carries ads, whether it stores anything
(a score, a name, anything in `localStorage`), and whether it is genuinely
directed at children rather than merely enjoyed by them. Answer those first,
then write the section.
