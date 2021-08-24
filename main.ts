import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';


export default class MobileLogging extends Plugin {

	async onload() {
		console.log('loading mobile logging plugin');
		if (this.app.isMobile) {
		monkeyPatchConsole(this)

		this.addCommand({
			id: 'open-console-log',
			name: 'Console Log',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new ConsoleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});
	}

	}

	onunload() {
		console.log('unloading mobile logging plugin');
	}

	
}

// Call this method inside your plugin's `onLoad` function
async function monkeyPatchConsole(plugin: Plugin) {
	const logs: string[] = [];
	const logMessages = (prefix: string) => async (...messages: unknown[]) => {
	const logTFile = plugin.app.vault.getAbstractFileByPath('Log.md') as TFile;
	const logFileContent = await plugin.app.vault.read(logTFile)
	  logs.push(`\n[${prefix}]`);
	  for (const message of messages) {
		logs.push(String(message));
	  }

	await plugin.app.vault.modify(logTFile, logs.join(" "))
	};
  
	console.debug = logMessages("debug");
	console.error = logMessages("error");
	console.info = logMessages("info");
	console.log = logMessages("log");
	console.warn = logMessages("warn");
  }

class ConsoleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let logValue = ""
		let {contentEl} = this;
		contentEl.setText('Enter Log');
		new Setting(contentEl).addTextArea((component) => {
			component.onChange(val => {
				logValue = val
			})
		})
		new Setting(contentEl).addButton(component => {
			component.setButtonText('Submit')
			component.onClick(e => {
				const func = Function(`return ${logValue}`)
				const value = func()
				if (typeof value === 'object') {
					console.log(JSON.stringify(value, null, 2))
				} else {
					console.log(value)
				}
				
				this.close()
			})
		})
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}
