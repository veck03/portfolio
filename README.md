# React + Vite

## Local chat development

The site runs on Vite at `http://localhost:5173`; the chat API runs in Wrangler at
`http://localhost:8787/chat`. Copy `.env.example` to `.env.local` for the Vite URL,
then create a root `.dev.vars` file with `GEMINI_API_KEY=your-key` for Wrangler.
Start the site with `npm run dev` and the API with
`npx wrangler dev --config wrangler.jsonc --port 8787` from the repository root.
If starting it from `worker/`, run `npm run dev` there; that script explicitly uses
the root config. Keep the API key in `.dev.vars`; do not put it in
`.env.local` or commit it.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
