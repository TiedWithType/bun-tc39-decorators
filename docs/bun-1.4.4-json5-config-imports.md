# Bun 1.4.4 JSON5 configuration patch

Target upstream revision: `38afee6c84fcf48c0edb2466aa4b27d287a59c30`.

This patch adds JSON5 parsing to Bunfig when a configuration file is explicitly
provided with a `.json5` extension. TOML parsing remains unchanged, and the
security-scanner inspection path uses the matching parser.

This is an initial, deliberately narrow part of the requested JSON5 work. It
does not yet add automatic `bunfig.json5` discovery, JSON5 parsing for
`package.json` / `tsconfig.json` / `jsconfig.json`, or new client/server HMR
behavior. Bun already has a JSON5 module loader; those import paths need
dedicated integration and HMR regression tests before claiming full support.

The patch has not been compiled or applied against upstream yet. GitHub Actions
must validate it before it is treated as ready.
