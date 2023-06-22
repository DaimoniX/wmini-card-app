import { Article, CreateEmptyArticle } from "./utils/article";
import { CardSettings, CreateSettings } from "./utils/cardSettings";

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
