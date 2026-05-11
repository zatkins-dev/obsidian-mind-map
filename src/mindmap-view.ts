import { EventRef, ItemView, MarkdownView, Menu, MenuItem, Vault, Workspace, WorkspaceLeaf } from 'obsidian';
import { Transformer } from 'markmap-lib';
import { FRONT_MATTER_REGEX, MM_VIEW_TYPE } from './constants';
import ObsidianMarkmap from './obsidian-markmap-plugin';
import { createSVG } from './markmap-svg';
import { copyImageToClipboard } from './copy-image';
import { saveSVG } from './save-svg';
import { MindMapSettings } from './settings';
import { Markmap } from 'markmap-view';

export default class MindmapView extends ItemView {
    linkedView: MarkdownView | null;
    displayText: string;
    currentMd: string;
    vault: Vault;
    workspace: Workspace;
    listeners: EventRef[];
    emptyDiv: HTMLDivElement;
    svg: SVGElement;
    obsMarkmap: ObsidianMarkmap;
    isLeafPinned: boolean;
    pinAction: HTMLElement;
    settings: MindMapSettings;
    transformer: Transformer;
    markmap: Markmap;

    getViewType(): string {
        return MM_VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.displayText ?? 'Mind Map';
    }

    getIcon() {
        return 'dot-network';
    }

    onMoreOptionsMenu(menu: Menu) {
        menu.addItem((item: MenuItem) =>
            item
                .setIcon('pin')
                .setTitle('Pin')
                .onClick(() => this.pinCurrentLeaf()),
        )
            .addSeparator()
            .addItem((item: MenuItem) =>
                item
                    .setIcon('image-file')
                    .setTitle('Copy screenshot')
                    .onClick(() => copyImageToClipboard(this.svg)),
            )
            .addItem((item: MenuItem) =>
                item
                    .setIcon('download')
                    .setTitle('Download SVG')
                    .onClick(() => saveSVG(this.svg)),
            );
        menu.showAtPosition({ x: 0, y: 0 });
    }

    constructor(settings: MindMapSettings, leaf: WorkspaceLeaf, initialLinkedView: MarkdownView | null) {
        super(leaf);
        this.settings = settings;
        this.linkedView = initialLinkedView;
        this.vault = this.app.vault;
        this.workspace = this.app.workspace;
        this.transformer = new Transformer();
    }

    async onOpen() {
        this.obsMarkmap = new ObsidianMarkmap(this.vault);
        this.listeners = [
            this.workspace.on('active-leaf-change', (leaf) => this.updateActiveLeaf(leaf)),
            this.workspace.on('layout-change', () => this.update()),
            this.workspace.on('resize', () => this.update()),
            this.workspace.on('css-change', () => this.update()),
            this.workspace.on('quick-preview', (file, data) => this.update()),
            this.leaf.on('group-change', (group) => this.updateLinkedLeaf(group, this)),
        ];
    }

    async onClose() {
        this.listeners.forEach((listener) => this.workspace.offref(listener));
    }

    async checkAndUpdate(view: MarkdownView | null) {
        if (this.isUpdateRequired(view)) {
            this.linkedView = view;
            await this.update();
        }
    }

    async updateActiveLeaf(leaf: WorkspaceLeaf | null) {
        if (leaf && leaf.view instanceof MarkdownView) {
            await this.checkAndUpdate(leaf.view);
        }
    }

    async updateLinkedLeaf(group: string, mmView: MindmapView) {
        const view =
            group === null
                ? (mmView.workspace.getGroupLeaves(group).filter((l) => l.view.getViewType() === MM_VIEW_TYPE)[0]
                      ?.view as MarkdownView)
                : null;
        await this.checkAndUpdate(view);
    }

    pinCurrentLeaf() {
        this.isLeafPinned = true;
        this.pinAction = this.addAction('filled-pin', 'Pin', () => this.unPin());
        this.pinAction.addClass('is-active');
    }

    unPin() {
        this.isLeafPinned = false;
        if (this.pinAction) this.pinAction.parentNode?.removeChild(this.pinAction);
    }

    async update() {
        if (this.linkedView) {
            const { root } = this.transformMarkdown(this.linkedView.data);
            // this.displayEmpty(false);
            if (!this.markmap) {
                const { svg, markmap } = createSVG(
                    this.markmapOptions(),
                    root,
                    this.containerEl,
                    this.settings.lineHeight,
                );
                this.svg = svg;
                if (markmap) this.markmap = markmap;
            } else {
                await this.markmap.setData(root);
            }
        } else {
            this.displayEmpty(true);
        }
        this.displayText =
            this.linkedView != null && this.linkedView.file?.name
                ? `Mind Map of ${this.linkedView.file?.name}`
                : 'Mind Map';
        this.load();
    }

    isUpdateRequired(view: MarkdownView | null) {
        if (this.isLeafPinned && view !== this.linkedView) return false;
        if (view !== this.linkedView) return true;
        if (!view) return false;
        return view.data == this.linkedView?.data;
    }

    transformMarkdown(md: string) {
        const { root, features } = this.transformer.transform(md.replace(FRONT_MATTER_REGEX, ''));
        this.obsMarkmap.updateInternalLinks(root);
        return { root, features };
    }

    markmapOptions = () => {
        return {
            autoFit: false,
            duration: 10,
            nodeMinHeight: this.settings.nodeMinHeight ?? 16,
            spacingVertical: this.settings.spacingVertical ?? 5,
            spacingHorizontal: this.settings.spacingHorizontal ?? 80,
            paddingX: this.settings.paddingX ?? 8,
        };
    };

    // renderMarkmap(root: IPureNode, svg: SVGElement) {
    //     const opt = deriveOptions({
    //       duration: 10,
    //       nodeMinHeight: this.settings.nodeMinHeight ?? 16,
    //       spacingVertical: this.settings.spacingVertical ?? 5,
    //       spacingHorizontal: this.settings.spacingHorizontal ?? 80,
    //       paddingX: this.settings.paddingX ?? 8,
    //     });
    //     opt.autoFit = false;
    //     try {
    //       const markmapSVG = Markmap.create(svg, opt, root);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    displayEmpty(display: boolean) {
        if (this.emptyDiv === undefined) {
            const div = document.createElement('div');
            div.className = 'pane-empty';
            div.innerText = 'No content found';
            this.emptyDiv = div;
        }
        if (display && this.containerEl.children[1] && this.containerEl.children[1].children[0]) {
            this.containerEl.replaceChild(this.containerEl.children[1].children[0], this.emptyDiv);
            this.emptyDiv.toggle(true);
        } else {
            this.emptyDiv.toggle(false);
        }
    }
}
