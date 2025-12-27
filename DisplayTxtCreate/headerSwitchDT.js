import { setFreeStandingWarrantyTxt } from '../ValueModifiers/addWarantyTxt.js';
import { createDisplayTxtCombo } from './comboTxtCreate.js'
import { createFsDisplayName } from './freeStandingTxtCreate.js'
import { openTxt } from './openTxtCreate.js'
import { checkMaterialsAntQuantity } from './handlers/workTops/preInfoWT.js'
import { makeHeaderTxt, DtByArtWT } from './handlers/workTops/workTopArt.js'

export function switchByHeaderDT(sectionPortfolio){

  sectionPortfolio.returnHeaders().forEach(header => {
    header.number = header.originalTxt.split('.')[0];
    switch(header.constructor.name){
      case "CoverPanelHeader": {} break;
      case "CombinationHeader":{ 
        createDisplayTxtCombo(sectionPortfolio, header)
      }break;
      case "OpenHeader": { openTxt(sectionPortfolio, header)} break;
      case "CombinationFreeStanding": { 
        createFsDisplayName(sectionPortfolio, header)
      } break;

      case "SecondStageHeader": {
          switch(header.originalTxt){
          case "Bänkskiva": {
            let wtPreInfo = checkMaterialsAntQuantity(header);
            makeHeaderTxt(sectionPortfolio, wtPreInfo);
            DtByArtWT(sectionPortfolio, header, wtPreInfo);
          }break;  
        }          
      } break;
    }
  });
   
}

