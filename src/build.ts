import { $ } from 'bun'
import { cp, readFile, writeFile } from 'fs/promises'
import { join } from 'pathe'

import { logger } from '@/utils/logger'

const writePackageJson = async (type: 'cjs' | 'esm', dir: string) => {
	const pkgType = JSON.stringify({ type: type === 'esm' ? 'module' : 'commonjs' }, null, 2)
	await writeFile(join(dir, 'package.json'), pkgType)
}

const EXTERNAL_DEPS = [
	'consola',

	'husky',
	'lint-staged',

	'@commitlint/cli',
	'@commitlint/config-conventional',

	'prettier',
	'eslint',
	'@eslint/js',
	'globals',
	'typescript-eslint',

	'eslint-config-prettier',
	'eslint-plugin-autofix',
	'eslint-plugin-import',
	'eslint-plugin-prefer-arrow-functions',

	'eslint-plugin-react',
	'eslint-plugin-react-hooks',
	'eslint-plugin-react-native',
	'eslint-plugin-tailwindcss',
	'prettier-plugin-tailwindcss',
	'eslint-plugin-storybook',

	'@next/eslint-plugin-next'
]

const buildCJS = async () => {
	logger.log('Building CJS...')

	const result = await Bun.build({
		entrypoints: ['./src/index.ts'],
		outdir: './dist/cjs',
		target: 'node',
		format: 'cjs',
		naming: '[name].cjs',
		external: EXTERNAL_DEPS
	})

	if (!result.success) {
		throw new Error('CJS build failed: ' + result.logs.map((l) => l.message).join(', '))
	}

	await $`tsc -p tsconfig.cjs.json`
	await $`tsc-alias -p tsconfig.cjs.json`
	await writePackageJson('cjs', 'dist/cjs')

	logger.log('CJS done!')
}

const buildESM = async () => {
	logger.log('Building ESM...')

	const result = await Bun.build({
		entrypoints: ['./src/index.ts'],
		outdir: './dist/esm',
		target: 'node',
		format: 'esm',
		external: EXTERNAL_DEPS
	})

	if (!result.success) {
		throw new Error('ESM build failed: ' + result.logs.map((l) => l.message).join(', '))
	}

	await $`tsc -p tsconfig.esm.json`
	await $`tsc-alias -p tsconfig.esm.json`
	await writePackageJson('esm', 'dist/esm')

	logger.log('ESM done!')
}

const buildCLI = async () => {
	logger.log('Building CLI...')

	const result = await Bun.build({
		entrypoints: ['./src/cli.ts'],
		outdir: './dist/cli',
		target: 'node',
		format: 'esm',
		external: EXTERNAL_DEPS
	})

	if (!result.success) {
		throw new Error('CLI build failed: ' + result.logs.map((l) => l.message).join(', '))
	}

	await $`tsc -p tsconfig.cli.json`
	await $`tsc-alias -p tsconfig.cli.json`
	await writePackageJson('esm', 'dist/cli')

	const finalizeCLI = async () => {
		const cliPaths = ['dist/cli/cli.js']
		for (const cliPath of cliPaths) {
			const content = await readFile(cliPath, 'utf-8')
			if (!content.startsWith('#!/usr/bin/env node')) {
				await writeFile(cliPath, '#!/usr/bin/env node\n' + content)
			}
		}

		await Promise.all([$`chmod +x dist/cli/cli.js`])

		logger.log('CLI done!')
	}
	await finalizeCLI()
}

const copyFonts = async () => {
	logger.log('Copying figlet fonts...')
	const fontsSrc = join('node_modules', 'figlet', 'fonts')
	await cp(fontsSrc, 'dist/fonts', { recursive: true })
	logger.log('Fonts copied')
}

const build = async () => {
	copyFonts()

	await $`rimraf dist`
	await Promise.all([buildCJS(), buildESM(), buildCLI()])
	logger.log('Build complete!')
}

build().catch(logger.error)
