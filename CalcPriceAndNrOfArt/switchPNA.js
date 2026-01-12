import {G1, G1_4_G2, G1_1_G2_3} from '../ValueModifiers/utils/constants.js'

export function CalcPNA(sP) {
  sP.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CoverPanelHeader") {
      header.returnArticles().forEach(article => {
        if (article.group1 === "Måttbeställt" && article.group3 !== "Operation" || article.name === "YTTRE") {
          sP.countPriceFlag.totCountArt += 1;
        } else {
          sP.countPriceFlag.totCountArt += Number(article.quantity) || 0;
        }
      switch(article.group1){
        case G1[0]: 
        case "StommeTyp2":
        case "StommeEnhet":{
          sP.countPriceFlag.pCabinets += article.totPrice;
        } break;
        case G1[1]: {
          //if(article.group2 !== G1_1_G2_3[1]){
          sP.countPriceFlag.pAppliance += article.totPrice;
          //}
        } break;
        case G1[4]: {
          switch(article.group2){
            case G1_4_G2[0]:
            case G1_4_G2[1]:
            case G1_4_G2[2]:{
              sP.countPriceFlag.pFronts += article.totPrice;
            }break;
            case G1_4_G2[3]:
            case G1_4_G2[4]:{
              sP.countPriceFlag.pCoverPanel += article.totPrice;
            }break;
            default:{
              sP.countPriceFlag.pOther += article.totPrice;
            }break;
          }
        } break;
        case G1[5]: {} break;
        default: {
          sP.countPriceFlag.pOther += article.totPrice;
        }
      }
      if(article.totPrice)
      {
        sP.countPriceFlag.totPrice += article.totPrice;
      }
      else{
      //  console.log(header)
      }
    });
      /*   totCountArt: 0,
      pCabinets: 0,
      pFronts: 0,
      pCoverPanel: 0,
      pCustomMade: 0,
      pAppliance: 0,
      pLight: 0,
      pOther: 0 */



    }
  });
}
