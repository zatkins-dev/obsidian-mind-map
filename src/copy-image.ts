import { Notice } from 'obsidian';

export async function copyImageToClipboard(svg: SVGElement) {
    const canvas = createCanvas(svg);
    generateImage(svg, canvas, async () => {
        const blob : Blob | null = await new Promise(resolve => canvas.toBlob(resolve));
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        new Notice('Screenshot copied to the clipboard.')
    });
}

function createCanvas(svg: SVGElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;
    return canvas;
}

function generateImage(svg: SVGElement, canvas: HTMLCanvasElement, callback: () => Promise<void>): HTMLImageElement | null {
    let ctx = canvas.getContext("2d");
    if (!ctx) console.warn("Invalid canvas context");
    console.warn("Valid canvas context");
    return ctx ? drawInlineSVG(ctx, svg, callback) : null;
}

function encodeXmlToBase64(xml: string): string {
  // Encode the Unicode string into a UTF-8 Uint8Array
  const bytes = new TextEncoder().encode(xml);

  // Convert the bytes to a binary string
  // Using Array.from is the MDN recommended approach
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");

  // Safely encode to Base64
  return btoa(binString);
}

function drawInlineSVG(ctx: CanvasRenderingContext2D, svg: SVGElement, callback: () => Promise<void>): HTMLImageElement {

    // get svg data
    const xml = new XMLSerializer().serializeToString(svg);

    // make it base64
    const svg64 = encodeXmlToBase64(xml);

    const b64Start = 'data:image/svg+xml;base64,';

    // prepend a "header"
    const image64 = b64Start + svg64;

    const img = new Image();
    // set it as the source of the img element
    img.onload = async function() {
        // draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
        await callback();
    }
    img.src = image64;
    return img;
}
