const startTxt = "( ! ) Viktigt för garantin -"
let found = false;
export function setBaseCabWarrantyTxt(sP, header){

  const wtInfo = sP.cmInfoFlag?.wtInfo;
  let material = wtInfo.firstCustomArticle?.color;

  if(header.forFlags.sink){
    sP.displayTxts.push(`${startTxt} Hyllplansskydd & tätningssats`)
  }
  else if(header.forFlags.oven || header.forFlags.combiMicro){
    if(!material && wtInfo.preCut > 0){
      sP.displayTxts.push(`${startTxt} Diffusionsspärr`)
    }
    else {
      sP.displayTxts.push("( ! ) Konsoll ska monteras under ugn")
    }

    switch(wtInfo.stats){
        case 1: 
        case 2:{
          if(material === "laminat" || material === "faner" || wtInfo.preCut > 0)
          {
            sP.displayTxts.push(`${startTxt} Diffusionsspärr`)
          }
        }break;
        case 3:
        case 5: {
          sP.displayTxts.push(`${startTxt} Diffusionsspärr`)
        } break;
        case 6: {
          if(wtInfo.preCut > 0){
            sP.displayTxts.push(`${startTxt} Diffusionsspärr`)
          }
        } break;
    }
  }
  else if(header.forFlags.hob){
   sP.displayTxts.push(`${startTxt} Hällskydd`)
  }
  else if(header.forFlags.hobFan){
    if(header.drawerFront === 2) {
      sP.displayTxts.push(`${startTxt} Hällskydd av blind- innerlådsfront`)
    }    
  }
}
export function setHighCabWarrantyTxt(sP, header){
  if(header.forFlags.fridgeOrF){
    sP.displayTxts.push(`${startTxt} Hyllplansskydd & ventilation. KÖP hyllplansskydd säljs ej för tillfället`)
  }
}

export function setFreeStandingWarrantyTxt(sP, header){
  if(header.group2 === "Diskmaskin"){
    sP.displayTxts.push(`${startTxt} Golvskydd och diffusionsspärr`)
  }
  else if (header.group2 === "Kyl/Frys"){
      if(header.name === "SPELNÄS"){
        sP.displayTxts.push(`${startTxt} Golvskydd. KÖP! Vi säljer inte rätt storlek`)
      }
      else{
        sP.displayTxts.push(`${startTxt} Golvskydd och ventilation`)
      }
  }
}

export function IlandWarrantytxt(sP, header){

  header.returnArticles().forEach(article => {
    switch(article.artNr){
      case "805.570.33": {
        if(!found){ headerLegsAndPlints(sP) }
        sP.displayTxts.push(`${startTxt} Köksö ska golvförankras`)
      } break;
      case "805.570.28": {
        if(!found){ headerLegsAndPlints(sP) }
        sP.displayTxts.push("Möjliggör infästning på baksida av stommar")
      } break;
    }  
  });
}

function headerLegsAndPlints(sP){
  sP.displayTxts.push("Ben, socklar och tillbehör köksö")
  found = true;
}

export function meVentWarranty(sP){
  sP.displayTxts.push(`${startTxt} Ventilation i takanslutning ovanför kyl/frys`)
}

