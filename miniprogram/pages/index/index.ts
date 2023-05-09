import validator from 'validator';

type Input = {
  id: number,
  name: string
}

const inputFields = [{ id: 0, name: "Name" },
{ id: 1, name: "Article title" },
{ id: 2, name: "Article URL" }] as Array<Input>;

Page({
  data: {
    inputs: inputFields,
    values: new Array<string>(inputFields.length).fill(""),
    allSet: false,
    validUrl: false
  },
  inputChange(e: WechatMiniprogram.CustomEvent) {
    const values = this.data.values;
    values[e.currentTarget.dataset.id] = e.detail.value;
    this.validate();
  },
  validate() {
    let allSet = true;
    this.data.values.forEach(v => allSet = allSet && v.length > 0);
    this.setData({
      allSet: allSet,
      validUrl: allSet && validator.isURL(this.data.values[this.data.values.length - 1])
    });
  },
  create() {
    const app = getApp<IAppOption>();
    app.globalData.articleData = this.data.values;
    wx.navigateTo({
      url: "../display/display"
    });
  }
})
