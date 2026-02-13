# Code Standards

## File Structure

```
src/
├── index.ts              # Main export entry point
└── cli/
    ├── index.ts          # CLI main entry (command definitions)
    ├── commands/
    │   ├── index.ts      # Command exports
    │   ├── init.ts       # Init command implementation
    │   └── ls.ts         # Ls command implementation
    └── utils/
        ├── constants.ts  # Color scheme and CLI metadata
        └── banner.ts     # Figlet banner with caching
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `banner.ts`, `constants.ts` |
| Variables | camelCase | `cachedBanner`, `bannerDisplayed` |
| Constants | SCREAMING_SNAKE_CASE | `CLI_META` |
| Functions | camelCase | `displayBanner()`, `getBanner()` |
| Command exports | PascalCase with suffix | `initCommand`, `lsCommand` |

## Code Organization

### Command Structure

Each command follows the `citty` pattern:

```typescript
export const xyzCommand = defineCommand({
  meta: {
    name: 'xyz',
    description: 'Command description',
  },
  async run() {
    // Implementation
  },
});
```

### Utility Pattern

Utilities are pure functions with clear responsibilities:
- Single responsibility per function
- Module-level caching where appropriate
- Graceful fallbacks (e.g., figlet failure)

## Import Organization

```typescript
// 1. External dependencies
import { defineCommand } from 'citty';
import figlet from 'figlet';

// 2. Internal modules (relative)
import { colors } from '../utils/constants';
import { displayBanner } from '../utils/banner';
```

## Error Handling

- Use try-catch for operations that may fail (e.g., figlet rendering)
- Provide fallback behavior (e.g., plain text if ASCII art fails)
- Log meaningful error messages

## File Size Limits

- Keep files under 200 lines
- Split commands into separate files
- Extract shared utilities to `utils/` directory

## TypeScript Guidelines

- Strict type checking enabled
- Explicit return types for exported functions
- Use type inference where obvious
- Avoid `any` type

## Testing Requirements

- Unit tests for utility functions
- Integration tests for commands
- Mock external dependencies
