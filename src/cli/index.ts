import { defineCommand, runMain } from 'citty'

import { initCommand, lsCommand } from '@/cli/commands'
import { displayBanner } from '@/cli/utils/banner'

import { description, name, version } from '../../package.json'

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
	run: async () => {
		displayBanner()
		console.log(`Run ${name} --help for available commands.`)
	}
})

runMain(main)
