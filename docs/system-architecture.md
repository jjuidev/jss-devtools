# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Terminal                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   jss-devtools CLI                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Main Command (citty)                    │    │
│  │  ┌─────────────┐  ┌─────────────┐                   │    │
│  │  │ init cmd    │  │ ls cmd      │  ...              │    │
│  │  └─────────────┘  └─────────────┘                   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Utilities Layer                         │    │
│  │  ┌─────────────┐  ┌─────────────┐                   │    │
│  │  │ banner.ts   │  │ constants.ts│                   │    │
│  │  └─────────────┘  └─────────────┘                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Command Flow

```
User Input
    │
    ▼
┌───────────────────┐
│ runMain(main)     │  ← Entry point
└───────────────────┘
    │
    ▼
┌───────────────────┐
│ Parse args/citty  │  ← Command routing
└───────────────────┘
    │
    ├──► init command ──► displayBanner() ──► Init logic
    │
    ├──► ls command ────► displayBanner() ──► List commands
    │
    └──► no command ────► displayBanner() ──► Show help hint
```

## Module Dependencies

```
src/index.ts
    │
    └──► src/cli/index.ts
              │
              ├──► src/cli/commands/init.ts
              │         │
              │         ├──► src/cli/utils/constants.ts
              │         └──► src/cli/utils/banner.ts
              │
              ├──► src/cli/commands/ls.ts
              │         │
              │         ├──► src/cli/utils/constants.ts
              │         └──► src/cli/utils/banner.ts
              │
              └──► src/cli/utils/banner.ts
                        │
                        └──► src/cli/utils/constants.ts
```

## Build Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  TypeScript src │     │  Build Script   │
│  (src/**/*.ts)  │     │  (scripts/)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│              Bun Build                   │
│  - Bundle TypeScript                    │
│  - Target: Node.js                      │
│  - Formats: ESM, CJS                    │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
┌─────────────┐   ┌─────────────┐
│  ESM Build  │   │  CJS Build  │
│  dist/esm/  │   │  dist/cjs/  │
└─────────────┘   └─────────────┘
         │               │
         └───────┬───────┘
                 ▼
┌─────────────────────────────────────────┐
│           Post-Process                   │
│  - Add shebang (#!/usr/bin/env node)    │
│  - Set executable permissions            │
│  - Copy figlet fonts                     │
└─────────────────────────────────────────┘
```

## Runtime Flow

```
CLI Start
    │
    ▼
┌───────────────────┐
│ Check cachedBanner│
│ (module-level)    │
└────────┬──────────┘
         │
    ┌────┴────┐
    │ Cached? │
    └────┬────┘
         │
    ┌────┴────┐
    No        Yes
    │         │
    ▼         │
┌─────────┐   │
│ figlet  │   │
│ render  │   │
└────┬────┘   │
     │        │
     ▼        │
┌─────────┐   │
│ Cache   │   │
│ result  │   │
└────┬────┘   │
     │        │
     └────┬───┘
          │
          ▼
┌───────────────────┐
│ Output to console │
│ (colors.primary)  │
└───────────────────┘
```

## Data Structures

### CLI_META

```typescript
const CLI_META = {
  name: 'JSS DevTools',
  tagline: 'Development tools for JavaScript stack',
  commandName: 'jss-devtools',
};
```

### Colors

```typescript
const colors = {
  primary: ansis.cyan,
  secondary: ansis.magenta,
  text: ansis.white,
  muted: ansis.gray,
  success: ansis.green,
  warning: ansis.yellow,
};
```

## Extension Points

1. **New Commands**: Add to `src/cli/commands/` and register in `subCommands`
2. **New Utilities**: Add to `src/cli/utils/`
3. **New Dependencies**: Add to `package.json` and import as needed
4. **Build Steps**: Extend `scripts/build.ts`
