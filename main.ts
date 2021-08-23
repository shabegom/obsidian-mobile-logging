import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class MobileLogging extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

	}

	onunload() {
		console.log('unloading plugin');
	}

	
}
