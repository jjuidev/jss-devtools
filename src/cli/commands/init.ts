import { defineCommand } from 'citty';
import { colors } from '../utils/constants';
import { displayBanner } from '../utils/banner';

export const initCommand = defineCommand({
	meta: {
		name: 'init',
		description: 'Initialize a new project',
	},
	async run() {
		displayBanner();
		console.log(colors.warning('Initializing project...'));
		console.log(colors.muted('[Placeholder - coming soon]'));
	},
});
