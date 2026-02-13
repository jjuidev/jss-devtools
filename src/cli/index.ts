import { defineCommand, runMain } from 'citty';
import { description, name, version } from '../../package.json';
import { initCommand, lsCommand } from './commands';
import { displayBanner } from './utils/banner';

const main = defineCommand({
	meta: {
		name,
		version,
		description
	},
	subCommands: {
		ls: lsCommand,
		init: initCommand
	},
	async run() {
		displayBanner();
		console.log(`Run ${name} --help for available commands.`);
	}
});

runMain(main);
