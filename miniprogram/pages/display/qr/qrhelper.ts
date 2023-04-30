import { QrCode } from "./qrcodegen";

export function drawCanvasQR(qr: QrCode, scale: number, border: number, lightColor: string, darkColor: string, canvas: WechatMiniprogram.Canvas): void {
  if (scale < 1 || border < 0)
    throw new RangeError("Value out of range");
  const size: number = (qr.size + border * 2) * scale;
  canvas.width = Math.max(size, canvas.width);
  canvas.height = Math.max(size, canvas.height);
  let ctx = canvas.getContext("2d");
  for (let y = -border; y < qr.size + border; y++) {
    for (let x = -border; x < qr.size + border; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
    }
  }
}

export function qrToFile(canvas: WechatMiniprogram.Canvas, onFileCreated: (res: string) => void) {
  wx.canvasToTempFilePath({
    destWidth: 512,
    destHeight: 512,
    canvas: canvas,
    fileType: 'png',
    success(res) {
      onFileCreated(res.tempFilePath);
    }
  })
}