import validator from 'validator';
import { report, getOpenId } from '../../backend/server';
import { getGlobalData } from '../../app';
import { ArticleField, CreateEmptyArticle, inputFields, ValidateArticle } from '../../article';

Page({
  data: {
    inputs: inputFields,
    articleData: CreateEmptyArticle(),
    allSet: false,
    validUrl: false,
    userId: undefined as unknown as WechatMiniprogram.UserInfo,
    ready: false
  },
  inputChange(e: WechatMiniprogram.CustomEvent) {
    const values = this.data.articleData;
    values[e.currentTarget.dataset.key as ArticleField] = e.detail.value;
    const allSet = ValidateArticle(this.data.articleData);
    this.setData({
      allSet: allSet,
      validUrl: allSet && validator.isURL(this.data.articleData["url"] ?? "")
    });
  },
  create() {
    const data = getGlobalData();
    data.articleData = this.data.articleData;

    const userId = getGlobalData().userId;

    if(userId !== undefined)
      report("CARD_CREATED", { open_id: userId });

    wx.navigateTo({
      url: "../display/display"
    });
  },
  onShow() {
    if(getGlobalData().userId) {
      this.setData({ ready: true });
      return;
    }

    const self = this;
    wx.login({
      success(res) {
        getOpenId(res.code).then((openId) => {
          console.log(openId);
          getGlobalData().userId = openId;
        }).catch()
        .finally(() => {
          self.setData({
            ready: true
          })
        })
      },
    });
  }
})
