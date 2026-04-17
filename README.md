# Vibe Coding Hub

`vibe-coding-hub` is a Hugo Extended site for GitHub Pages. It is designed for Russian-language content about vibe coding, AI workflows, MCP, models, and hands-on guides.

## Stack

- Hugo Extended `v0.140+`
- Custom layouts without external frontend dependencies
- GitHub Actions with `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`
- Pagefind-ready markup

## Local Run

1. Install Hugo Extended.
2. Clone the repository.
3. Start the local server:

```powershell
hugo server -D
```

4. Open `http://localhost:1313/vibe-coding-hub/` if you run with the configured `baseURL`, or `http://localhost:1313/` in the default development mode.

## Production Build

```powershell
hugo --minify
```

Generated files are written to `public/`.

## Deploy

Push to `master`. GitHub Actions builds the site and deploys it to GitHub Pages using the workflow in `.github/workflows/hugo.yml`.

## Structure

```text
archetypes/           Content templates
content/              Russian-language pages and section indexes
layouts/              Hugo templates
static/               CSS, robots.txt, and future static assets
.github/workflows/    GitHub Pages deployment workflow
```

## Content Rules

- Content is written in Russian.
- Configs, code, and automation docs are written in English where appropriate.
- Front matter uses YAML format.
- Section landing pages live in `content/concepts`, `content/skills`, `content/models`, `content/mcp`, and `content/guides`.

## Optional Search

The templates already include Pagefind markup and script hooks. To add search later:

```powershell
hugo --minify
npx pagefind --site public
```

## Notes

- All template asset URLs use Hugo helpers that resolve correctly from the repository root.
- The theme defaults to dark mode and works without JavaScript frameworks.
