// app.ts
import { Article } from "./article";

App<IAppOption>({
  globalData: {
    articleData: {} as Article,
    articleBackground: "rgb(182, 142, 209)",
    articleImage: "",
  }
})

export const getGlobalData = () => getApp<IAppOption>().globalData;
