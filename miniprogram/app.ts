// app.ts
import { Article } from "./article";

App<IAppOption>({
  globalData: {
    articleData: {} as Article,
    articleBackground: "rgb(125, 170, 200)",
    articleImage: "",
    openId: undefined
  }
});

export const getGlobalData = () => getApp<IAppOption>().globalData;
