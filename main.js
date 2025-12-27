import SectionPortfolio from './models/sectionPortfolio.js' 
import { processLines } from './CollectAndSort/handlers/processLines.js';
import { switchByHeaderVM } from './ValueModifiers/headerSwitchVM.js'
import { switchByHeaderDT } from './DisplayTxtCreate/headerSwitchDT.js';

const currentSectionPortfolio = new SectionPortfolio();

export function main(lines){
  processLines(lines, currentSectionPortfolio);
  switchByHeaderVM(currentSectionPortfolio);
  switchByHeaderDT(currentSectionPortfolio);
  return currentSectionPortfolio.returnDisplayTxts()
}