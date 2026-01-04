export function artAddTxt(sP, header){
  header.returnArticles().forEach(article => {
    if(article.artNr === "702.272.36"){
      sP.displayTxts.push("Elektronisk tryck & öppna - Kräver eluttag")
      return;
    }
    

   });
}


