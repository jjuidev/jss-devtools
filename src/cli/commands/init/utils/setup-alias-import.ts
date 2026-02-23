import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { logger } from '../../../utils/logger';
import { SetupAnswers } from '../types/setup-pkgs';
import { PackageManager } from 'nypm';

export const setupAliasImport = ({pm, answers}: {pm: PackageManager, answers: SetupAnswers}) => {
	if (!answers.useAliasImport) {
		return;
	}
	
	logger.info('Setting up TypeScript alias imports...')

	const tsconfigPath = join(process.cwd(), 'tsconfig.json')

	if (!existsSync(tsconfigPath)) {
		logger.warn('tsconfig.json not found. Skipping TypeScript alias setup.')
		return
	}

	try {
		const tsconfigContent = readFileSync(tsconfigPath, 'utf8')
		const tsconfig = JSON.parse(tsconfigContent)

		// Initialize compilerOptions if it doesn't exist
		if (!tsconfig.compilerOptions) {
			tsconfig.compilerOptions = {}
		}

		// Add or update baseUrl and paths
		tsconfig.compilerOptions.baseUrl = 'src'
		tsconfig.compilerOptions.paths = {
			'@/*': ['./*']
		}

		// Write back to file with proper formatting
		writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, '\t'), 'utf8')
		logger.success(`Updated tsconfig.json with alias imports`)
	} catch (error) {
		logger.error('Failed to update tsconfig.json')

		if (error instanceof Error) {
			logger.error(error.message)
		}
	}
}
