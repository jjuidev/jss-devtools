# Codebase Summary

## Overview

A CLI development tools package for JavaScript/TypeScript projects built with Bun and designed for both ESM and CJS compatibility.

## Source Structure

```
src/
├── index.ts                    # Package entry, exports CLI module
└── cli/
    ├── index.ts                # CLI entry point with main command
    ├── commands/               # Command implementations
    │   ├── index.ts            # Barrel export for commands
    │   ├── init.ts             # Project initialization command
    │   └── ls.ts               # List commands utility
    └── utils/                  # Shared utilities
        ├── constants.ts        # Color scheme, CLI metadata
        └── banner.ts           # ASCII banner with caching
```

## Module Details

### Entry Points

| File | Purpose |
|------|---------|
| `src/index.ts` | Package export entry |
| `src/cli/index.ts` | CLI runtime entry with `runMain()` |

### Commands

| Command | File | Status |
|---------|------|--------|
| `init` | `src/cli/commands/init.ts` | Placeholder |
| `ls` | `src/cli/commands/ls.ts` | Functional |

### Utilities

| File | Exports | Description |
|------|---------|-------------|
| `constants.ts` | `colors`, `CLI_META` | Color helpers, metadata |
| `banner.ts` | `getBanner()`, `displayBanner()` | ASCII art generation |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `citty` | CLI command framework |
| `figlet` | ASCII art generation |
| `ansis` | Terminal color output |
| `@clack/prompts` | Interactive prompts (planned) |
| `consola` | Logging (planned) |
| `execa` | Process execution (planned) |
| `pathe` | Path utilities (planned) |

## Build Output

```
dist/
├── cjs/
│   ├── index.cjs              # CommonJS entry
│   ├── index.d.ts             # Type definitions
│   └── package.json           # { "type": "commonjs" }
├── esm/
│   ├── index.js               # ESM entry (bin target)
│   ├── index.d.ts             # Type definitions
│   └── package.json           # { "type": "module" }
└── fonts/                     # Figlet fonts for runtime
```

## Build Process

1. Clean dist directory
2. Build CJS bundle with Bun + tsc types
3. Build ESM bundle with Bun + tsc types
4. Add shebang to CLI entries
5. Copy figlet fonts to dist

## Design Patterns

### Banner Caching

Module-level singleton pattern:
- `cachedBanner`: Stores computed ASCII art
- `bannerDisplayed`: Prevents duplicate display

### Command Registration

Using `citty` subCommands pattern:
```typescript
subCommands: {
  ls: lsCommand,
  init: initCommand
}
```

## Export Strategy

- Single entry point via `src/index.ts`
- Dual module support (ESM/CJS)
- Type definitions bundled with each format
