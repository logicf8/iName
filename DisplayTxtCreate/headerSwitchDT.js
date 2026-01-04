import { setBaseCabWarrantyTxt, setHighCabWarrantyTxt, setFreeStandingWarrantyTxt, IlandWarrantytxt } from './addWarantyTxt.js';
import { createDisplayTxtCombo } from './comboTxtCreate.js'
import { createFsDisplayName } from './freeStandingTxtCreate.js'
import { openTxt } from './openTxtCreate.js'
import { makeHeaderTxt, DtByArt } from './customMadeTxtCreate.js';
import { workTopCfg } from './customMadeConfigs/workTopCfg.js';
import { wallPanelCfg } from './customMadeConfigs/wallPanelCfg.js';
import { noNrHeaders } from '../CollectAndSort/utils/headerConstants.js'
import { cPanels, handels, otherArt } from './secondStageTxt.js';
import { G1_0, G1_6_G2 } from '../ValueModifiers/utils/constants.js';
import { artAddTxt } from './artTxtCreate.js';
export function switchByHeaderDT(sectionPortfolio){
  let wTcount = 0, wPcount = 0;

  sectionPortfolio.returnHeaders().forEach(header => {
      switch(header.constructor.name){
        case "SecondStageHeader": {
          switch(header.originalTxt){
            case G1_6_G2[0]: { // Bänkskiva
              if (wTcount === 0) {
              makeHeaderTxt(sectionPortfolio, workTopCfg);
              wTcount = 99;
              }
              DtByArt(sectionPortfolio, header, workTopCfg);
            } break;
            case G1_6_G2[1]:
            case "Väggpanel": {
              if (wPcount === 0) {
                makeHeaderTxt(sectionPortfolio, wallPanelCfg);
                wPcount = 99;
              }
            DtByArt(sectionPortfolio, header, wallPanelCfg);
            } break;
        }
      }
    }
  })

  sectionPortfolio.returnHeaders().forEach(header => {
    header.number = header.originalTxt.split('.')[0];
    switch(header.constructor.name){
      case "CoverPanelHeader": {} break;
      case "CombinationHeader":{ 
        createDisplayTxtCombo(sectionPortfolio, header)
        if(header.type === G1_0[0]){ //Bänkskåp
          setBaseCabWarrantyTxt(sectionPortfolio, header)
        }
        else if(header.type === G1_0[2]){ //Högskåp
          setHighCabWarrantyTxt(sectionPortfolio, header)
        }
        if(header.forFlags.sink === true){
          artAddTxt(sectionPortfolio, header)
        }
        
      }break;
      case "OpenHeader": { openTxt(sectionPortfolio, header)} break;
      case "CombinationFreeStanding": { 
        createFsDisplayName(sectionPortfolio, header)
        setFreeStandingWarrantyTxt(sectionPortfolio, header)
      } break;

      case "SecondStageHeader": {
          
          switch(header.originalTxt){
          case noNrHeaders[0]: {} break; //Skena
          case noNrHeaders[1]: { IlandWarrantytxt(sectionPortfolio, header)} break; //Ben och socklar
          case noNrHeaders[2]: { cPanels(sectionPortfolio)} break; //Täcksidor
          case noNrHeaders[3]: 
          case noNrHeaders[4]: { handels(sectionPortfolio, header) } break; //Knoppar handtag
          case noNrHeaders[5]: {} break; //Bänkskiva
          case noNrHeaders[6]:  
          case noNrHeaders[7]: {} break; //Väggplatta
          case noNrHeaders[8]: {} break; //Belysningstillbehör
          case noNrHeaders[9]: {} break; //Matplats
          case noNrHeaders[10]: //Övrigt
          case noNrHeaders[11]: { otherArt(sectionPortfolio, header)  } break; //Andra produkter
          default: {
            //header.displayTxt = header.originalTxt;
          }  
        }          
      } break;
    }
  });
   
}

