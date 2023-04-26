import { getArticleInfo } from "../../utils/articleHelper"
import { QrCode, Ecc } from "./qr/qrcodegen";

function drawCanvas(qr: QrCode, scale: number, border: number, lightColor: string, darkColor: string, canvas: WechatMiniprogram.Canvas): void {
  if (scale <= 0 || border < 0)
    throw new RangeError("Value out of range");
  const width: number = (qr.size + border * 2) * scale;
  canvas.width = width;
  canvas.height = width;
  let ctx = canvas.getContext("2d");
  for (let y = -border; y < qr.size + border; y++) {
    for (let x = -border; x < qr.size + border; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
      ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
    }
  }
}

// pages/display/display.ts
Page({
  data: {
    articleData: Array<String>()
  },
  onShow() {
    const article = getArticleInfo();
    if (!article)
      return;
    const url = article[2];
    this.setData({
      articleData: article
    });
    const codeT = QrCode.encodeText(url, Ecc.MEDIUM);

    const query = this.createSelectorQuery();
    query.select('#qrc')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node as WechatMiniprogram.Canvas;
        const ctx = canvas.getContext('2d');

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCanvas(codeT, 8, 2, "white", "black", canvas);
      })
  },
  save() {

  }
})