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

Interactive setup that configures your project with:

- **Framework selection**: Node.js, React, React Native, Next.js
- **Tailwind CSS** support (conditional)
- **Storybook** support (conditional)
- **TypeScript alias imports** (`@/*` paths)
- **Husky** git hooks (`pre-commit`, `commit-msg`, `prepare-commit-msg`)
- **Commitlint** with emoji-based commit types
- **ESLint + Prettier** configuration

```bash
# bin CLI
jss --help
# or
npx @jjuidev/jss-devtools
# or
yarn dlx @jjuidev/jss-devtools
# or
pnpm exec @jjuidev/jss-devtools
# or
bunx @jjuidev/jss-devtools
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
