import { MarkdownView, Plugin, Vault, Workspace, WorkspaceLeaf, Notice } from 'obsidian';
import MindmapView from './mindmap-view';
import { MM_VIEW_TYPE } from './constants';
import { MindMapSettings } from './settings';
import { MindMapSettingsTab } from './settings-tab';

export default class MindMap extends Plugin {
    vault: Vault;
    workspace: Workspace;
    mindmapView: MindmapView;
    settings: MindMapSettings;

    async onload() {
        console.log('Loading Mind Map plugin');
        this.vault = this.app.vault;
        this.workspace = this.app.workspace;
        this.settings = Object.assign(
            {
                splitDirection: 'Horizontal',
                nodeMinHeight: 16,
                lineHeight: '1em',
                spacingVertical: 5,
                spacingHorizontal: 80,
                paddingX: 8,
            },
            await this.loadData(),
        );

        this.registerView(
            MM_VIEW_TYPE,
            (leaf: WorkspaceLeaf) =>
                (this.mindmapView = new MindmapView(
                    this.settings,
                    leaf,
                    this.workspace.getActiveViewOfType(MarkdownView),
                )),
        );

        this.addCommand({
            id: 'app:markmap-preview',
            name: 'Preview the current note as a Mind Map',
            callback: () => this.markMapPreview(),
            hotkeys: [],
        });

        this.addSettingTab(new MindMapSettingsTab(this.app, this));
    }

    markMapPreview() {
        const view = this.workspace.getActiveViewOfType(MarkdownView);
        if (!view) new Notice('Unsupported file to preview, must be MarkdownView');
        this.initPreview(view);
    }

    initPreview(view: MarkdownView | null) {
        if (this.app.workspace.getLeavesOfType(MM_VIEW_TYPE).length > 0) {
            new Notice('Only a single mind map is supported at a time');
            return;
        }
        if (!view) return;
        const preview = this.app.workspace.getLeaf('split', this.settings.splitDirection);
        const mmPreview = new MindmapView(this.settings, preview, view);
        preview.open(mmPreview);
    }

    onunload() {
        console.log('Unloading Mind Map plugin');
    }
}
