# Google Stitch — Agent Skills

This directory vendors the [Google Stitch](https://stitch.withgoogle.com) agent
skills so they are available to Claude Code (and other Agent Skills–compatible
coding agents) whenever this repository is opened — including Claude Code on the
web, where only committed files persist across sessions.

The skills follow the [Agent Skills](https://agentskills.io) open standard: each
lives in its own directory with a `SKILL.md` plus supporting `scripts/`,
`resources/`, `references/`, and `examples/`. Claude Code auto-discovers every
`.claude/skills/<name>/SKILL.md`, so no extra configuration is required.

## Prerequisite: the Stitch MCP server

These skills drive Google Stitch through its **MCP server**. To actually run the
design/build workflows you must register the Stitch MCP server in your agent and
provide credentials, per the official setup guide:

> https://stitch.withgoogle.com/docs/mcp/setup/

Until the MCP server is configured, the skills still load and provide guidance,
but the tool calls they make (`stitch*:*`, uploads, generation) will not resolve.

## Installed skills

### Design workflows
| Skill | What it does |
|---|---|
| `generate-design` | Generate screens from text/images, edit screens, create variants |
| `code-to-design` | Convert frontend code into a Stitch design (HTML extraction + upload) |
| `manage-design-system` | Upload a `DESIGN.md` and apply themes to screens |
| `extract-design-md` | Extract a `DESIGN.md` design system from source code |
| `extract-static-html` | Snapshot running web apps to self-contained static HTML |
| `upload-to-stitch` | Upload local assets (images, mockups, HTML) to a Stitch project |

### Build / code generation
| Skill | What it does |
|---|---|
| `react-components` | Convert Stitch screens into a validated React component system |
| `react-native` | Convert Stitch designs into production React Native components |
| `remotion` | Generate walkthrough videos from a Stitch project (Remotion) |
| `shadcn-ui` | Guidance for building UIs with shadcn/ui components |

### Utilities
| Skill | What it does |
|---|---|
| `design-md` | Analyze a Stitch project and synthesize a semantic `DESIGN.md` |
| `enhance-prompt` | Turn vague UI ideas into polished, Stitch-optimized prompts |
| `stitch-loop` | Generate complete multi-page websites from a single prompt |
| `taste-design` | Generate `DESIGN.md` files enforcing premium, anti-generic UI standards |

## Provenance & updates

- **Source:** [`google-labs-code/stitch-skills`](https://github.com/google-labs-code/stitch-skills) @ commit `3f64079d75d025bc5890c73669f27c26a2d80b31`
- **License:** Apache-2.0 (see [`LICENSE`](./LICENSE))

Upstream ships these as three Claude Code *plugins* (`stitch-design`,
`stitch-build`, `stitch-utilities`). They are vendored here as flat project
skills so they persist in the repo without depending on a plugin marketplace.
Edits made to the upstream files during vendoring were limited to:

1. **Name normalization** — skill `name:` fields that used the plugin-namespaced
   form `stitch::<name>` were changed to the plain slug `<name>` (matching each
   skill's directory) so they register as project skills.
2. **Path adaptation** — a few references used the upstream `plugins/<plugin>/skills/<name>/`
   repo layout, which no longer resolves once flattened into `.claude/skills/`.
   These were repointed to the vendored locations:
   - `manage-design-system/SKILL.md` → `.claude/skills/upload-to-stitch/scripts/upload_to_stitch.py`
   - `shadcn-ui/README.md` → the vendored `LICENSE` and the upstream `CONTRIBUTING.md` URL

Skill logic, scripts, resources, and examples are otherwise byte-for-byte upstream.

To refresh to a newer upstream version, re-vendor from the source repo, or
install the plugins directly with:

```bash
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code
```
