import { QrCode } from "./qr/qrcodegen";
import { drawCanvasQR, qrToFileAsync } from "./qr/qrhelper";
import { renderPageOnCanvas } from "./page2Canvas/page2Canvas";
import { selectAsync, canvasToTempFilePathAsync } from "../../utils/wxPromise";
import { getGlobalData } from "../../app";
import { Article, inputFields } from "../../article";

// pages/display/display.ts
Page({
  data: {
    fields: inputFields.slice(1),
    articleData: {} as Article,
    qrImage: "",
    backgroundImage: "",
    backgroundColor: "",
    generatedImage: ""
  },
  onShow() {
    const article = getGlobalData().articleData;

    if (!article) {
      wx.navigateTo({ url: "../index/index" });
      return;
    }

    this.setData({
      articleData: article,
      bgImage: getGlobalData().cardSettings.bgImage,
      bgColor: getGlobalData().cardSettings.bgColor
    });
    this.renderPage();
  },
  customize() {
    wx.navigateTo({
      url: "../customization/customization"
    });
  },
  preview() {
    wx.previewImage({
      current: '',
      urls: [this.data.generatedImage]
    });
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.generatedImage,
      success() {
        wx.showToast({
          title: "File saved"
        });
      }
    });
  },
  async renderPage() {
    this.setData({
      generatedImage: ""
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
    const tempFile = await canvasToTempFilePathAsync(pageCanvas, pageCanvas.width, pageCanvas.height);
    this.setData({ generatedImage: tempFile });
  }
})