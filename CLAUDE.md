# CLAUDE.md

## Purpose

This repository stores a Hugo-based knowledge hub about vibe coding and AI workflows. Assistants must preserve static-site compatibility and keep output deployment-ready for GitHub Pages.

## Language Rules

- Write content pages in Russian unless a file is explicitly technical infrastructure.
- Write configuration, code, commit messages, and automation snippets in English.

## Content Placement

- `content/concepts/` for mental models, terminology, and strategy pages.
- `content/skills/` for assistant skills, prompt patterns, and reusable workflows.
- `content/models/` for model comparisons, capabilities, and selection guides.
- `content/mcp/` for MCP integrations, connectors, and tool orchestration notes.
- `content/guides/` for step-by-step tutorials.
- `content/tools/` for tool-specific pages such as Claude Code.

## Front Matter Contract

Every content file must use YAML front matter with these keys:

- `title`
- `description`
- `date`
- `draft`
- `tags`
- `category`
- `weight`
- `difficulty`

## Writing Style

- Prefer short paragraphs and explicit headings.
- Use scannable tables for comparisons.
- Add actionable checklists for setup or operations topics.
- Keep tone direct and practical.

## Note Format

Use these section markers when relevant:

- `## Зачем это нужно`
- `## Когда использовать`
- `## Пошагово`
- `## Подводные камни`
- `## Что попробовать дальше`

## Tags

- Use lowercase tags.
- Prefer concrete tags like `hugo`, `mcp`, `agents`, `automation`, `cli`.
- Do not create near-duplicate tags.

## Prohibitions

- Do not add external CSS or JS dependencies unless explicitly requested.
- Do not hardcode absolute asset paths in templates.
- Do not switch front matter to TOML or JSON.
- Do not commit generated `public/` output.
- Do not remove Pagefind hooks from layouts.

## Template Rules

- Keep layouts compatible with Hugo `v0.140+`.
- Use Hugo template functions instead of manual path concatenation where possible.
- Prefer `relURL` or `RelPermalink` for internal navigation.

## Review Checklist

- Build succeeds with `hugo --minify`.
- Mobile layout remains readable.
- Metadata renders on list and single pages.
- New content appears in the correct section.
