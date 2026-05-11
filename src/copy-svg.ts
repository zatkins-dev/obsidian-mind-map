import { Notice } from 'obsidian';

export function copySVGToClipboard(svg: SVGElement) {
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const item = new ClipboardItem({ 'image/svg': blob });
    navigator.clipboard.write([item]);
    new Notice('SVG copied to the clipboard.');
}
