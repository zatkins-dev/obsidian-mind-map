import { App, PluginSettingTab, Setting, SplitDirection } from 'obsidian';
import MindMap from './main';

export class MindMapSettingsTab extends PluginSettingTab {
    plugin: MindMap;
    constructor(app: App, plugin: MindMap) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Preview split')
            .setDesc('Split direction for the mind map preview')
            .addDropdown((dropDown) =>
                dropDown
                    .addOption('horizontal', 'Horizontal')
                    .addOption('vertical', 'Vertical')
                    .setValue(this.plugin.settings.splitDirection || 'horizontal')
                    .onChange(async (value: string) => {
                        this.plugin.settings.splitDirection = value as SplitDirection;
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );

        new Setting(containerEl)
            .setName('Node minimum height')
            .setDesc('Minimum height for the mind map nodes')
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.nodeMinHeight?.toString())
                    .setPlaceholder('Example: 16')
                    .onChange(async (value: string) => {
                        this.plugin.settings.nodeMinHeight = Number.parseInt(value);
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );

        new Setting(containerEl)
            .setName('Node text line height')
            .setDesc('Line height for content in mind map nodes')
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.lineHeight?.toString())
                    .setPlaceholder('Example: 1em')
                    .onChange(async (value: string) => {
                        this.plugin.settings.lineHeight = value;
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );

        new Setting(containerEl)
            .setName('Vertical spacing')
            .setDesc('Vertical spacing of the mind map nodes')
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.spacingVertical?.toString())
                    .setPlaceholder('Example: 5')
                    .onChange(async (value: string) => {
                        this.plugin.settings.spacingVertical = Number.parseInt(value);
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );

        new Setting(containerEl)
            .setName('Horizontal spacing')
            .setDesc('Horizontal spacing of the mind map nodes')
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.spacingHorizontal?.toString())
                    .setPlaceholder('Example: 80')
                    .onChange(async (value: string) => {
                        this.plugin.settings.spacingHorizontal = Number.parseInt(value);
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );

        new Setting(containerEl)
            .setName('Horizontal padding')
            .setDesc('Leading space before the content of mind map nodes')
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.paddingX?.toString())
                    .setPlaceholder('Example: 8')
                    .onChange(async (value: string) => {
                        this.plugin.settings.paddingX = Number.parseInt(value);
                        await this.plugin.saveData(this.plugin.settings);
                    }),
            );
    }
}
