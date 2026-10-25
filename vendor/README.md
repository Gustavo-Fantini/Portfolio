# Third-party software

## Three.js r180

- Upstream: https://github.com/mrdoob/three.js/tree/r180
- Source: https://raw.githubusercontent.com/mrdoob/three.js/r180/build/three.cjs
- License: MIT; see THREE-LICENSE.txt.
- Local distribution: three.min.js, 704,325 bytes.

The official single-file CommonJS build is wrapped in an isolated exports scope and exposed as window.THREE. It was minified with esbuild 0.25.11 (target es2020, legal-comments inline). This allows the static portfolio to render its scene from file URLs as well as HTTPS without runtime CDN access. The artwork, geometry, materials and scene behavior in scene3d.js are original to this portfolio.
