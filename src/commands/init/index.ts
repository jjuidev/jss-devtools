import { confirm, group, select } from '@clack/prompts'
import { defineCommand } from 'citty'
import { detectPackageManager } from 'nypm'

import { Framework, SetupAnswers } from '@/commands/init/types/setup-pkgs'
import { setupAliasImport } from '@/commands/init/utils/setup-alias-import'
import { setupCommitlint } from '@/commands/init/utils/setup-commitlint'
import { setupFormatter } from '@/commands/init/utils/setup-formatter'
import { setupHusky } from '@/commands/init/utils/setup-husky'
import { setupPackages } from '@/commands/init/utils/setup-pkgs'
import { displayBanner } from '@/utils/banner'
import { logger } from '@/utils/logger'

export const initCommand = defineCommand({
	meta: {
		name: 'init',
		description: 'Initialize a new project'
	},
	// args: {
	// 	frameWork: {
	// 		type: 'string',
	// 		description: 'Which framework do you want to use?',
	// 		default: 'node'
	// 	}
	// },
	run: async ({ args }) => {
		displayBanner()

		const pm = await detectPackageManager(process.cwd())

		if (!pm) {
			throw new Error('No package manager detected.')
		}

		const rawAnswers = await group(
			{
				framework: () =>
					select({
						message: 'Which framework do you want to use?',
						initialValue: 'node',
						options: [
							{
								value: 'node',
								label: 'Node.js'
							},
							{
								value: 'react',
								label: 'React'
							},
							{
								value: 'react-native',
								label: 'React Native'
							},
							{
								value: 'nextjs',
								label: 'Next.js'
							}
						]
					}),

				useTailwind: ({ results }) => {
					if (results.framework && ['react', 'react-native', 'nextjs'].includes(results.framework)) {
						return confirm({
							message: 'Do you want to use Tailwind CSS?'
						})
					}
				},

				useStorybook: ({ results }) => {
					if (results.framework && ['react', 'react-native', 'nextjs'].includes(results.framework)) {
						return confirm({
							initialValue: false,
							message: 'Do you want to use Storybook?'
						})
					}
				},

				useAliasImport: () =>
					confirm({
						message: 'Do you want to use alias import?'
					})
			},
			{
				onCancel: () => {
					logger.warn('Setup cancelled!')
					process.exit(1)
				}
			}
		)

		const answers: SetupAnswers = {
			framework: rawAnswers.framework as Framework,
			useTailwind: rawAnswers.useTailwind === true,
			useStorybook: rawAnswers.useStorybook === true,
			useAliasImport: rawAnswers.useAliasImport === true
		}

		await setupPackages({
			pm,
			answers
		})

		await Promise.all([
			setupHusky({
				pm,
				answers
			}),
			setupCommitlint({
				pm,
				answers
			}),
			setupFormatter({
				pm,
				answers
			}),
			setupAliasImport({
				pm,
				answers
			})
		])

		logger.success('Setup completed!')
	}
})
