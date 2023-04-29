const fields = {
  node: true,
  rect: true,
  size: true,
  computedStyle: ['color', 'backgroundColor', 'fontSize', 'font'],
  context: true,
  properties: ['src'],
  mark: true,
  dataset: true
} as WechatMiniprogram.Fields;

function draw(canvas: WechatMiniprogram.Canvas, scale: number, containerProps: Record<string, any>, childProps: Record<string, any>, onReady: (path: string) => void) {
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
      ctx.font = `${parseInt(child.font) * scale / 5}px Arial`;
      ctx.fillText(child.dataset?.text, child.left - offset.left, child.top - offset.top);
    }

    if (child.src) {
      const img = canvas.createImage();
      pendingImages.push(new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, child.left - offset.left, child.top - offset.top, child.width, child.height);
          resolve(true);
        }
      }));
      img.src = child.src;
    }
  });
  Promise.all(pendingImages).then(() => onReady("ok"));
}

export function renderPageOnCanvas(canvas: WechatMiniprogram.Canvas, containerSelector: string, elementsToRenderSelector: string, onReady: (path: string) => void, scale = 8) {
  const query = wx.createSelectorQuery();

  const q1 = new Promise<Record<string, any>>((resolve) => {
    query.select(containerSelector).fields(fields, (res) => resolve(res)).exec()
  });
  const q2 = new Promise<Record<string, any>>((resolve) => {
    query.selectAll(elementsToRenderSelector).fields(fields, (res) => resolve(res)).exec()
  });

  Promise.all([q1, q2]).then((res) => draw(canvas, scale, res[0], res[1], onReady));
}
