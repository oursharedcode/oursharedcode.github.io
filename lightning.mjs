/**
 * The Lightning card's link and QR code. Both are derived from the one
 * address in content.mjs and checked before build.mjs writes any page.
 *
 *   LNURL          the address's LNURL-pay endpoint, bech32-encoded, in upper
 *                  case: LNURL1DP68…
 *   LIGHTNING_URI  lightning:LNURL1…, the "Open in wallet" link
 *   qrSvg(label)   an inline SVG QR code holding LIGHTNING:LNURL1…
 *
 * The code holds the LNURL rather than the address because more wallets can
 * read it. The address form (name@host, LUD-16) is newer; any wallet that
 * accepts it also accepts an LNURL, and some older ones accept only the LNURL.
 * The card still shows the address as text, so it can be copied.
 *
 * The code is in upper case because a QR code's alphanumeric mode stores only
 * upper case, digits and a few symbols. It packs them at 5.5 bits a character
 * rather than 8, so the same data makes a smaller code that is easier to
 * scan. Nothing is lost by it. Bech32 ignores case, and BIP-173 names QR codes
 * as the reason to upper-case it. URI schemes ignore case as well, so
 * LIGHTNING: means the same as lightning:.
 *
 * Each build checks three things, and throws if any fails, so a page with a
 * broken code is never written:
 *   1. the LNURL decodes back to the endpoint URL;
 *   2. the QR code, drawn as pixels, is read by jsQR as exactly the payload;
 *   3. the SVG path, parsed back, matches the QR code module for module.
 * jsQR is a separate decoder by separate authors (_vendor/README.md), so a
 * pass means another program has read this one's output correctly.
 *
 * The build makes no network request. Whether the address actually takes
 * payments is checked on the live endpoint, and with a real payment, before
 * launch (ielts_books steering/tasks.md, D9).
 */

import { createRequire } from 'node:module';

import { LIGHTNING_ADDRESS } from './content.mjs';

const require = createRequire(import.meta.url);
const qrcode = require('./_vendor/qrcode-generator-1.4.4.cjs');
const jsQR = require('./_vendor/jsqr-1.4.0.cjs');

// ------------------------------------------------------ bech32 (BIP-173) --

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values) {
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i];
  }
  return chk >>> 0;
}

const hrpExpand = (hrp) =>
  [...hrp].map((c) => c.charCodeAt(0) >> 5).concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));

function convertBits(data, from, to, pad) {
  let acc = 0;
  let bits = 0;
  const out = [];
  const maxv = (1 << to) - 1;
  for (const v of data) {
    acc = ((acc << from) | v) & 0xffffff;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) out.push((acc << (to - bits)) & maxv);
  } else if (bits >= from || ((acc << (to - bits)) & maxv)) {
    throw new Error('bech32: non-zero padding');
  }
  return out;
}

function bech32Encode(hrp, bytes) {
  const data = convertBits(bytes, 8, 5, true);
  const mod = polymod(hrpExpand(hrp).concat(data, [0, 0, 0, 0, 0, 0])) ^ 1;
  const checksum = [0, 1, 2, 3, 4, 5].map((p) => (mod >>> (5 * (5 - p))) & 31);
  return hrp + '1' + data.concat(checksum).map((d) => CHARSET[d]).join('');
}

function bech32Decode(str) {
  const s = str.toLowerCase();
  const pos = s.lastIndexOf('1');
  const hrp = s.slice(0, pos);
  const data = [...s.slice(pos + 1)].map((c) => CHARSET.indexOf(c));
  if (data.some((d) => d < 0)) throw new Error('bech32: bad character');
  if (polymod(hrpExpand(hrp).concat(data)) !== 1) throw new Error('bech32: bad checksum');
  return { hrp, bytes: Buffer.from(convertBits(data.slice(0, -6), 5, 8, false)) };
}

// ------------------------------------------------- address -> LNURL-pay --

// LUD-16: user@host is served at https://host/.well-known/lnurlp/user, and
// the user part is limited to a-z, 0-9, "-", "_" and ".".
const m = /^([a-z0-9._-]+)@([a-z0-9.-]+\.[a-z]{2,})$/.exec(LIGHTNING_ADDRESS);
if (!m) throw new Error(`LIGHTNING_ADDRESS is not a Lightning address: ${LIGHTNING_ADDRESS}`);
const ENDPOINT = `https://${m[2]}/.well-known/lnurlp/${m[1]}`;

export const LNURL = bech32Encode('lnurl', Buffer.from(ENDPOINT, 'utf8')).toUpperCase();
export const LIGHTNING_URI = `lightning:${LNURL}`;

// Check 1: the LNURL decodes back to the endpoint.
{
  const back = bech32Decode(LNURL);
  if (back.hrp !== 'lnurl' || back.bytes.toString('utf8') !== ENDPOINT) {
    throw new Error('Lightning QR: the LNURL does not decode back to ' + ENDPOINT);
  }
}

// ------------------------------------------------------------ the code --

const PAYLOAD = 'LIGHTNING:' + LNURL;
const QUIET = 4; // modules of white margin on every side; scanners need it

const qr = qrcode(0, 'M'); // version 0 = smallest that fits; M = 15% recovery
qr.addData(PAYLOAD, 'Alphanumeric');
qr.make();
const N = qr.getModuleCount();

// Check 2: draw the code as pixels (6 per module) and read it back.
{
  const S = 6;
  const W = (N + 2 * QUIET) * S;
  const px = new Uint8ClampedArray(W * W * 4).fill(255);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!qr.isDark(r, c)) continue;
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const i = (((r + QUIET) * S + y) * W + (c + QUIET) * S + x) * 4;
          px[i] = px[i + 1] = px[i + 2] = 0;
        }
      }
    }
  }
  const read = jsQR(px, W, W);
  if (!read || read.data !== PAYLOAD) {
    throw new Error('Lightning QR: jsQR read ' + JSON.stringify(read && read.data) + ', expected ' + PAYLOAD);
  }
}

// One <path>, one horizontal run of dark modules per subpath, drawn in module
// units so the viewBox scales it to any size without blurring.
let d = '';
for (let r = 0; r < N; r++) {
  let c = 0;
  while (c < N) {
    if (!qr.isDark(r, c)) {
      c++;
      continue;
    }
    let e = c;
    while (e < N && qr.isDark(r, e)) e++;
    d += `M${c + QUIET} ${r + QUIET}h${e - c}v1h-${e - c}z`;
    c = e;
  }
}

// Check 3: parse the path back and compare it with the code, module by module.
{
  const grid = Array.from({ length: N }, () => Array(N).fill(false));
  for (const [, x, y, w] of d.matchAll(/M(\d+) (\d+)h(\d+)v1h-\3z/g)) {
    for (let k = 0; k < +w; k++) grid[+y - QUIET][+x - QUIET + k] = true;
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] !== qr.isDark(r, c)) throw new Error(`Lightning QR: SVG path differs at ${r},${c}`);
    }
  }
}

const V = N + 2 * QUIET;

// `label` is the accessible name, in the page's language.
export const qrSvg = (label) =>
  `<svg class="qr" viewBox="0 0 ${V} ${V}" shape-rendering="crispEdges" role="img" aria-label="${label}">` +
  `<rect width="${V}" height="${V}" fill="#fff"/><path fill="#000" d="${d}"/></svg>`;
