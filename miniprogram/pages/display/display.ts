import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, qrToFileAsync } from "./qr/qrhelper";
import { renderPageOnCanvasAsync } from "./page2Canvas/page2Canvas";
import { asyncQuery, canvasToTempFilePathAsync } from "../../utils/wxPromise";
import { colors } from "../../app";

// pages/display/display.ts
Page({
  data: {
    articleData: Array<string>(),
    qrImage: "",
    pageImage: "",
    bgcolor: "",
    colors: colors,
    index: 0
  },
  onLoad() {
    const app = getApp<IAppOption>();
    const article = app.globalData.articleData;

    if (!article) {
      wx.navigateTo({ url: "../index/index" });
      return;
    }

    this.updateData(article, app.globalData.articleBackground)
  },
  updateData(data: Array<string>, bgcolor: string) {
    this.setData({
      articleData: data,
      bgcolor: bgcolor
    });
    this.renderPage();
  },
  setTab(e: any) {
    this.setData({ index: e.currentTarget.dataset.tab });
  },
  setColor(e: any) {
    const app = getApp<IAppOption>();
    const bgcolor: string = e.currentTarget.dataset.color;
    app.globalData.articleBackground = bgcolor;
    this.updateData(this.data.articleData, bgcolor);
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
  async renderPage() {
    this.setData({
      pageImage: ""
    });

    if (!this.data.qrImage) {
      const url = this.data.articleData[2];
      const qrCode = QrCode.encodeText(url);
      const qrCanvas = (await asyncQuery('#qrc', { node: true, size: true }))[0].node as WechatMiniprogram.Canvas;

      drawCanvasQR(qrCode, 32, 2, "white", "black", qrCanvas);
      const file = await qrToFileAsync(qrCanvas);
      this.setData({
        qrImage: file
      });
    }

    const pageCanvas = (await asyncQuery('#pagec', { node: true, size: true }))[0].node as WechatMiniprogram.Canvas;
    await renderPageOnCanvasAsync(pageCanvas, ".a-container", ".psaver");
    const cFile = await canvasToTempFilePathAsync(pageCanvas, pageCanvas.width, pageCanvas.height);
    this.setData({ pageImage: cFile });
  }
})