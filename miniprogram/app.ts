// app.ts
export const colors = [ "rgb(182, 142, 209)", "pink", "#d68da8", "#928cc8", "#8db4d6", "#f1bf7d", "#99ffcc", "#a6ed8a" ];

App<IAppOption>({
  globalData: {
    articleData: new Array<string>(3).fill(""),
    articleBackground: colors[0],
  }
})