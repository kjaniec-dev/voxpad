# voxpad

Voxel editor built with React, Three.js, and Vite.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The production build is written to `dist/`.

## Netlify

This project is ready for Netlify using `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`
- SPA fallback: all routes redirect to `/index.html`

To deploy, connect the repository in Netlify and use the default settings from `netlify.toml`.
