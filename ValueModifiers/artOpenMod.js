export function artValuesOpen(header){
  header.returnArticles().forEach(article => {
    switch(article.group1){
      case "StommeTyp2": {
        if(header.description === undefined){
          header.description = "Öppet"
          if(header.originalTxt.toLowerCase().includes("bänkskåp")){header.description += " bänkskåp"}
          else if(header.originalTxt.toLowerCase().includes("väggskåp")){header.description += " väggskåp"}
          else {header.description += " skåp"}
          header.description += ` ${article.width} cm`
          if(article.group2 === "vinhylla" || article.group2 === "lådsektion")
            {
              header.description += ` - ${article.group2}`
            }
            combinationSize(header, article)
          }
          else {
            if(article.group2 === "vinhylla" || article.group2 === "lådsektion")
              {
                header.description += `/${article.group2}`
              }
              combinationSize(header, article)
            } 
          
          } break; 
      
      case "StommeEnhet": {
        header.description = `${article.description} ${article.width} cm, med hyllplan (Enhet)`
        combinationSize(header, article)
      } break;
      
    }
      
  })
}

function combinationSize(header, article){
    header.width = parseInt(article.width);
    header.depth = parseInt(article.depth);
    header.height += parseInt(article.height);    
}