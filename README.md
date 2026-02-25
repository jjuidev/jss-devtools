# @jjuidev/jss-devtools

Development tools CLI for JavaScript stack like React, React Native, NextJS, Nest, etc.

## Quick Start

- Support npm, yarn, pnpm, bun package manager.

```bash
npm install --save-dev @jjuidev/jss-devtools
npx @jjuidev/jss-devtools init
```

## Commands

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `jss-devtools`      | Display banner and help           |
| `jss-devtools init` | Initialize project with dev tools |
| `jss-devtools ls`   | List available commands           |

### `init` Command

Setup that configures your project with:

- **Framework selection**: Node.js, React, React Native, Next.js
- **Tailwind CSS** support (conditional)
- **Storybook** support (conditional)
- **TypeScript alias imports** (`@/*` paths)
- **Husky** git hooks (`pre-commit`, `commit-msg`, `prepare-commit-msg`)
- **Commitlint** with emoji-based commit types
- **ESLint + Prettier** configuration

#### Interactive Mode

```bash
# Interactive prompts (default)
jss-devtools init

# or using npx/yarn/pnpm/bunx
npx @jjuidev/jss-devtools init
```

#### Non-Interactive Mode

For CI/CD pipelines and automation scripts:

```bash
# Use default configuration
jss-devtools init -y

# Specify framework
jss-devtools init --framework react

# Full control with all flags
jss-devtools init --framework nextjs --tailwind --storybook --aliasImport
```

**Available Flags:**

| Flag            | Alias | Type    | Description                                                 |
| --------------- | ----- | ------- | ----------------------------------------------------------- |
| `--yes`         | `-y`  | boolean | Use default configuration                                   |
| `--framework`   |       | string  | Target framework: `node`, `react`, `react-native`, `nextjs` |
| `--tailwind`    |       | boolean | Enable Tailwind CSS                                         |
| `--storybook`   |       | boolean | Enable Storybook                                            |
| `--aliasImport` |       | boolean | Enable alias imports (`@/*`)                                |

**Default Configuration (when using `-y`):**

```json
{
	"framework": "node",
	"tailwind": true,
	"storybook": false,
	"aliasImport": true
}
```

## Library Exports

This package also exports reusable config helpers:

### Commitlint Config

```javascript
const { commitlintConfigRecommend, defineCommitlintConfig } = require('@jjuidev/jss-devtools');

// Option 1: Use recommended config
module.exports = commitlintConfigRecommend;

// Option 2: Customize config
module.exports = defineCommitlintConfig((emojiList) => {
	return emojiList.filter((item) => item.type !== 'wip');
});
```

### ESLint Config Helpers

```javascript
const { defineEslintConfig, eslintConfigNode } = require('@jjuidev/jss-devtools');

// Use with ESLint flat config
export default defineEslintConfig({
	...eslintConfigNode
	// your custom rules
});
```

## License

MIT

## Author

jjuidev <hi@jjuidev.com>
