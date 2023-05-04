const fields = {
  rect: true,
  size: true,
  computedStyle: ['color', 'backgroundColor', 'background', 'font'],
  properties: ['src'],
  dataset: true
} as WechatMiniprogram.Fields;

type Offset = {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

function drawText(ctx: any, text: string, x: number, y: number, lineHeight: number, targetWidth: number) {
  targetWidth = targetWidth || 0;

  if (targetWidth <= 0) {
    ctx.fillText(text, x, y);
    return;
  }
  let words = text.split(' ');
  let currentLine = 0;
  let i = 1;
  while (words.length > 0 && i <= words.length) {
    const str = words.slice(0, i).join(' ');
    const w = ctx.measureText(str).width;
    if (w > targetWidth) {
      i = i < 2 ? 2 : i;
      ctx.fillText(words.slice(0, i - 1).join(' '), x, y + (lineHeight * currentLine));
      currentLine++;
      words = words.splice(i - 1);
      i = 1;
    }
    else
      i++;
  }
  if (i > 0)
    ctx.fillText(words.join(' '), x, y + (lineHeight * currentLine));
}

function drawImage(canvas: WechatMiniprogram.Canvas, ctx: any, src: string, x: number, y: number, width: number, height: number) {
  const img = canvas.createImage();
  img.src = src;
  return new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, x, y, width, height);
      resolve();
    }
  });
}

function drawElement(ctx: any, element: Record<string, any>, offset?: Offset, root?: boolean | undefined) {
  offset = offset ?? { left: 0, top: 0, right: 0, bottom: 0 };
  ctx.fillStyle = element.backgroundColor;
  ctx.fillRect(root ? 0 : element.left - offset.left, root ? 0 : element.top - offset.top, element.width, element.height);
  if (element.dataset?.text) {
    ctx.fillStyle = element.color;
    ctx.font = `100 ${parseInt(element.font)}px Arial`;
    drawText(ctx, element.dataset.text, element.left - offset.left, element.top - offset.top,
      parseInt(element.font), element.width);
  }
}

function createGradient(ctx: any, element: Record<string, any>, offset: Offset) {
  const gradient = ctx.createLinearGradient(element.left - offset.left, element.top - offset.top,
    element.right - offset.right, element.bottom - offset.bottom);
  const str = element.background as string;
  const gIndex = str.indexOf("gradient");
  let s = str.indexOf(",", gIndex) + 2;
  let e = str.indexOf("%)", gIndex) + 1;
  const stops = str.substring(s, e).split('%, ');
  stops.forEach((stop) => {
    const ioS = stop.lastIndexOf(' ');
    const color = stop.substring(0, ioS);
    const val = parseFloat(stop.substring(ioS).replace("%", "")) / 100;
    gradient.addColorStop(val, color);
  });
  ctx.fillStyle = gradient;
}

function draw(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: Record<string, any>, childProps: Record<string, any>, onReady: () => void) {
  const offset = { left: containerProps.left, top: containerProps.top, right: containerProps.right, bottom: containerProps.bottom } as Offset;
  const pendingImages = Array<Promise<any>>();
  const width = containerProps.width * scale;
  const height = containerProps.height * scale;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  drawElement(ctx, containerProps, undefined, true);

  childProps.forEach((child: Record<string, any>) => {
    drawElement(ctx, child, offset);
    if (child.src)
      pendingImages.push(
        drawImage(canvas, ctx, child.src, child.left - offset.left, child.top - offset.top, child.width, child.height)
      );
  });
  Promise.all(pendingImages).then(onReady);
}

export function renderPageOnCanvas(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string,
  onReady: () => void, scale = 4) {
  const query = wx.createSelectorQuery();

  const container = new Promise<Record<string, any>>((resolve) => {
    query.select(containerSelector).fields(fields, (res) => resolve(res)).exec()
  });
  const elements = new Promise<Record<string, any>>((resolve) => {
    query.selectAll(elementsToRenderSelector).fields(fields, (res) => resolve(res)).exec()
  });

  Promise.all([container, elements]).then((res) => draw(canvas, scale, res[0], res[1], onReady));
}

function drawAsync(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: Record<string, any>, childProps: Record<string, any>) {
  const offset = { left: containerProps.left, top: containerProps.top, right: containerProps.right, bottom: containerProps.bottom } as Offset;
  const pendingImages = Array<Promise<any>>();
  const width = containerProps.width * scale;
  const height = containerProps.height * scale;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  drawElement(ctx, containerProps, undefined, true);

  childProps.forEach((child: Record<string, any>) => {
    drawElement(ctx, child, offset);
    if (child.src)
      pendingImages.push(
        drawImage(canvas, ctx, child.src, child.left - offset.left, child.top - offset.top, child.width, child.height)
      );
  });
  
  return new Promise((resolve) => {
    Promise.all(pendingImages).then(resolve);
  });
}

export function renderPageOnCanvasAsync(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string, scale = 4) {
  const query = wx.createSelectorQuery();

  const container = new Promise<Record<string, any>>((resolve) => {
    query.select(containerSelector).fields(fields, (res) => resolve(res)).exec()
  });
  const elements = new Promise<Record<string, any>>((resolve) => {
    query.selectAll(elementsToRenderSelector).fields(fields, (res) => resolve(res)).exec()
  });

  return Promise.all([container, elements]).then((res) => drawAsync(canvas, scale, res[0], res[1]));
}