import validator from 'validator';
import { getGlobalData } from '../../app';
import { ArticleField, CreateEmptyArticle, inputFields, ValidateArticle } from '../../article';

Page({
  data: {
    inputs: inputFields,
    articleData: CreateEmptyArticle(),
    allSet: false,
    validUrl: false
  },
  inputChange(e: WechatMiniprogram.CustomEvent) {
    const values = this.data.articleData;
    values[e.currentTarget.dataset.key as ArticleField] = e.detail.value;
    this.validate();
  },
  validate() {
    let allSet = ValidateArticle(this.data.articleData);
    this.setData({
      allSet: allSet,
      validUrl: allSet && validator.isURL(this.data.articleData["url"] ?? "")
    });
  },
  create() {
    const data = getGlobalData();
    data.articleData = this.data.articleData;
    wx.navigateTo({
      url: "../display/display"
    });
  }
})
