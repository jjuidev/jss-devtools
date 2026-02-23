import { existsSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PackageManager } from 'nypm'
import { description, name, version } from './../../../../../package.json';

import { SetupAnswers } from '../types/setup-pkgs'
import { logger } from '../../../utils/logger';
import { getPMExecCommand } from '@/cli/commands/init/utils/pm';

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

interface EslintImports {
	imports: string[]
	plugins: string[]
}



const getEslintTemplate = (answers: SetupAnswers): string => {
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

export const setupFormatter = ({pm, answers}: {pm: PackageManager, answers: SetupAnswers}): void => {
	logger.start('Setting up ESLint and Prettier...')

	const prettierConfig = { ...PRETTIER_BASE_CONFIG }

	if (answers.useTailwind) {
		prettierConfig.plugins.push('prettier-plugin-tailwindcss')
	}

	const prettierrcPath = join(process.cwd(), '.prettierrc.json')

	if (existsSync(prettierrcPath)) {
		logger.info('Overwriting existing .prettierrc.json and delete all others prettier config files')

    // Delete all others eslint config files
    const prettierConfigFiles = [
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.cjs',
      '.prettierrc.mjs',
      '.prettierrc.json',
      '.prettierrc.yaml',
      '.prettierrc.yml',
    ]

    prettierConfigFiles.forEach((file) => {
      const filePath = join(process.cwd(), file)
      if (existsSync(filePath)) {
        rmdirSync(filePath)
        logger.info(`Deleted ${file}`)
      }
    })
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

	const eslintTemplate = getEslintTemplate(answers)
	const eslintConfigPath = join(process.cwd(), 'eslint.config.mjs')

	if (existsSync(eslintConfigPath)) {
		logger.info('Overwriting existing eslint.config.mjs and delete all others eslint config files')

    // Delete all others eslint config files
    const eslintConfigFiles = [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.mjs',
      '.eslintrc.json',
      '.eslintrc.yaml',
      '.eslintrc.yml',
    ]

    eslintConfigFiles.forEach((file) => {
      const filePath = join(process.cwd(), file)
      if (existsSync(filePath)) {
        rmdirSync(filePath)
        logger.info(`Deleted ${file}`)
      }
    })
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

			writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'), 'utf8')
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

