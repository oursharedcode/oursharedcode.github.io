# Vendored build-time code

Two small libraries that `lightning.mjs` uses when `node build.mjs` runs, to
draw the Lightning card's QR code and then prove it scans. They are committed
here instead of installed because this repo has no install step: `node
build.mjs` has to work on a fresh clone with nothing but Node.

Nothing in this folder is served. GitHub Pages builds this repo with Jekyll,
which skips any folder whose name starts with `_`, and no page loads these
files: the QR code is saved into each story page as an inline SVG when the page
is built.

| File | Package | Source | SHA-256 | Licence |
|---|---|---|---|---|
| `qrcode-generator-1.4.4.cjs` | qrcode-generator 1.4.4, Kazuhiko Arase | https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js | `18ae399f81182bc9de916e9c77b195df20cc58d6f2d55a62b085a299f1bf1780` | MIT, `LICENSE-qrcode-generator` |
| `jsqr-1.4.0.cjs` | jsQR 1.4.0, Cosmo Wolfe and contributors | https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js | `bc40c8a15196236b2314db0856f72ca0b49980cd5413b8c852a7349f5fee0859` | Apache-2.0, `LICENSE-jsqr` |

Both files are byte-for-byte the published files. Only the names changed: the
`.cjs` extension tells Node to load them as CommonJS. The qrcode-generator npm
package ships no licence file, so `LICENSE-qrcode-generator` comes from its
repository, https://github.com/kazuhikoarase/qrcode-generator (tag `js1.4.4`).
`LICENSE-jsqr` is the one in the jsqr package.

Why these two: qrcode-generator draws the code, and jsQR is an independent
decoder that reads it back. They are separate codebases by separate authors, so
if the build passes, one program's output has been read correctly by another.
It is not one library checking its own work.

To update either one, replace the file, update its row above with the new
source and hash, run `node build.mjs`, and confirm the build still passes.
