import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, qrToFileAsync } from "./qr/qrhelper";
import { renderPageOnCanvas } from "./page2Canvas/page2Canvas";
import { selectAsync, canvasToTempFilePathAsync } from "../../utils/wxPromise";
import { fromRGBString } from "../../utils/rgbTools";
import { getGlobalData } from "../../app";
import { Article, inputFields } from "../../article";

// pages/display/display.ts
Page({
  data: {
    fields: inputFields.slice(1),
    articleData: {} as Article,
    qrImage: "",
    pageImage: "",
    bgRGB: Array<number>(3).fill(0),
    bgColor: "",
    bgImage: "",
    overlay: false
  },
  onReady() {
    const data = getGlobalData();
    const article = data.articleData;

    if (!article) {
      wx.navigateTo({ url: "../index/index" });
      return;
    }

    this.setData({
      bgImage: data.articleImage,
      bgRGB: fromRGBString(data.articleBackground)
    });
    this.updateData(article, data.articleBackground);
  },
  updateData(data: Article, bgcolor: string) {
    this.setData({
      articleData: data,
      bgColor: bgcolor
    });
    this.renderPage();
  },
  customize() {
    this.setData({
      overlay: !this.data.overlay
    });
  },
  setColor(e: WechatMiniprogram.CustomEvent) {
    const rgb = e.detail.rgb;
    getGlobalData().articleBackground = rgb;
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
      const url = this.data.articleData["url"];
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
        self.setImage(res.tempFiles[0].tempFilePath);
      }
    });
  },
  clearImage() {
    this.setImage("");
  },
  setImage(img: string) {
    this.setData({ bgImage: img });
    getGlobalData().articleImage = img;
    this.renderPage();
  }
})