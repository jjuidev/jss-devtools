import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { PackageManager } from 'nypm'
import { join } from 'pathe'

import { SetupAnswers } from '@/cli/commands/init/types/setup-pkgs'
import { getPMExecCommand } from '@/cli/commands/init/utils/pm'
import { logger } from '@/cli/utils/logger'

export const setupHusky = async ({ pm, answers }: { pm: PackageManager; answers: SetupAnswers }) => {
	try {
		logger.info('Initializing Husky...')

		const getHuskyInitCommand = (pm: PackageManager): string => `${getPMExecCommand(pm)} husky init`

		execSync(getHuskyInitCommand(pm))
		const huskyDir = join(process.cwd(), '.husky')
		if (!existsSync(huskyDir)) {
			mkdirSync(huskyDir)
		}

		const getHuskyHookContent = (hookName: string, pm: PackageManager): string => {
			switch (hookName) {
				case 'prepare-commit-msg':
					return `#!/bin/sh
${getPMExecCommand(pm)} devmoji --edit --lint --config ./.commitlintrc.cjs`
				case 'commit-msg':
					return `#!/bin/sh
${getPMExecCommand(pm)} --no -- commitlint --edit $1`
				case 'pre-commit':
					return `#!/bin/sh
${getPMExecCommand(pm)} lint-staged`
				default:
					return ''
			}
		}

		const hooks: string[] = ['prepare-commit-msg', 'commit-msg', 'pre-commit']
		logger.info('Creating git hooks...\n')

		hooks.forEach((name) => {
			const hookPath = join(huskyDir, name)
			writeFileSync(hookPath, getHuskyHookContent(name, pm), { mode: 0o755 })
			logger.info(`Created ${name} hook`)
		})

		logger.success('Husky initialized with git hooks\n')
	} catch (error) {
		logger.error('Failed to setup husky')
		if (error instanceof Error) {
			logger.error(error.message)
		}
	}
}
