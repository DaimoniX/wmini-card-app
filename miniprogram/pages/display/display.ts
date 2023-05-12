import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, qrToFileAsync } from "./qr/qrhelper";
import { renderPageOnCanvas } from "./page2Canvas/page2Canvas";
import { selectAsync, canvasToTempFilePathAsync } from "../../utils/wxPromise";
import { fromRGBString } from "../../utils/rgbTools";

// pages/display/display.ts
Page({
  data: {
    articleData: Array<string>(),
    qrImage: "",
    pageImage: "",
    bgRGB: Array<number>(3).fill(0),
    bgColor: "",
    bgImage: "",
    index: 0
  },
  onLoad() {
    const app = getApp<IAppOption>();
    const article = app.globalData.articleData;

    if (!article) {
      wx.navigateTo({ url: "../index/index" });
      return;
    }

    this.setData({
      bgImage: app.globalData.articleImage
    });
    this.updateData(article, app.globalData.articleBackground)
  },
  updateData(data: Array<string>, bgcolor: string) {
    this.setData({
      bgRGB: fromRGBString(bgcolor),
      articleData: data,
      bgColor: bgcolor
    });
    this.renderPage();
  },
  setTab(e: WechatMiniprogram.CustomEvent) {
    const index = e.currentTarget.dataset.tab;
    this.setData({ index });
    wx.pageScrollTo({
      selector: index == 0 ? "#tp" : "#rt",
      duration: 400
    });
  },
  setColor(e: WechatMiniprogram.CustomEvent) {
    const rgb = e.detail.rgb;
    const app = getApp<IAppOption>();
    app.globalData.articleBackground = rgb;
    this.updateData(this.data.articleData, rgb);
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
      const qrCanvas = (await selectAsync('#qrc', { node: true, size: true })).node as WechatMiniprogram.Canvas;

      drawCanvasQR(qrCode, 32, 2, "white", "black", qrCanvas);
      const file = await qrToFileAsync(qrCanvas);

      this.setData({
        qrImage: file
      });
    }

    const pageCanvas = (await selectAsync('#pagec', { node: true, size: true })).node as WechatMiniprogram.Canvas;
    await renderPageOnCanvas(pageCanvas, ".article-container", "._save");
    const cFile = await canvasToTempFilePathAsync(pageCanvas, pageCanvas.width, pageCanvas.height);
    this.setData({ pageImage: cFile });
  },
  selectImage() {
    const self = this;
    wx.chooseMedia({
      count: 1, mediaType: ['image'],
      success(res) {
        self.setData({
          bgImage: res.tempFiles[0].tempFilePath
        });
        getApp<IAppOption>().globalData.articleImage = res.tempFiles[0].tempFilePath;
        self.renderPage();
      }
    });
  },
  clearImage() {
    this.setData({ bgImage: "" });
    getApp<IAppOption>().globalData.articleImage = "";
    this.renderPage();
  }
})