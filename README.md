<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/arules-guardrails_layer-white?style=for-the-badge&labelColor=0d1117&color=58a6ff">
  <img alt="arules" src="https://img.shields.io/badge/arules-guardrails_layer-black?style=for-the-badge&labelColor=f6f8fa&color=24292f">
</picture>

### The portable guardrails layer for AI companions.

Define what your AI can and cannot do in a single file. Your AI reads it and respects the boundaries.

<br>

[![npm](https://img.shields.io/npm/v/@aman_asmuei/arules?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@aman_asmuei/arules)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![acore](https://img.shields.io/badge/part_of-acore_ecosystem-58a6ff.svg?style=flat-square)](https://github.com/amanasmuei/acore)

</div>

---

## The Problem

Every AI session starts without boundaries. You re-explain the same rules every time: "don't push to main", "ask before deleting", "write tests for new code." Your AI has no persistent understanding of your guardrails.

## The Solution

**arules** lets you define safety rules and permissions in a `rules.md` file. Your AI reads this file and respects your boundaries consistently.

```bash
npx @aman_asmuei/arules init
```

This creates `~/.arules/rules.md` with 6 starter categories. Add it to your AI's system prompt and it follows your rules automatically.

---

## The Ecosystem

```
aman
├── acore   →  identity     →  who your AI IS
├── amem    →  memory       →  what your AI KNOWS
├── akit    →  tools        →  what your AI CAN DO
├── aflow   →  workflows    →  HOW your AI works
├── arules  →  guardrails   →  what your AI WON'T do
└── aeval   →  evaluation   →  how GOOD your AI is
```

| Layer | Package | What it does |
|:------|:--------|:-------------|
| Identity | [acore](https://github.com/amanasmuei/acore) | Personality, values, relationship memory |
| Memory | [amem](https://github.com/amanasmuei/amem) | Automated knowledge storage (MCP) |
| Tools | [akit](https://github.com/amanasmuei/akit) | 15 portable AI tools (MCP + manual fallback) |
| Workflows | [aflow](https://github.com/amanasmuei/aflow) | Reusable AI workflows (code review, bug fix, etc.) |
| Guardrails | **arules** | Safety boundaries and permissions |
| Evaluation | [aeval](https://github.com/amanasmuei/aeval) | Relationship tracking and session logging |
| **Unified** | **[aman](https://github.com/amanasmuei/aman)** | **One command to set up everything** |

Each works independently. `aman` is the front door.

---

## Quick Start

```bash
# Create rules.md with starter rules
npx @aman_asmuei/arules init

# List your rule categories
npx @aman_asmuei/arules list

# See rules in a category
npx @aman_asmuei/arules show Coding

# Add a custom rule
npx @aman_asmuei/arules add Security

# Remove a rule interactively
npx @aman_asmuei/arules remove

# Validate your rules.md
npx @aman_asmuei/arules check

# Health check
npx @aman_asmuei/arules doctor
```

## Commands

| Command | What it does |
|:--------|:------------|
| `arules` | First run: create rules.md. After: show categories |
| `arules init` | Create `~/.arules/rules.md` with starter rules |
| `arules list` | List all rule categories |
| `arules show <category>` | Show rules in a category |
| `arules add [category]` | Add a new rule interactively |
| `arules remove` | Remove a rule interactively |
| `arules check` | Validate rules.md structure |
| `arules doctor` | Health check |

## How It Works

### rules.md — The Rules Definition

Every rule lives in `~/.arules/rules.md`:

```markdown
# My AI Rules

## Always
- Ask before deleting files or data
- Explain your reasoning before making changes
- Flag security concerns immediately
- Respect code review processes

## Never
- Push directly to main/master without approval
- Expose secrets, API keys, or credentials in code
- Make changes to production systems without confirmation
- Skip tests when fixing bugs

## Coding
- Follow existing code style and conventions
- Prefer simple solutions over clever ones
- Write tests for new functionality
- Keep PRs focused and small
```

Your AI reads this file and automatically respects the defined boundaries.

### Platform Behavior

| Platform | What happens |
|:---------|:------------|
| Claude Code / Cursor | AI reads rules.md, enforces rules automatically |
| ChatGPT / Gemini / Other | AI reads rules.md, follows rules during conversation |

### Integration with acore

If you use [acore](https://github.com/amanasmuei/acore), run `acore pull --sync-only` to refresh your platform files and pick up rules.md.

---

## Starter Categories

The `arules init` command includes 6 categories to get started:

| Category | Rules | Examples |
|:---------|:------|:---------|
| `Always` | 4 | Ask before deleting, explain reasoning, flag security |
| `Never` | 4 | No pushing to main, no exposed secrets, no skipping tests |
| `Coding` | 4 | Follow code style, prefer simplicity, write tests |
| `Communication` | 4 | Be direct, admit uncertainty, ask before assuming |
| `Data` | 4 | No logging PII, treat data as confidential |
| `Team` | 4 | Follow branching strategy, respect code ownership |

## Privacy

All data stays local. `~/.arules/` contains your rule definitions. No telemetry. No accounts. No cloud.

## Contributing

Contributions welcome! Add starter rules, improve the parser, or suggest features.

## License

[MIT](LICENSE)

---

<div align="center">

**Define boundaries. Enforce always. Every AI.**

</div>
