import { G1, G1_1, G1_4_G2, G1_1_G2_6 } from './utils/constants.js'

export function artValuesModifyFreeS(sectionPortfolio, header){
   header.returnArticles().forEach(article => {
      switch(article.group1){ 
         case G1[1]: { //Vitvaror
            if(article.group2 !== G1_1[6]){ //Vitvara
               header.qualifier = true;
               header.name = article.name;
               header.description = article.description;
               header.group2 = article.group2;
               header.group3 = article.group3;
               header.width = article.width;
            }
            else{
               if(article.group3 === G1_1_G2_6[0]){ header.carbonFilter = true; }
            }
         } break
         case G1[4]: { fronts(header, article) } break;
      }
   });
}
function fronts(header, article){
   switch(article.group2){
      case G1_4_G2[0]: { header.withFlags.doors += article.quantity} break;
      case G1_4_G2[1]: { header.withFlags.drawerFronts += article.quantity} break;
   }
}