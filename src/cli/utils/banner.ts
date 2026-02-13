import figlet from 'figlet';
import { CLI_META, colors } from './constants';

let cachedBanner: string | null = null;
let bannerDisplayed = false;

export const getBanner = (): string => {
	if (cachedBanner) return cachedBanner;

	try {
		cachedBanner = figlet.textSync(CLI_META.name, {
			font: 'Standard',
			horizontalLayout: 'default',
			verticalLayout: 'default'
		});
	} catch {
		cachedBanner = CLI_META.name;
	}

	return cachedBanner;
};

export const displayBanner = (): void => {
	if (bannerDisplayed) return;
	bannerDisplayed = true;

	const banner = getBanner();
	console.log(colors.primary(banner));
	console.log(colors.muted(CLI_META.tagline));
	console.log();
};
