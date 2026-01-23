import { addDisplayTxt } from "./helpers/displayTxtHelpers.js";

export function artAddTxt(sP, header){
  header.returnArticles().forEach(article => {
    if(article.artNr === "702.272.36"){
      addDisplayTxt(sP.displayTxts, {
        text: `Elektronisk tryck & öppna - Kräver eluttag`,
        level: "info"
      });
      return;
    }
   });
}