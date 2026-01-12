import ArticleDB from "../../Data/ArticleDB.js";

export const data = ArticleDB.map(str => {
  const parts = str.split("_");
  return {
    original: str,
    name: parts[0],
    description: parts[1],
    artNr: parts[2],
    width: parts[3],
    depth: parts[4],
    height: parts[5],
    color: parts[6],
    group1: parts[7],
    group2: parts[8],
    group3: parts[9],
  };
});