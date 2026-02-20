import SectionPortfolio from './models/sectionPortfolio.js' 
import { processLines } from './CollectAndSort/handlers/processLines.js';
import { switchByHeaderVM } from './ValueModifiers/headerSwitchVM.js'
import { switchByHeaderDT } from './DisplayTxtCreate/headerSwitchDT.js';
import { buildArticleTestArrayFromFile, initArticleSequenceTest, finalizeArticleSequenceTest }
from "./CollectAndSort/tests/articleSequenceTest.js";
export const currentSectionPortfolio = new SectionPortfolio();
import { CalcPNA,  } from './reportTxtCreate/switchPNA.js';
import { reportOverView } from './reportTxtCreate/txtDisplayReports.js'
import { getCpFamilies } from './downLoadArt/coverPanels.js'
import { doTest } from './CheckAndTell/switchTest.js'

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
  Object.assign(currentSectionPortfolio, new SectionPortfolio());

  processLines(lines, currentSectionPortfolio);
  switchByHeaderVM(currentSectionPortfolio);
  switchByHeaderDT(currentSectionPortfolio)
  CalcPNA(currentSectionPortfolio)
  doTest(currentSectionPortfolio);
  reportOverView(currentSectionPortfolio)
  getCpFamilies(currentSectionPortfolio)
  return currentSectionPortfolio.returnDisplayTxts()
}