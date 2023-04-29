const fields = {
  rect: true,
  size: true,
  computedStyle: ['color', 'backgroundColor', 'font'],
  properties: ['src'],
  dataset: true
} as WechatMiniprogram.Fields;

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

function draw(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: Record<string, any>, childProps: Record<string, any>, onReady: () => void) {
  const offset = { left: containerProps.left, top: containerProps.top, right: containerProps.right, bottom: containerProps.bottom };
  const width = containerProps.width * scale;
  const height = containerProps.height * scale;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = containerProps.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  const pendingImages = Array<Promise<any>>();

  childProps.forEach((child: Record<string, any>) => {
    ctx.fillStyle = child.backgroundColor;
    ctx.fillRect(child.left - offset.left, child.top - offset.top, child.width, child.height);

    if (child.dataset?.text) {
      ctx.fillStyle = child.color;
      ctx.font = `100 ${parseInt(child.font)}px Arial`;
      drawText(ctx, child.dataset.text, child.left - offset.left, child.top - offset.top,
        parseInt(child.font), child.width - scale);
    }

    if (child.src)
      pendingImages.push(
        drawImage(canvas, ctx, child.src, child.left - offset.left, child.top - offset.top, child.width, child.height)
      );
  });
  Promise.all(pendingImages).then(onReady);
}

export function renderPageOnCanvas(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string,
  onReady: () => void, scale = 8) {
  const query = wx.createSelectorQuery();

  const container = new Promise<Record<string, any>>((resolve) => {
    query.select(containerSelector).fields(fields, (res) => resolve(res)).exec()
  });
  const elements = new Promise<Record<string, any>>((resolve) => {
    query.selectAll(elementsToRenderSelector).fields(fields, (res) => resolve(res)).exec()
  });

  Promise.all([container, elements]).then((res) => draw(canvas, scale, res[0], res[1], onReady));
}
