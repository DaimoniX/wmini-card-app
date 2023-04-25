import { getArticleInfo, setArticleInfo } from "../../utils/articleHelper";
import { formatTime } from "../../utils/util";

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
    values: new Array<string>(inputFields.length)
  },
  inputChange(e: WechatMiniprogram.CustomEvent) {
    const values = this.data.values;
    values[e.currentTarget.dataset.id] = e.detail.value;
    this.setData({
      values: values
    });
  },
  open() {
    formatTime(new Date());
    setArticleInfo(this.data.values);
    wx.navigateTo({
      url: "../display/display"
    });
    console.log(getArticleInfo());
  }
})
