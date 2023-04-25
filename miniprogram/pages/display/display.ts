import { getArticleInfo } from "../../utils/articleHelper"

function drawImage(width : number, height : number, canvas : WechatMiniprogram.Canvas, articleInfo: string[]) {
  const ctx = canvas.getContext('2d');
  const dpr = wx.getSystemInfoSync().pixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.fillStyle = "#ccc"
  ctx.scale(dpr, dpr);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "4rem serif";
  ctx.fillText(`Name: ${articleInfo[0]}`, 10, 50);
  ctx.fillText(`Title: ${articleInfo[1]}`, 10, 100);
  ctx.fillText(`URL: ${articleInfo[2]}`, 10, 150);
}

// pages/display/display.ts
Page({
  onShow() {
    const article = getArticleInfo();
    if(!article)
      return;
    const query = wx.createSelectorQuery()
    query.select('#generated-picture')
      .fields({ node: true, size: true })
      .exec((res) => {
        drawImage(res[0].width, res[0].height, res[0].node, article);
      });
  },
})