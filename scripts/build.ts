import { $ } from 'bun';
import { readFile, writeFile, cp } from 'fs/promises';
import { join } from 'path';

const buildPackageJson = (type: 'cjs' | 'esm') => ({
	type: type === 'esm' ? 'module' : 'commonjs'
});

const writePackageJson = async (type: 'cjs' | 'esm', dir: string) => {
	const pkg = buildPackageJson(type);
	await writeFile(join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
};

const buildCJS = async () => {
	console.log('Building CJS...');

	const result = await Bun.build({
		entrypoints: ['./src/index.ts'],
		outdir: './dist/cjs',
		target: 'node',
		format: 'cjs',
		naming: '[name].cjs'
	});

	if (!result.success) {
		throw new Error('CJS build failed: ' + result.logs.map((l) => l.message).join(', '));
	}

	await $`tsc -p tsconfig.cjs.json`;
	await writePackageJson('cjs', 'dist/cjs');

	console.log('CJS done');
};

const buildESM = async () => {
	console.log('Building ESM...');

	const result = await Bun.build({
		entrypoints: ['./src/index.ts'],
		outdir: './dist/esm',
		target: 'node',
		format: 'esm'
	});

	if (!result.success) {
		throw new Error('ESM build failed: ' + result.logs.map((l) => l.message).join(', '));
	}

	await $`tsc -p tsconfig.esm.json`;
	await writePackageJson('esm', 'dist/esm');

	console.log('ESM done');
};

const finalizeCLI = async () => {
	console.log('Updating shebang...');

	const cliPaths = ['dist/cjs/index.cjs', 'dist/esm/index.js'];
	for (const cliPath of cliPaths) {
		const content = await readFile(cliPath, 'utf-8');
		if (!content.startsWith('#!/usr/bin/env node')) {
			await writeFile(cliPath, '#!/usr/bin/env node\n' + content);
		}
	}

	await Promise.all([$`chmod +x dist/esm/index.js`, $`chmod +x dist/cjs/index.cjs`]);

	console.log('CLI done');
};

const copyFonts = async () => {
	console.log('Copying figlet fonts...');
	const fontsSrc = join('node_modules', 'figlet', 'fonts');
	await cp(fontsSrc, 'dist/fonts', { recursive: true });
	console.log('Fonts copied');
};

const clean = async () => {
	console.log('Cleaning dist...');
	await $`rimraf dist`;
};

const build = async () => {
	await clean();
	await Promise.all([buildCJS(), buildESM()]);
	await finalizeCLI();
	await copyFonts();
	console.log('Build complete!');
};

build().catch(console.error);
