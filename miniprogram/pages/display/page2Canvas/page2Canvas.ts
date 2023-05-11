import { selectAllAsync, selectAsync } from "../../../utils/wxPromise";
import { ComponentProps, Offset } from "./page2CanvasTypes";

const fields = {
  rect: true,
  size: true,
  computedStyle: ['color', 'backgroundColor', 'font', 'wordWrap'],
  properties: ['src', 'mode'],
  dataset: true
} as WechatMiniprogram.Fields;

function fitText(ctx: any, text: string, color: string, x: number, y: number, lineHeight: number, fitWidth: number) {
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  if (fitWidth <= 0) {
    ctx.fillText(text, x, y);
    return;
  }

  for (let i = 1; i < text.length; i++) {
    const str = text.substr(0, i);
    if (ctx.measureText(str).width > fitWidth) {
      ctx.fillText(text.substr(0, i - 1), x, y);
      text = text.substr(i - 1);
      i = 1;
      y += lineHeight;
    }
  }
  ctx.fillText(text, x, y);
}

function drawImage(canvas: WechatMiniprogram.Canvas, ctx: any, src: string, x: number, y: number, width: number, height: number, mode?: string) {
  const img = canvas.createImage();
  img.src = src;
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      if(mode === "aspectFill")
        drawImageProp(ctx, img, x, y, width, height, 0.5, 0.5);
      else
        ctx.drawImage(img, x, y, width, height);
      resolve();
    }
    img.onerror = reject;
  });
}

function drawImageProp(ctx: any, img: any, x: number, y: number, width: number, height: number, offsetX = 0.5, offsetY = 0.5) {
  offsetX = Math.max(0, Math.min(offsetX, 1));
  offsetY = Math.max(0, Math.min(offsetY, 1));

  var iwidth = img.width,
    iheight = img.height,
    sizeRatio = Math.min(width / iwidth, height / iheight),
    targetWidth = iwidth * sizeRatio,
    targetHeight = iheight * sizeRatio,
    resX, resY, resWidth, resHeight, aspectRatio = 1;

  if (targetWidth < width) aspectRatio = width / targetWidth;
  if (Math.abs(aspectRatio - 1) < 1e-14 && targetHeight < height) aspectRatio = height / targetHeight;

  targetWidth *= aspectRatio;
  targetHeight *= aspectRatio;

  resWidth = iwidth / (targetWidth / width);
  resHeight = iheight / (targetHeight / height);

  resX = (iwidth - resWidth) * offsetX;
  resY = (iheight - resHeight) * offsetY;

  if (resX < 0) resX = 0;
  if (resY < 0) resY = 0;
  if (resWidth > iwidth) resWidth = iwidth;
  if (resHeight > iheight) resHeight = iheight;

  ctx.drawImage(img, resX, resY, resWidth, resHeight, x, y, width, height);
}

function drawElement(ctx: any, element: ComponentProps, offset?: Offset, root?: boolean) {
  offset = offset ?? { left: 0, top: 0, right: 0, bottom: 0 };
  ctx.fillStyle = element.backgroundColor;
  ctx.fillRect(root ? 0 : element.left - offset.left, root ? 0 : element.top - offset.top, element.width, element.height);
  if (element.dataset?.text) {
    ctx.font = element.font;
    fitText(ctx, element.dataset.text, element.color, element.left - offset.left, element.top - offset.top,
      parseInt(element.font), element.width);
  }
}

async function draw(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: ComponentProps, childProps: ComponentProps[]) {
  const offset = { left: containerProps.left, top: containerProps.top, right: containerProps.right, bottom: containerProps.bottom } as Offset;
  canvas.width = containerProps.width * scale;
  canvas.height = containerProps.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  drawElement(ctx, containerProps, undefined, true);

  for (let i = 0; i < childProps.length; i++) {
    const child = childProps[i];
    drawElement(ctx, child, offset);
    if (child.src)
      await drawImage(canvas, ctx, child.src, child.left - offset.left, child.top - offset.top, child.width, child.height, child.mode);
  }
}

export async function renderPageOnCanvas(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string, scale = 4) {
  const container = await selectAsync(containerSelector, fields);
  const elements = await selectAllAsync(elementsToRenderSelector, fields);
  return await draw(canvas, scale, container, elements);
}