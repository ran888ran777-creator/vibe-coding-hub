---
title: "Universal Agent Rules: одна база правил для Codex, Claude, Cursor и Windsurf"
description: "Полезный паттерн для AI-friendly репозитория: не дублировать правила по инструментам, а держать один canonical source."
date: 2026-04-16T22:40:00+05:00
draft: false
tags:
  - guides
  - codex
  - agents
  - rules
category: "guides"
weight: 30
difficulty: "intermediate"
---

## 🧭 Коротко

Один из самых практичных приёмов из [`serejaris/blog-pipeline-template`](https://github.com/serejaris/blog-pipeline-template) — держать одну каноническую папку с правилами и подключать её к разным AI-инструментам, а не писать отдельные инструкции с нуля для каждого.

## 🎯 Почему это важно

Когда проект растёт, быстро появляются:

- `CLAUDE.md`
- `AGENTS.md`
- `.cursor/rules/...`
- `.windsurf/rules/...`

Если они расходятся, ассистенты начинают вести себя по-разному в одном и том же репозитории.

## ⚡ Что показывает репозиторий

По README `blog-pipeline-template` структура такая:

| Инструмент | Entry point | Где лежит truth source |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` | `rules/` |
| Cursor | `.cursor/rules/*.mdc` | symlink или переиспользование `rules/` |
| Windsurf | `.windsurf/rules/*.md` | symlink или переиспользование `rules/` |
| Любой универсальный агент | `AGENTS.md` | ссылка на тот же канонический источник |

Ключевая идея из README сформулирована очень чётко: все инструменты должны читать один и тот же контент, а `rules/` остаётся canonical source.

## 🔧 Как адаптировать это под Codex

Для вашего репозитория рабочая схема может быть такой:

1. `CLAUDE.md` остаётся главным документом поведения.
2. `AGENTS.md` ссылается на те же правила, если нужен более универсальный стандарт.
3. Дополнительные tool-specific rules не содержат отдельной логики, а только прокидывают к каноническому набору.

Минимальный практический набор секций:

- назначение репозитория;
- структура каталогов;
- стиль правок;
- список запретов;
- формат итогового ответа;
- требования к проверкам перед коммитом.

## 💡 Что особенно полезно для Codex

Для Codex это снижает две проблемы сразу:

- меньше расхождения между работой в разных агентах;
- меньше риска, что проект будет вести себя по одному в ChatGPT/Codex и по другому в Cursor или Claude Code.

Если у вас много инструментов, canonical rules почти обязательны.

## 🔗 Источники

- [serejaris/blog-pipeline-template](https://github.com/serejaris/blog-pipeline-template)
- [README репозитория](https://github.com/serejaris/blog-pipeline-template/blob/main/README.md)
