import { setArticleInfo } from "../../utils/articleHelper";

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
    allValueSet: false
  },
  inputChange(e: WechatMiniprogram.CustomEvent) {
    const values = this.data.values;
    values[e.currentTarget.dataset.id] = e.detail.value;
    let allSet = true;
    values.forEach(v => allSet = allSet && v.length > 0);
    this.setData({
      values: values,
      allValueSet: allSet
    });
    
  },
  create() {
    setArticleInfo(this.data.values);
    wx.navigateTo({
      url: "../display/display"
    });
  }
})
