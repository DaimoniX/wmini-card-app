import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, qrToFile } from "./qr/qrhelper";
import { renderPageOnCanvas } from "./page2Canvas/page2Canvas";

// pages/display/display.ts
Page({
  data: {
    articleData: Array<string>(),
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

    this.setData({
      articleData: article
    });

    this.renderPage();
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
  },
  renderPage() {
    const self = this;
    const query = wx.createSelectorQuery();
    const url = this.data.articleData[2];
    const qrCode = QrCode.encodeText(url);
    query.select('#qrc')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node as WechatMiniprogram.Canvas;
        drawCanvasQR(qrCode, 32, 2, "white", "black", canvas);
        qrToFile(canvas, (file) => {
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
                  destWidth: canvas.width,
                  destHeight: canvas.height,
                  success(res) {
                    self.setData({ pageImage: res.tempFilePath })
                  }
                })
              });
            });
        });
      });
  }
})