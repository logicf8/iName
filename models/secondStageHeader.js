// models/secondStageHeader.js
export default class SecondStageHeader {
  constructor(originalTxt) {
      this.originalTxt = originalTxt; 
      this.displayTxt = undefined;
      this.type = "none2";
      this.articles = [];
      this.artAlert = [];
  }
  addArticle(article) {
    this.articles.push(article);
  }
  returnArticles(){
	  return this.articles;
  }
}