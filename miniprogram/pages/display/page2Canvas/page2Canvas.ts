import { selectAllAsync, selectAsync } from "../../../utils/wxPromise";

const fields = {
  rect: true,
  size: true,
  computedStyle: ['color', 'backgroundColor', 'background', 'font', 'wordWrap'],
  properties: ['src'],
  dataset: true
} as WechatMiniprogram.Fields;

type Offset = {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

function fitText(ctx: any, text: string, color: string, x: number, y: number, lineHeight: number, fitWidth: number) {
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  if (fitWidth <= 0) {
    ctx.fillText(text, x, y);
    return;
  }

  for (let i = 1; i <= text.length; i++) {
    const str = text.substr(0, i);
    if (ctx.measureText(str).width > fitWidth) {
      ctx.fillText(text.substr(0, i - 1), x, y);
      fitText(ctx, text.substr(i - 1), color, x, y + lineHeight, lineHeight, fitWidth);
      return;
    }
  }
  ctx.fillText(text, x, y);
}

function drawImage(canvas: WechatMiniprogram.Canvas, ctx: any, src: string, x: number, y: number, width: number, height: number) {
  const img = canvas.createImage();
  img.src = src;
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, x, y, width, height);
      resolve();
    }
    img.onerror = reject;
  });
}

function drawElement(ctx: any, element: Record<string, any>, offset?: Offset, root?: boolean) {
  offset = offset ?? { left: 0, top: 0, right: 0, bottom: 0 };
  ctx.fillStyle = element.backgroundColor;
  ctx.fillRect(root ? 0 : element.left - offset.left, root ? 0 : element.top - offset.top, element.width, element.height);
  if (element.dataset?.text) {
    ctx.font = `200 ${parseInt(element.font)}px Arial`;
    fitText(ctx, element.dataset.text, element.color, element.left - offset.left, element.top - offset.top,
      parseInt(element.font), element.width);
  }
}

function draw(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: Record<string, any>, childProps: Record<string, any>, onReady: () => void) {
  drawAsync(canvas, scale, containerProps, childProps).then(onReady);
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
  canvas.width = containerProps.width * scale;
  canvas.height = containerProps.height * scale;
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

  return new Promise((resolve, reject) =>
    Promise.all(pendingImages).then(resolve).catch(reject)
  );
}

export async function renderPageOnCanvasAsync(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string, scale = 4) {
  const container = (await selectAsync(containerSelector, fields))[0];
  const elements = (await selectAllAsync(elementsToRenderSelector, fields))[0];
  return await drawAsync(canvas, scale, container, elements);
}