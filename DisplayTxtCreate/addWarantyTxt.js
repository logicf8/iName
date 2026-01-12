import { addDisplayTxt } from "./helpers/displayTxtHelpers.js";

const startTxt = "( ! ) Viktigt för garantin -"
let found = false;
export function setBaseCabWarrantyTxt(sP, header){

  const wtInfo = sP.cmInfoFlag?.wtInfo;
  let material = wtInfo?.firstCustomArticle?.color;

  if(header.forFlags.sink){

    addDisplayTxt(sP.displayTxts, {
      text: `${startTxt} Hyllplansskydd & tätningssats`,
      level: "info"
    });
  }
  else if(header.forFlags.oven || header.forFlags.combiMicro){
    if(!material && wtInfo?.preCut > 0){
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Diffusionsspärr`,
        level: "info"
      });
    }
    else {
      addDisplayTxt(sP.displayTxts, {
        text: "( ! ) Ugn står på ungskonsol",
        level: "info"
      });
    }

    switch(wtInfo?.stats){
        case 1: 
        case 2:{
          if(
            material === "laminat" || 
            material === "faner" || 
            wtInfo.preCut > 0
            )
          {
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Diffusionsspärr`,
              level: "info"
            });
          }
        }break;

        case 3:
        case 5: {
          addDisplayTxt(sP.displayTxts, {
            text: `${startTxt} Diffusionsspärr`,
            level: "info"
          });

        } break;
        case 6: {
          if(wtInfo?.preCut > 0){
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Diffusionsspärr`,
              level: "info"
            });
          }
        } break;
    }
  }
  else if(header.forFlags.hob){
    addDisplayTxt(sP.displayTxts, {
      text: `${startTxt} Hällskydd`,
      level: "info"
    });
  }
  else if(header.forFlags.hobFan){
    if(header.drawerFront === 2) {
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Hällskydd av blind- innerlådsfront`,
        level: "info"
      });

    }    
  }
}
export function setHighCabWarrantyTxt(sP, header){
  if(header.forFlags.fridgeOrF){
    let txtTemp = "(!) Viktigt för garantin -"
    addDisplayTxt(sP.displayTxts, {
      text: `${txtTemp} Hyllplansskydd & ventilation. KÖP hyllplansskydd säljs ej för tillfället`,
      level: "info"
    });
  }
}

export function setFreeStandingWarrantyTxt(sP, header){
  if(header.group2 === "Diskmaskin"){
    addDisplayTxt(sP.displayTxts, {
      text: `${startTxt} Golvskydd och diffusionsspärr`,
      level: "info"
    });  
  }
  else if (header.group2 === "Kyl/Frys"){
    if(header.name === "SPELNÄS"){
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Golvskydd. KÖP! Vi säljer inte rätt storlek`,
        level: "info"
      });
    }
    else{
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Golvskydd och ventilation`,
        level: "info"
      });
    }
  }
}

export function IlandWarrantytxt(sP, header){

  header.returnArticles().forEach(article => {
    switch(article.artNr){
      case "805.570.33": {
        if(!found){ headerLegsAndPlints(sP) }
          addDisplayTxt(sP.displayTxts, {
            text: `${startTxt} Köksö ska golvförankras`,
            level: "info"
          });
      } break;
      case "805.570.28": {
        if(!found){ headerLegsAndPlints(sP) }
          addDisplayTxt(sP.displayTxts, {
            text: "Möjliggör infästning på baksida av stommar",
            level: "info"
          });
      } break;
    }  
  });
}

function headerLegsAndPlints(sP){
  addDisplayTxt(sP.displayTxts, {
    text: "Ben, socklar och tillbehör köksö",
    level: "info"
  });
  found = true;
}

export function meVentWarranty(sP){
  addDisplayTxt(sP.displayTxts, {
    text: `${startTxt} Ventilation i takanslutning ovanför kyl/frys`,
    level: "info"
  });
}

