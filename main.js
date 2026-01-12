import SectionPortfolio from './models/sectionPortfolio.js' 
import { processLines } from './CollectAndSort/handlers/processLines.js';
import { switchByHeaderVM } from './ValueModifiers/headerSwitchVM.js'
import { switchByHeaderDT } from './DisplayTxtCreate/headerSwitchDT.js';
import { buildArticleTestArrayFromFile, initArticleSequenceTest, finalizeArticleSequenceTest }
from "./CollectAndSort/tests/articleSequenceTest.js";
export let currentSectionPortfolio = new SectionPortfolio();
import { CalcPNA } from './CalcPriceAndNrOfArt/switchPNA.js';

export function makeTestArray(lines){
  const testArray = buildArticleTestArrayFromFile(lines);
  initArticleSequenceTest(testArray);
}

export function makeReport(){
  const report = finalizeArticleSequenceTest();
  console.log(JSON.stringify(report, null, 2));
  currentSectionPortfolio.returnHeaders().forEach(header => {
     if(header.constructor.name !== "CoverPanelHeader"){
      if(header.missingAlert.length > 0) {console.log(header.missingAlert)}
    }
  });
}

export function main(lines){
  currentSectionPortfolio = new SectionPortfolio()
  processLines(lines, currentSectionPortfolio);
  switchByHeaderVM(currentSectionPortfolio);
  switchByHeaderDT(currentSectionPortfolio)
  CalcPNA(currentSectionPortfolio)
  currentSectionPortfolio.returnHeaders().forEach(header => {
    
      //console.log(header.displayTxt)
    
  }); 
  //console.log("Stommar: " + currentSectionPortfolio.countPriceFlag.pCabinets)
  //console.log("Fronter: " + currentSectionPortfolio.countPriceFlag.pFronts)
  //console.log("Täcksidor: " + currentSectionPortfolio.countPriceFlag.pCoverPanel)
  //console.log("Måttbeställt: " + currentSectionPortfolio.countPriceFlag.pCustomMade)
  //console.log("Vitvaror: " + currentSectionPortfolio.countPriceFlag.pAppliance)
  //console.log("Annat: " + currentSectionPortfolio.countPriceFlag.pOther)
  //console.log("TotaltPris: " + currentSectionPortfolio.countPriceFlag.totPrice)
  return currentSectionPortfolio.returnDisplayTxts()
}