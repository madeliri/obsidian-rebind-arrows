import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!
// adaptation from https://gist.github.com/danihodovic/7a8c55cc53c3d4c4790a08959a96998c

interface MyPluginSettings {
	arrowDown: string;
	arrowUp: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	arrowDown: 'KeyJ',
	arrowUp: 'KeyK'
}


// return true when pressed any key on select screen (Command Pallete/Quick Switcher) or when popup selecter exists (like [[]])
function isKeyRelevant(document: Document, event: KeyboardEvent) {
	return document.activeElement && (document.activeElement.hasClass('prompt-input') || document.querySelector('.suggestion-container')) && event.ctrlKey
}



export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const arrowDown_key = this.settings.arrowDown
		const arrowUp_key = this.settings.arrowUp

		// custom keys to select
		document.addEventListener('keydown',(e) =>{
			if (isKeyRelevant(document, e) && e.code == "KeyJ"){
				e.preventDefault();
				document.dispatchEvent(new KeyboardEvent("keydown",{"key":"ArrowDown","code":"ArrowDown"}))
			}
		});

		document.addEventListener('keydown',(e) =>{
			if (isKeyRelevant(document, e) && e.code == "KeyK"){
				e.preventDefault();
				document.dispatchEvent(new KeyboardEvent("keydown",{"key":"ArrowUp","code":"ArrowUp"}))
			}
		});
		
	
		// This creates an icon in the left ribbon.


		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// settings
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// down key
		new Setting(containerEl)
			.setName('Binding for down arrow')
			.setDesc('by default "KeyJ"')
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.arrowDown)
				.onChange(async (value) => {
					this.plugin.settings.arrowDown = value;
					await this.plugin.saveSettings();
				}))
		
		// up key
		new Setting(containerEl)
			.setName('Binding for up arrow')
			.setDesc('by default "KeyK"')
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.arrowUp)
				.onChange(async (value) => {
					this.plugin.settings.arrowUp = value;
					await this.plugin.saveSettings();
				}))
		;
	}
}
