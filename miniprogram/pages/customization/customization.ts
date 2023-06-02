import { getGlobalData } from "../../app";
import { addToCache, getFromCache } from "../../frameCache";
import { fromRGBString } from "../../utils/rgbTools";

// pages/customization/customization.ts
Page({
  data: {
    ready: false,
    rgb: [0, 0, 0],
    rgbString: "rgb(0, 0, 0)",
    backgroundImage: "",
    serverFrameId: 0,
    serverFrames: []
  },
  onShow() {
    const data = getGlobalData();

    this.setData({
      rgb: fromRGBString(data.cardSettings.bgColor),
      backgroundImage: data.cardSettings.bgImage,
      serverFrames: getGlobalData().serverFrames,
      serverFrameId: getGlobalData().serverFrameId,
      ready: true
    });
  },
  setColor(e: WechatMiniprogram.CustomEvent) {
    const rgb = e.detail.rgb;
    getGlobalData().cardSettings.bgColor = rgb;
    this.setData({
      rgbString: rgb
    });
  },
  loadCustomImage() {
    const self = this;
    wx.chooseMedia({
      count: 1, mediaType: ['image'],
      success(res) {
        self.setImage(res.tempFiles[0].tempFilePath);
        self.setFrameIndex(-1);
      }
    });
  },
  clearImage() {
    this.setImage("");
    this.setFrameIndex(-1);
  },
  setImage(img: string) {
    this.setData({ backgroundImage: img });
    getGlobalData().cardSettings.bgImage = img;
  },
  cycleFrame(e: WechatMiniprogram.CustomEvent) {
    const next = e.currentTarget.dataset.next;
    const newIndex = this.data.serverFrameId + (next ? 1 : -1);
    this.setFrameIndex(newIndex);
    this.loadServerFrame();
  },
  setFrameIndex(index: number) {
    this.setData({
      serverFrameId: index
    });
    getGlobalData().serverFrameId = index;
  },
  loadServerFrame() {
    if(this.data.serverFrameId < 0)
      return;

    const url = this.data.serverFrames[this.data.serverFrameId];
    const cachedImage = getFromCache(url); 
    if(!cachedImage) {
      const self = this;
      const url = self.data.serverFrames[self.data.serverFrameId]
      wx.downloadFile({
        url,
        header: {
          "ngrok-skip-browser-warning": "true"
        },
        success(res) {
          addToCache(url, res.tempFilePath);
          self.setImage(res.tempFilePath);
        }
      });
    }
    else
      this.setImage(cachedImage);
  },
  showServerFrames() {
    this.setFrameIndex(0);
    this.loadServerFrame();
  }
})