import { existsSync, readFileSync, rmdirSync, writeFileSync } from 'fs'
import { PackageManager } from 'nypm'
import { join } from 'pathe'

import { EslintImports } from '@/commands/init/types/setup-formatter'
import { SetupAnswers } from '@/commands/init/types/setup-pkgs'
import { getPMExecCommand } from '@/commands/init/utils/pm'
import { logger } from '@/utils/logger'
import { name } from './../../../../package.json'

const PRETTIER_BASE_CONFIG = {
	useTabs: true,
	tabWidth: 2,
	printWidth: 120,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: false,
	arrowParens: 'always',
	trailingComma: 'none',
	endOfLine: 'auto',
	plugins: [] as string[]
}

export const setupFormatter = ({ pm, answers }: { pm: PackageManager; answers: SetupAnswers }): void => {
	logger.start('Setting up ESLint and Prettier...')

	const prettierConfig = { ...PRETTIER_BASE_CONFIG }

	if (answers.useTailwind) {
		prettierConfig.plugins.push('prettier-plugin-tailwindcss')
	}

	const prettierrcPath = join(process.cwd(), '.prettierrc.json')

	if (existsSync(prettierrcPath)) {
		logger.info('Overwriting existing .prettierrc.json')
	}

	try {
		const prettierConfigTemplate = JSON.stringify(prettierConfig, null, '\t')
		writeFileSync(prettierrcPath, prettierConfigTemplate, 'utf8')
		logger.success(`Created .prettierrc.json`)
	} catch (error) {
		logger.error('Failed to update .prettierrc.json')
		if (error instanceof Error) {
			logger.error(error.message)
		}
	}

	const getEslintTemplate = (): string => {
		const getEslintImports = (): EslintImports => {
			const imports: string[] = ['defineEslintConfig', 'eslintConfigNode']
			const plugins: string[] = []

			switch (answers.framework) {
				case 'react':
					imports.push('pluginReact')
					plugins.push('pluginReact()')
					break

				case 'react-native':
					// imports.push('pluginReactNative');
					// plugins.push('pluginReactNative()');
					break

				case 'nextjs':
					imports.push('pluginNext')
					plugins.push('pluginNext()')
					break

				default:
					break
			}

			if (answers.useStorybook) {
				imports.push('pluginStorybook')
				plugins.push('pluginStorybook()')
			}

			return {
				imports,
				plugins
			}
		}

		const { imports, plugins } = getEslintImports()

		const importLine = `import { ${imports.join(', ')} } from '${name}';`

		const configArgs = ['eslintConfigNode', ...plugins].join(', ')

		const eslintTemplate = `
${importLine}

const eslintConfig = defineEslintConfig(${configArgs});

export default eslintConfig;`

		return eslintTemplate
	}
	const eslintTemplate = getEslintTemplate()
	const eslintConfigPath = join(process.cwd(), 'eslint.config.mjs')

	if (existsSync(eslintConfigPath)) {
		logger.info('Overwriting existing eslint.config.mjs')
	}

	writeFileSync(eslintConfigPath, eslintTemplate, 'utf8')
	logger.success(`Created eslint.config.mjs`)

	// Update package.json with scripts and lint-staged config
	const packageJsonPath = join(process.cwd(), 'package.json')

	if (existsSync(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

			if (!packageJson.scripts) {
				packageJson.scripts = {}
			}

			packageJson.scripts.format =
				'eslint --fix "src/**/*.{js,ts,jsx,tsx}" && prettier --write "src/**/*.{js,ts,jsx,tsx}"'

			if (!packageJson['lint-staged']) {
				packageJson['lint-staged'] = {}
			}

			packageJson['lint-staged']['src/**/*.{js,ts,jsx,tsx}'] = ['eslint --fix', 'prettier --write']
			packageJson['lint-staged']['package.json'] = [`${getPMExecCommand(pm)} prettier-package-json --write`]

			writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'))
			logger.success('Updated package.json with scripts and lint-staged config')
		} catch (error) {
			logger.error('Could not update package.json')
			if (error instanceof Error) {
				logger.error(error.message)
			}
		}
	}

	logger.success('ESLint and Prettier configured\n')
}
