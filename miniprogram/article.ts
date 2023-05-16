export type ArticleField = "name" | "title" | "url" | "journalName" | "coAuthor";

export type Article = Record<ArticleField, string>;

export function CreateEmptyArticle() {
  return { name: "", title: "", url: "", journalName: "", coAuthor: "" } as Article;
}

export type ArticleInput = {
  key: ArticleField,
  name: string,
  required: boolean
}

export const inputFields = [{ key: "name", name: "Name", required: true },
{ key: "coAuthor", name: "Co-author" },
{ key: "title", name: "Paper title", required: true },
{ key: "journalName", name: "Journal name", required: true },
{ key: "url", name: "Paper URL", required: true }] as Array<ArticleInput>;

export function ValidateArticle(articleData: Article) {
  for (const field of inputFields) {
    if (!field.required)
      continue;
    if (articleData[field.key]?.length < 1)
      return false;
  }
  return true;
}


