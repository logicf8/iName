import { setBaseCabWarrantyTxt, setHighCabWarrantyTxt, setFreeStandingWarrantyTxt, IlandWarrantytxt } from './addWarantyTxt.js';
import { createDisplayTxtCombo } from './comboTxtCreate.js';
import { createFsDisplayName } from './freeStandingTxtCreate.js';
import { openTxt } from './openTxtCreate.js';
import { makeHeaderTxt, DtByArt } from './customMadeTxtCreate.js';
import { workTopCfg } from './customMadeConfigs/workTopCfg.js';
import { wallPanelCfg } from './customMadeConfigs/wallPanelCfg.js';
import { noNrHeaders } from '../CollectAndSort/utils/headerConstants.js';
import { cPanels, handels, otherArt } from './secondStageTxt.js';
import { filter } from '../global/myConstants.js';
import { artAddTxt, artAddTxtHinge } from './artTxtCreate.js';

export function switchByHeaderDT(sectionPortfolio) {
  let wTcount = 0, wPcount = 0;

  // Första pass: skapa headers och DtByArt
  sectionPortfolio.returnHeaders().forEach(header => {
    if(header.constructor.name === "SecondStageHeader") {
      switch(header.originalTxt) {

        case "Bänkskiva": // Bänkskiva
          if(wTcount === 0) {
            makeHeaderTxt(sectionPortfolio, workTopCfg);
            wTcount = 99;
          }
          DtByArt(sectionPortfolio, header, workTopCfg);
          break;

        case "Väggplatta": // Väggplatta
        case "Väggpanel":
          if(wPcount === 0) {
            makeHeaderTxt(sectionPortfolio, wallPanelCfg);
            wPcount = 99;
          }
          DtByArt(sectionPortfolio, header, wallPanelCfg);
          break;
      }
    }
  });

  // Andra pass: skapa displayTxt etc.
  sectionPortfolio.returnHeaders().forEach(header => {
    header.number = header.originalTxt.split('.')[0];

    switch(header.constructor.name) {

      case "CoverPanelHeader":
        break;

      case "CombinationHeader":
        createDisplayTxtCombo(sectionPortfolio, header);

        if(header.type === filter.Cabinet.group2.Base) { // Bänkskåp
          setBaseCabWarrantyTxt(sectionPortfolio, header);
        } else if(header.type === filter.Cabinet.group2.High) { // Högskåp
          setHighCabWarrantyTxt(sectionPortfolio, header);
        }

        if(header.forFlags.sink === true) {
          artAddTxt(sectionPortfolio, header);
        }

        const activeHinges = Object.entries(header.hingeFlags)
          .filter(([, value]) => value > 0)
          .map(([type, count]) => ({ type, count }));

        if(activeHinges.length >= 2) {
          artAddTxtHinge(activeHinges, sectionPortfolio)
        }
        break;

      case "OpenHeader":
        openTxt(sectionPortfolio, header);
        break;

      case "CombinationFreeStanding":
        createFsDisplayName(sectionPortfolio, header);
        setFreeStandingWarrantyTxt(sectionPortfolio, header);
        break;

      case "SecondStageHeader":
        switch(header.originalTxt) {

          case noNrHeaders[0]: break; // Skena
          case noNrHeaders[1]: IlandWarrantytxt(sectionPortfolio, header); break; // Ben och socklar
          case noNrHeaders[2]: cPanels(sectionPortfolio); break; // Täcksidor
          case noNrHeaders[3]:
          case noNrHeaders[4]: handels(sectionPortfolio, header); break; // Knoppar handtag
          case noNrHeaders[5]: break; // Bänkskiva
          case noNrHeaders[6]:
          case noNrHeaders[7]: break; // Väggplatta
          case noNrHeaders[8]: break; // Belysningstillbehör
          case noNrHeaders[9]: break; // Matplats
          case noNrHeaders[10]:
          case noNrHeaders[11]: otherArt(sectionPortfolio, header); break; // Övrigt / Andra produkter
          default:
            // header.displayTxt = header.originalTxt;
            break;
        }
        break;
    }
  });
}
