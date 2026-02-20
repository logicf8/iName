//CheckAndTell\switchTest.js
import { cabColors } from './colorCabs.js';
import { drawerColors } from './colorDrawers.js';
import { familyTypes } from './familyTypes.js'
import { cabColorTxt, drawerColorTxt, familyTypesTxt, drawerGlassTxt } from './switchMakeTxt.js';
import { collectDrawerGlass, compareDrawerGlass } 
  from './drawerGlassCompare.js';

import { checkWidthAndHight as checkOuterWidthAndHight } from './widthAndHight.js';
import { checkDrawerWidthDepthHight } from './drawerWDH.js'

export function doTest(sP) {

  const resultCabColors = cabColors(sP);
  const resultDrawerColors = drawerColors(sP);
  const resultFamilyColor = familyTypes(sP);

  // 1️⃣ Samla data
  const { drawers, glassSides } = collectDrawerGlass(sP);

  // 2️⃣ Jämför
  const resultGlassCompare = compareDrawerGlass(drawers, glassSides);

  // 3️⃣ Skapa texter
  cabColorTxt(sP, resultCabColors);
  drawerColorTxt(sP, resultDrawerColors);
  familyTypesTxt(sP, resultFamilyColor);
  drawerGlassTxt(sP, resultGlassCompare); 
  // 🔎 Debug
  console.log("Drawer/Glass result:", resultGlassCompare);

  // Övriga tester
  sP.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {
      checkOuterWidthAndHight(header);
      checkDrawerWidthDepthHight(header);
    }

  });

  sP.returncheckTxts().forEach(txt => {
    console.log(txt.text);
  });
}
