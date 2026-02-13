import { defineCommand } from 'citty';
import { colors } from '../utils/constants';
import { displayBanner } from '../utils/banner';

export const lsCommand = defineCommand({
	meta: {
		name: 'ls',
		description: 'List all available commands'
	},
	async run() {
		displayBanner();
		console.log(colors.text('Available commands:\n'));
		console.log(colors.primary('  ls') + colors.muted('   - List all available commands'));
		console.log(colors.primary('  init') + colors.muted('  - Initialize a new project'));
		console.log();
	}
});
