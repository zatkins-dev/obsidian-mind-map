import { Markmap, IMarkmapOptions } from 'markmap-view';
import { IPureNode } from 'markmap-common';

export function createSVG(opts: Partial<IMarkmapOptions>, root: IPureNode, containerEl: HTMLElement, lineHeight: string) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as unknown as SVGElement;
    svg.id = 'markmap';
    svg.setAttr('style', 'height: 100%; width: 100%;');
    const container = containerEl.children[1] ? containerEl.children[1] : null;
    // eslint-disable-next-line
    const style = document.createElement('style');
    const { color } = getComputedCss(containerEl);
    // eslint-disable-next-line
    style.innerHTML = `#markmap div {
        color: ${color};
        line-height: ${lineHeight ?? '1em'};
    }`;
    svg.appendChild(style);
    let markmap : Markmap | null = null;
    try {
       markmap = Markmap.create(svg, opts, root);
    } catch (error) {
        console.error(error);
    }
    if (container) {
      container.replaceChildren(svg);
    }
    return {svg, markmap};
}

export function getComputedCss(el: HTMLElement) {
    const computed = getComputedStyle(el);
    const color = computed.getPropertyValue('--text-normal');
    const font = `1em ${computed.getPropertyValue('--default-font')}`;
    return { color, font };
}
