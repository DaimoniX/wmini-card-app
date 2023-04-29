import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, canvasToFile } from "./qr/qrhelper";
import { renderPageOnCanvas } from "./page2Canvas/page2Canvas";

// pages/display/display.ts
Page({
  data: {
    articleData: Array<String>(),
    qrImage: "",
    pageImage: ""
  },
  onLoad() {
    const app = getApp<IAppOption>();
    const article = app.globalData.articleData;

    if (!article) {
      wx.navigateTo({ url: "../index/index" });
      return;
    }

    const self = this;
    const query = wx.createSelectorQuery();

    const url = article[2];
    this.setData({
      articleData: article
    });

    const qrCode = QrCode.encodeText(url);
    query.select('#qrc')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node as WechatMiniprogram.Canvas;
        drawCanvasQR(qrCode, 32, 2, "white", "black", canvas);
        canvasToFile(canvas, (file) => {
          this.setData({
            qrImage: file
          });
          query.select('#pagec')
            .fields({ node: true, size: true })
            .exec((res) => {
              const canvas = res[0].node as WechatMiniprogram.Canvas;
              renderPageOnCanvas(canvas, ".a-container", ".psaver", () => {
                wx.canvasToTempFilePath({
                  canvas: canvas,
                  destWidth: canvas.width * 2,
                  destHeight: canvas.height * 2,
                  success(res) {
                    self.setData({ pageImage: res.tempFilePath })
                  }
                })
              });
            });
        });
      })
  },
  preview() {
    wx.previewImage({
      current: '',
      urls: [this.data.pageImage]
    });
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.pageImage,
      success() {
        wx.showToast({
          title: "File saved"
        });
      }
    });
  }
})