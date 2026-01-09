import { 
  G1, G1_0, G1_0_G3,  // ["Stomme", "Vitvara", "Diskho", "InredningStomme", "FrontFamilj", "FrontTillbehör"] ["Inbyggnad", "Hörn", "Fläkt"]
  G1_1, G1_1_G2_3,    // ["Inbyggd fläkt"] 
  G1_3_G2, G1_3_G2_0, // ["Låda", "Utdrag", "Innerlådfront", "Påbyggnadssidor", "Tillbehör"] ["Låda", "Utdrag", "Innerlådfront", "Påbyggnadssidor", "Tillbehör"]
  G1_4_G2, G1_4_G2_0, // ["Dörr", "Lådfront", "Front för diskmaskin"] ["Vitrindörr"]
  G1_5_G2, G1_5_G2_0, G1_5_G2_1  //["Gångjärn", "FrontPåverkande"] ["horrisontella"] ["LådaPåDörr", "MontKitUtdrag", "Koppling"] 
} from './utils/constants.js'



export function artValuesModifyComb(sectionPortfolio, header){
   header.returnArticles().forEach(article => {
    switch(article.group1){
      case G1[0]: { combinationTypeAndSize(sectionPortfolio, header, article) } break; //Bänkskåp
      case G1[1]: { typeOfAppliance(sectionPortfolio, header, article); } break; //Vitvara
      case G1[2]: { if(article.group2 !== G1_3_G2_0[4]){header.forFlags.sink = true; sectionPortfolio.cmInfoFlag.sinks += 1; } } break; //Diskho. Inte tillbehör.
      case G1[3]: { interior(header, article); } break; //InredningStomme
      case G1[4]: { fronts(header, article) } break; //FrontFamilj
      case G1[5]: { frontAcc(header, article)} break; //FrontTillbehör
    }
  });
}

function frontAcc(header, article){
  switch(article.group2){
    case G1_5_G2[0]: { //Horrisontella gångjärn
      if(article.group3 === G1_5_G2_0[0])
      {  
        header.hingeFlags.hHorr += article.quantity;
      }  
    } break;
    case G1_5_G2[1]: 
    {
      if(article.group3 === G1_5_G2_1[0]){ //LådaPåDörr => dörr = lådfront
        header.withFlags.doors -= article.quantity;
        header.drawersFlags.drawerFront += article.quantity;
      }
      else if(article.group3 === G1_5_G2_1[1]){ //Monteringskit för utdrag 
        header.withFlags.drawers -= 2 * article.quantity;
        header.withFlags.pullOut += article.quantity; 
      }
      else if(article.group3 === G1_5_G2_1[2]){ //Koppligsskena => 2 fronter blir en.
        header.withFlags.conectFronts += article.quantity;
        header.drawersFlags.drawerFront -= article.quantity;
      }  
    } break;
  }
}
function interior(header, article){
  switch(article.group2) {
    case G1_3_G2[0]: 
    {
      switch(article.group3){
        case G1_3_G2_0[0]: { header.withFlags.drawers += article.quantity } break;
        case G1_3_G2_0[1]: { header.withFlags.pullOut += article.quantity } break;
        case G1_3_G2_0[2]: { header.withFlags.innerDF += article.quantity } break;
      }
    } break;
    case G1_3_G2[1]: { let x = 1; article.group3 === G1_3_G2_0[0] ? x = 1 : x = 2;  header.withFlags.shelfs += article.quantity * x;} break; //Vanliga hyllplan säljs i 2 pack.
    case G1_3_G2[2]: { header.withFlags.wireBaskets += article.quantity; } break;
    case G1_3_G2[3]: { header.withFlags.workSerfaces += article.quantity; } break;
    case G1_3_G2[4]: { header.withFlags.larder += article.quantity; } break;
    case G1_3_G2[5]: { header.withFlags.cleaningInt += article.quantity; } break;
    case G1_3_G2[6]: { header.withFlags.carousel += article.quantity; } break;
  }
}
function fronts(header, article)
{
  switch (article.group2){
    case G1_4_G2[0]: { 
      article.group3 === G1_4_G2_0[0] ? header.withFlags.glasDoors += article.quantity : header.withFlags.doors += article.quantity;  
    }break;
    case G1_4_G2[1]: { 
      let x = 1; article.height === 10 ? x = 2 : x = 1; header.drawersFlags.drawerFront += article.quantity * x //Lådfront H10 säljs i 2 pack.
    }
  }
}
function typeOfAppliance(sectionPortfolio, header, article){
  switch(article.group2){
    case G1_1[0]: { header.forFlags.oven = true; } break;
    case G1_1[1]: { header.forFlags.combiMicro = true; } break;
    case G1_1[2]: { header.forFlags.micro = true; } break;
    case G1_1[3]: { article.group3 === G1_1_G2_3[0] ? header.forFlags.hobFan = true : header.forFlags.hob = true; sectionPortfolio.cmInfoFlag.hobs += article.quantity; } break;
    case G1_1[4]: { header.forFlags.fan = true; } break;
    case G1_1[5]: { header.forFlags.fridgeOrF = true; header.applianceDescription === undefined ? header.applianceDescription = article.description : header.applianceDescription = "kyl och fys";} break; // Transport av kyl eller frys.
    case G1_1[6]: {
      switch(article.artNr){
        case "406.204.80": //Hyllplansskydd diskbänksskåp
        case "606.204.79":
        case "806.204.78": { header.forFlags.sink = true }break;
        case "102.432.96": //Hällskydd
        case "302.432.95": { header.forFlags.hob = true; }break;
        case "302.214.58": { header.forFlags.fridgeOrF = true; }break; //ventilationsgaller sockel
        case "103.019.60": { header.forFlags.oven = true; }break; //Konsol för ugn
      }
    }break;
  }  
}

function combinationTypeAndSize(sectionPortfolio, header, article){
  let type = "";
  if(header.description === undefined || article.description === G1_0[2]){
    if(article.group2 === G1_0[3] && (header.originalTxt.includes("METOD - Base cabinet") || header.originalTxt.includes("METOD - Bänkskåp"))){ //Benämning för överskåp som används som bänkskåp
      header.description = `${G1[0]} ${article.width} cm av överskåp`; type = G1[0];
    }
    else if(article.group2 === G1_0[0] && header.originalTxt.includes("Bänkhörnskåp 135 grader")){ //Bänkskåp
      header.description = `${G1[4]}  ${article.width} cm`; header.corner135 = true; type = G1[0]; //Bänkhörnskåp
      sectionPortfolio.cmInfoFlag.corner135 += article.quantity; 
    }
    else{
      header.description = `${article.description} ${article.width} cm`; type = article.group2; 
    }

    header.type = type;
    header.width = parseInt(article.width);
    header.depth = parseInt(article.depth);
    header.height += parseInt(article.height);    
  }

  switch(article.group3){
    case G1_0_G3[0]: { header.builtIn = true;} break;
    case G1_0_G3[1]: { header.corner = true; sectionPortfolio.cmInfoFlag.corners += article.quantity; } break;  
    case G1_0_G3[2]: { header.fan = true; } break;
  }
}
