import { addDependency, addDevDependency, installDependencies, PackageManager } from 'nypm';

import { PackageToInstall, SetupAnswers } from '../types/setup-pkgs';

export const setupPackages = async ({pm, answers}: {pm: PackageManager, answers: SetupAnswers}) => {

	const commonDependencies: PackageToInstall[] = [
		{
			name: 'typescript',
			dev: true
		},
		{
			name: 'husky',
			dev: true
		},
		{
			name: 'lint-staged',
			dev: true
		}
	];

	const commitlintDependencies: PackageToInstall[] = [
		{
			name: '@commitlint/cli',
			dev: true
		},
		{
			name: '@commitlint/config-conventional',
			dev: true
		}
	];

	const formatterDependencies: PackageToInstall[] = [
		{
			name: 'prettier',
			dev: true
		},
		{
			name: 'eslint',
			dev: true
		},
		{
			name: '@eslint/js',
			dev: true
		},
		{
			name: 'globals',
			dev: true
		},
		{
			name: 'typescript-eslint',
			dev: true
		},
		{
			name: 'eslint-config-prettier',
			dev: true
		},
		{
			name: 'eslint-plugin-autofix',
			dev: true
		},
		{
			name: 'eslint-plugin-import',
			dev: true
		},
		{
			name: 'eslint-plugin-prefer-arrow-functions',
			dev: true
		},

		// Dependencies by answers
		{
			name: ['eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-react-native'],
			dev: true,
			condition: (answers: SetupAnswers) => ['react', 'react-native', 'nextjs'].includes(answers.framework)
		},
		{
			name: '@next/eslint-plugin-next',
			dev: true,
			condition: (answers: SetupAnswers) => ['nextjs'].includes(answers.framework)
		},
		{
			name: ['eslint-plugin-tailwindcss', 'prettier-plugin-tailwindcss'],
			dev: true,
			condition: (answers: SetupAnswers) => answers.useTailwind === true
		},
		{
			name: 'eslint-plugin-storybook',
			dev: true,
			condition: (answers: SetupAnswers) => answers.useStorybook === true
		}
	];

	const setupConditionalPackages = (...pkgs: PackageToInstall[]) => {
		return pkgs.filter((dep) => {
			if (dep.condition) {
				return dep.condition(answers);
			}

			return true;
		});
	};
	const allDependencies: PackageToInstall[] = setupConditionalPackages(
		...commonDependencies,
		...commitlintDependencies,
		...formatterDependencies
	);

	const devDependencies = allDependencies.filter((dep) => dep.dev);
	const dependencies = allDependencies.filter((dep) => !dep.dev);

	const devDependencyNames = devDependencies.map((dep) => dep.name).flat();
	const dependencyNames = dependencies.map((dep) => dep.name).flat();

	addDependency(dependencyNames);
	addDevDependency(devDependencyNames);
	installDependencies();
};
