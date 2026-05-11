function getBbox(svg: SVGElement) {
    const svgClone = svg.cloneNode(true) as SVGElement;

    // Temporarily inject into the DOM to calculate bounds natively
    svgClone.setCssProps({
        position: 'absolute',
        visibility: 'hidden',
        left: '-9999px',
    });
    document.body.appendChild(svgClone);

    // Wrap all contents in a <g> to easily get the collective bounding box
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    while (svgClone.firstChild) {
        wrapper.appendChild(svgClone.firstChild);
    }
    svgClone.appendChild(wrapper);

    // Calculate the bounding box
    let bbox = { x: 0, y: 0, width: 0, height: 0 };
    try {
        bbox = wrapper.getBBox();
    } catch (e) {
        console.warn('Could not calculate SVG bounding box', e);
    }

    while (wrapper.firstChild) {
        svgClone.insertBefore(wrapper.firstChild, wrapper);
    }
    svgClone.removeChild(wrapper);
    document.body.removeChild(svgClone);

    return bbox;
}

export async function saveSVG(svg: SVGElement, defaultFilename: string = 'image.svg') {
    const bbox = getBbox(svg);
    const svgClone = svg.cloneNode(true) as SVGElement;
    const padding = 5;

    // 5. Apply the clamped bounds and Background Color
    if (bbox.width > 0 && bbox.height > 0) {
        // Calculate the new viewbox with padding
        const vx = bbox.x - padding;
        const vy = bbox.y - padding;
        const vw = bbox.width + padding * 2;
        const vh = bbox.height + padding * 2;

        // Clamp the SVG canvas
        svgClone.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
        svgClone.setAttribute('width', `${vw}`);
        svgClone.setAttribute('height', `${vh}`);

        // Grab Obsidian's background color
        const styles = getComputedStyle(document.body);
        const bgColor = styles.getPropertyValue('--background-primary').trim() || styles.backgroundColor || '#ffffff';

        // Create the background rect
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        // Note: We MUST set x and y to vx and vy. If we leave them at 0,
        // the rectangle will be offset and won't align with the clamped viewBox.
        bgRect.setAttribute('x', `${vx}`);
        bgRect.setAttribute('y', `${vy}`);
        bgRect.setAttribute('width', `${vw}`);
        bgRect.setAttribute('height', `${vh}`);
        bgRect.setAttribute('fill', bgColor);
        bgRect.setAttribute('class', 'svg-export-background');

        if (svgClone.firstChild) {
            svgClone.insertBefore(bgRect, svgClone.firstChild);
        } else {
            svgClone.appendChild(bgRect);
        }
    }
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    // Add standard SVG namespaces if they are missing
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = defaultFilename;

    // Append to body, click, and clean up
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke the Object URL to free up memory
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
