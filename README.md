# Redact portalled submenu reproduction

Minimal reproduction using Redact 0.1.5, Base UI 1.9.0, TanStack Router 1.170.46, and React 19.3.1. No application backend, authentication, React Compiler, or design system is required.

## Run with Redact

Requires Node.js 20.19+ or 22.12+.

```sh
pnpm install
pnpm run dev
```

Open the URL printed by Vite, starting at `/`.

1. Click **More**.
2. Open **Pages**.
3. Hover **Example page**. The event log records the route loader, and DevTools Network shows a request for `/example.json`.
4. Click the **Example page** text with the mouse.

Expected: the menu closes, the URL changes to `/example`, and the example page renders.

Actual with Redact: the menu closes with `outside-press (pointerdown)`, the link never receives `click`, and the URL stays at `/`.

Use a real pointer click. Calling `element.click()` from the console skips the failing pointer-down sequence and can navigate successfully. Clicking the direct link outside the menu also works.

## Compare with React

Stop the dev server, then run:

```sh
pnpm run dev:react
```

Repeat the same steps from `/`. The submenu link should navigate to `/example`. The only runtime difference is that `--mode react` omits `redact()` in `vite.config.js`.

## Production builds

```sh
pnpm run build
pnpm run preview
```

For the React comparison:

```sh
pnpm run build:react
pnpm run preview
```

## Relevant structure

`src/main.jsx` renders a `Menu.SubmenuRoot` inside a menu popup. Each popup has its own `Menu.Portal`. The submenu item uses `render={<Link to="/example" />}` and contains a text `<span>`.

The visible log records menu close reasons, route-loader activity, link clicks, and navigation. It does not intercept or prevent pointer events.
