import SectionPortfolio from './models/sectionPortfolio.js' 
import { processLines } from './CollectAndSort/handlers/processLines.js';
import { switchByHeaderVM } from './ValueModifiers/headerSwitchVM.js'
import { switchByHeaderDT } from './DisplayTxtCreate/headerSwitchDT.js';
import { buildArticleTestArrayFromFile, initArticleSequenceTest, finalizeArticleSequenceTest }
from "./CollectAndSort/tests/articleSequenceTest.js";
export let currentSectionPortfolio = new SectionPortfolio();


export function makeTestArray(lines){
  const testArray = buildArticleTestArrayFromFile(lines);
  initArticleSequenceTest(testArray);
}

export function makeReport(){
  const report = finalizeArticleSequenceTest();
  console.log(JSON.stringify(report, null, 2));
  currentSectionPortfolio.returnHeaders().forEach(header => {
     if(header.constructor.name !== "CoverPanelHeader"){
      if(header.artAlert.length > 0) {console.log(header.artAlert)}
    }
  });
}

export function main(lines){
  currentSectionPortfolio = new SectionPortfolio()
  processLines(lines, currentSectionPortfolio);
  switchByHeaderVM(currentSectionPortfolio);
  switchByHeaderDT(currentSectionPortfolio)
  return currentSectionPortfolio.returnDisplayTxts()
}