let articleInfo = new Array<string>();

export const setArticleInfo = (info : Array<string>) => {
  articleInfo = info;
}

export const getArticleInfo = () : Array<string> | undefined => {
  return articleInfo.length > 0 ? articleInfo : undefined;
}