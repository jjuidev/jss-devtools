import { existsSync, writeFileSync } from 'fs'
import { PackageManager } from 'nypm'
import { join } from 'pathe'

import { SetupAnswers } from '@/commands/init/types/setup-pkgs'
import { logger } from '@/utils/logger'
import { name } from './../../../../package.json'

export const setupCommitlint = ({ pm, answers }: { pm: PackageManager; answers: SetupAnswers }) => {
	try {
		logger.info('Setting up Commitlint...')

		const commitlintrcPath = join(process.cwd(), '.commitlintrc.cjs')

		if (existsSync(commitlintrcPath)) {
			logger.info('Overwriting existing .commitlintrc.cjs')
		}

		const commitlintConfigTemplate = `const { commitlintConfigRecommend } = require('${name}');

module.exports = commitlintConfigRecommend;
`

		writeFileSync(commitlintrcPath, commitlintConfigTemplate, 'utf8')
		logger.success(`Created .commitlintrc.cjs`)
	} catch (error) {
		logger.error('Failed to setup commitlint')
		if (error instanceof Error) {
			logger.error(error.message)
		}
	}
}
