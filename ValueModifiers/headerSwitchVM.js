import { createTxtByME as meValuesIfNeeded } from './meHandler/meTxtExtractor.js'
import { artValuesModifyComb } from './artCombMod.js'
import { forButNotInCombo } from './artComboSecondPassMod.js'
import { artValuesModifyFreeS } from './artFreeStandMod.js'
import { artValuesOpen } from './artOpenMod.js'
import { setBaseCabWarrantyTxt, setHighCabWarrantyTxt, setFreeStandingWarrantyTxt } from './addWarantyTxt.js'

import { checkMaterialsAntQuantity } from '../DisplayTxtCreate/handlers/workTops/preInfoWT.js'
import { createDisplayTxtCombo } from '../DisplayTxtCreate/comboTxtCreate.js'
import { createFsDisplayName } from '../DisplayTxtCreate/freeStandingTxtCreate.js'

export function switchByHeaderVM(sectionPortfolio){
  sectionPortfolio.returnHeaders().forEach(header => {
    if(header.constructor.name !== "SecondStageHeader"){
      header.number = header.originalTxt.split('.')[0];
    }
    switch(header.constructor.name){
      case "CoverPanelHeader": {} break;
      case "CombinationHeader":{ 
        artValuesModifyComb(sectionPortfolio, header);
        meValuesIfNeeded(header);
        forButNotInCombo(header);
        if(header.type === "Bänkskåp"){
          setBaseCabWarrantyTxt(header)
        }
        else if(header.type === "Högskåp"){
          setHighCabWarrantyTxt(header)
        }
      }break;
      case "OpenHeader": {
        artValuesOpen(header)

      } break;
      case "CombinationFreeStanding": {
        meValuesIfNeeded(header);
        artValuesModifyFreeS(sectionPortfolio, header)
        //Lägg till ME safe
        setFreeStandingWarrantyTxt(header) 
      } break;
      case "SecondStageHeader": {
        switch(header.originalTxt){
          case "Bänkskiva": {
              //let wtPreInfo = checkMaterialsAntQuantity(header);
              //makeHeaderTxt(sectionPortfolio, wtPreInfo)
              //DtByArtWT(sectionPortfolio, header, wtPreInfo);
          } break;
        }  
      } break;
    }
   });
}