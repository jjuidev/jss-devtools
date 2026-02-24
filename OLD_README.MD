# @jjuidev/node-devtools

Interactive devtools setup for Node.js projects with ESLint, Prettier, Commitlint, Husky, and Lint-staged.

## Features

- Interactive CLI setup with framework detection
- Auto-install dependencies based on your project needs
- Support for React, Next.js, React Native, Tailwind CSS, and Storybook
- Git hooks with Husky and Lint-staged
- Commitlint with devmoji support
- Zero-config defaults for quick setup

## Quick Start

```bash
npm install --save-dev @jjuidev/node-devtools
# or
yarn add --dev @jjuidev/node-devtools
# or
pnpm add -D @jjuidev/node-devtools
```

Then run the interactive setup:

```bash
npx node-devtools
# or
yarn node-devtools
# or
pnpm node-devtools
```

The CLI will ask you questions about your project and automatically install the necessary dependencies.

## Commands

### Interactive Setup (Recommended)

```bash
npx node-devtools
```

This command will:

1. Ask about your project setup (React, Next.js, Tailwind, etc.)
2. Automatically install all required dependencies
3. Detect your package manager (npm, yarn, pnpm, bun)
4. Install ESLint, Prettier, Husky, Lint-staged, and related plugins

### Non-Interactive Setup

For CI/CD pipelines and automation, you can use non-interactive mode with CLI flags or stdin input:

#### Using CLI Flags

```bash
# With specific options
npx node-devtools --framework react --tailwind yes --storybook no --alias yes --gitignore yes

# Accept all defaults
npx node-devtools -y

# Mixed mode (some flags + prompts for rest)
npx node-devtools --framework next --tailwind yes
```

**Available flags:**

- `--framework <type>` - Framework: node, react, react-native, next
- `--tailwind <bool>` - Use Tailwind CSS (yes/no)
- `--storybook <bool>` - Use Storybook (yes/no)
- `--alias <bool>` - Use TypeScript alias imports (yes/no)
- `--gitignore <bool>` - Add .gitignore file (yes/no)
- `-y, --yes` - Accept all defaults
- `--non-interactive` - Force non-interactive mode

#### Using Stdin (Piped Input)

```bash
# Provide answers via stdin (one per line)
echo -e "react\nyes\nno\nyes\nyes" | npx node-devtools

# From a file
cat answers.txt | npx node-devtools
```

**Input order for stdin:**

1. Framework (node/react/react-native/next or 1-4)
2. Use Tailwind? (yes/no) - only for react/next
3. Use Storybook? (yes/no) - only for react/next
4. Use TypeScript alias? (yes/no)
5. Add .gitignore? (yes/no)

**Note:** Tailwind and Storybook prompts are skipped for node and react-native frameworks.

### Manual Setup

The interactive command configures everything (Commitlint, ESLint, Prettier, Husky, Lint-staged). There are no separate `setup` or `init` subcommands in the current version. Use the interactive flow:

```bash
npx node-devtools
```

## What Gets Installed?

### Base Packages (Always)

- `husky` - Git hooks
- `lint-staged` - Run linters on staged files
- `eslint` - JavaScript linter
- `prettier` - Code formatter
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint rules
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `eslint-config-prettier` - Disable ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Run Prettier as an ESLint rule
- `prettier-plugin-packagejson` - Sort package.json

### Conditional Packages (Based on Your Answers)

- **React**: `eslint-plugin-react`, `eslint-plugin-react-hooks`
- **Next.js**: `@next/eslint-plugin-next`
- **React Native**: `eslint-plugin-react-native`
- **Tailwind CSS**: `eslint-plugin-tailwindcss`, `prettier-plugin-tailwindcss`
- **Storybook**: `eslint-plugin-storybook`

## Usage

### Option 1: Use the recommended configuration

Create `.commitlintrc.cjs`:

```javascript
const { commitlintConfigRecommend } = require('@jjuidev/node-devtools')

module.exports = commitlintConfigRecommend
```

### Option 2: Customize the configuration

Create `.commitlintrc.cjs`:

```javascript
const { defineCommitlintConfig } = require('@jjuidev/node-devtools')

module.exports = defineCommitlintConfig((emojiList) => {
	// Add or modify emoji types
	return emojiList.filter((item) => item.type !== 'wip')
})
```

### Example: Add custom emoji types

```javascript
const { defineCommitlintConfig } = require('@jjuidev/node-devtools')

module.exports = defineCommitlintConfig((emojiList) => {
	return [
		...emojiList,
		{
			type: 'docker',
			code: ':docker:',
			emoji: ':whale:',
			description: 'Docker related changes'
		}
	]
})
```

## Complete Setup Flow

1. **Install the package**

   ```bash
   npm install --save-dev @jjuidev/node-devtools
   ```

2. **Run interactive setup**

   ```bash
   npx node-devtools
   ```

   Answer the questions about your project setup.

3. **Start committing!**
   ```bash
   git commit -m "feat: add new feature"
   ```
   Hooks are set up automatically; your commit will be validated and emoji will be added!

## Supported Commit Types

The recommended configuration includes the following commit types:

- `init` :tada: - Initialize project
- `feat` :sparkles: - Add new feature
- `fix` :bug: - Fix a bug
- `chore` :wrench: - Minor tasks or maintenance
- `docs` :memo: - Update documentation
- `style` :lipstick: - Improve UI or code style
- `improve` :rocket: - Improve code quality or performance
- `refactor` :recycle: - Refactor code without changing logic
- `perf` :zap: - Enhance performance
- `test` :white_check_mark: - Add or update tests
- `build` :building_construction: - Changes related to the build system
- `ci` :repeat: - Configure CI/CD
- `revert` :rewind: - Revert a previous commit
- `merge` :twisted_rightwards_arrows: - Merge branches
- `wip` :construction: - Work in progress
- `release` :rocket: - Release a new version
- `upgrade` :arrow_up: - Upgrade dependencies or software
- `downgrade` :arrow_down: - Downgrade dependencies or software
- `bump` :package: - Bump package version
- `security` :lock: - Improve security
- `hotfix` :fire: - Urgent bug fix
- `maintainer` :crown: - Maintainer commit and excellent handle for system

## Package Manager Detection

The CLI automatically detects your package manager based on lock files:

- `bun.lockb` → Bun
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → Yarn
- Default → npm

## TypeScript Support

The package includes TypeScript type definitions:

```typescript
import type { CommitlintConfig, CommitEmoji } from '@jjuidev/node-devtools'
```

## Contributing

We use [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Quick Start for Contributors

```bash
# Make your changes
npm run build

# Create a changeset
npm run changeset

# Commit your changes
git commit -m "feat: your feature"
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed workflow.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT

## Author

jjuidev <jjuidev@gmail.com>
