// app.ts
import { Article, CreateEmptyArticle } from "./article";
import { CardSettings, CreateSettings } from "./cardSettings";

App<IAppOption>({
  globalData: {
    articleData: CreateEmptyArticle() as Article,
    cardSettings: CreateSettings() as CardSettings,
    openId: undefined,
    serverFrames: [],
    serverFrameId: -1
  }
});

export const getGlobalData = () => getApp<IAppOption>().globalData;
