import { confirm, group, select } from '@clack/prompts';
import { defineCommand } from 'citty';
import { detectPackageManager } from 'nypm';

import { Framework, SetupAnswers } from '@/commands/init/types/setup-pkgs';
import { setupAliasImport } from '@/commands/init/utils/setup-alias-import';
import { setupCommitlint } from '@/commands/init/utils/setup-commitlint';
import { setupFormatter } from '@/commands/init/utils/setup-formatter';
import { setupHusky } from '@/commands/init/utils/setup-husky';
import { setupPackages } from '@/commands/init/utils/setup-pkgs';
import { displayBanner } from '@/utils/banner';
import { logger } from '@/utils/logger';

// Valid framework options
const VALID_FRAMEWORKS: Framework[] = ['node', 'react', 'react-native', 'nextjs'];

// Default configuration for non-interactive mode
const DEFAULT_CONFIG = {
	framework: 'node' as Framework,
	tailwind: true,
	storybook: false,
	aliasImport: true
};

const validateFramework = (value: string | undefined): Framework => {
	if (!value) {
		return DEFAULT_CONFIG.framework;
	}

	if (!VALID_FRAMEWORKS.includes(value as Framework)) {
		throw new Error(`Invalid framework '${value}'. Must be: ${VALID_FRAMEWORKS.join(', ')}`);
	}

	return value as Framework;
};

const resolveAnswers = (args: Record<string, unknown>): SetupAnswers => {
	const framework = validateFramework(args.framework as string | undefined);
	const isNonNodeFramework = framework !== 'node';

	return {
		framework,
		useTailwind: Boolean(isNonNodeFramework && (args.tailwind ?? DEFAULT_CONFIG.tailwind)),
		useStorybook: Boolean(isNonNodeFramework && (args.storybook ?? DEFAULT_CONFIG.storybook)),
		useAliasImport: Boolean(args.aliasImport ?? DEFAULT_CONFIG.aliasImport)
	};
};

export const initCommand = defineCommand({
	meta: {
		name: 'init',
		description: 'Initialize a new project'
	},
	args: {
		yes: {
			type: 'boolean',
			alias: 'y',
			description: 'Use default configuration (non-interactive)'
		},
		framework: {
			type: 'string',
			description: 'Target framework (node|react|react-native|nextjs)'
		},
		tailwind: {
			type: 'boolean',
			description: 'Enable Tailwind CSS'
		},
		storybook: {
			type: 'boolean',
			description: 'Enable Storybook'
		},
		aliasImport: {
			type: 'boolean',
			description: 'Enable alias imports'
		}
	},
	run: async ({ args }) => {
		displayBanner();

		const pm = await detectPackageManager(process.cwd());

		if (!pm) {
			throw new Error('No package manager detected.');
		}

		// Detect non-interactive mode: any flag triggers it
		const isNonInteractive =
			args.yes ||
			args.framework !== undefined ||
			args.tailwind !== undefined ||
			args.storybook !== undefined ||
			args.aliasImport !== undefined;

		let answers: SetupAnswers;

		if (isNonInteractive) {
			answers = resolveAnswers(args);
		} else {
			// Interactive mode via clack prompts
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
							});
						}
					},

					useStorybook: ({ results }) => {
						if (results.framework && ['react', 'react-native', 'nextjs'].includes(results.framework)) {
							return confirm({
								initialValue: false,
								message: 'Do you want to use Storybook?'
							});
						}
					},

					useAliasImport: () =>
						confirm({
							message: 'Do you want to use alias import?'
						})
				},
				{
					onCancel: () => {
						logger.warn('Setup cancelled!');
						process.exit(1);
					}
				}
			);

			answers = {
				framework: rawAnswers.framework as Framework,
				useTailwind: rawAnswers.useTailwind === true,
				useStorybook: rawAnswers.useStorybook === true,
				useAliasImport: rawAnswers.useAliasImport === true
			};
		}

		await setupPackages({
			pm,
			answers
		});

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
		]);

		logger.success('Setup completed!');
	}
});
