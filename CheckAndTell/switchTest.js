// CheckAndTell/switchTest.js

import { cabColors } from './colorCabs.js';
import { drawerColors } from './colorDrawers.js';
import { familyTypes } from './familyTypes.js';
import { shelfColors } from './shelfTypeColor.js';
import { spotLightColors } from './spotLightColors.js';

import { 
  cabColorTxt, 
  drawerColorTxt,
  shelfColorTxt, 
  familyTypesTxt, 
  drawerGlassTxt, 
  outerWidthHeightTxt, 
  innerHeightTxt,
  benchLightTypeWidthTxt,
  spotLightTxt
} from './switchMakeTxt.js';

import { 
  collectDrawerGlass, 
  compareDrawerGlass 
} from './drawerGlassCompare.js';

import { checkOuterWidthAndHight } from './outherHight.js';
import { checkInnerHeight } from './innerHeight.js';
import { benchLightTypeWidth } from './benchLightTypeWidth.js';


export function doTest(sP) {

  console.log("==================================================");
  console.log("START doTest()");


  // ----------------------
  // Färgtester
  // ----------------------

  console.log("✅ Kör cabColors");
  const resultCabColors = cabColors(sP);

  console.log("✅ Kör drawerColors");
  const resultDrawerColors = drawerColors(sP);

  console.log("✅ Kör shelfColors");
  const resultShelfColors = shelfColors(sP);

  console.log("✅ Kör familyTypes");
  const resultFamilyColor = familyTypes(sP);


  // ----------------------
  // Spottar
  // ----------------------

  console.log("✅ Kör spotLightColors");
  const resultSpotLights = spotLightColors(sP);


  // ----------------------
  // Glassidor
  // ----------------------

  console.log("✅ Samlar in drawer glass");
  const { drawers, glassSides } = collectDrawerGlass(sP);

  console.log("✅ Jämför drawer glass");
  const resultGlassCompare = compareDrawerGlass(drawers, glassSides);


  // ----------------------
  // Outer mått
  // ----------------------

  console.log("✅ Kontrollera yttre mått");
  const resultOuter = checkOuterWidthAndHight(sP);


  // ----------------------
  // Inner höjd
  // ----------------------

  console.log("✅ Kontrollera innerhöjd");
  const resultInner = checkInnerHeight(sP);


  // ----------------------
  // Bench Light Type Width
  // ----------------------

  console.log("✅ Kontrollera benchLightTypeWidth");
  const resultLight = benchLightTypeWidth(sP);


  // ----------------------
  // Skapa texter
  // ----------------------

  console.log("✅ Skapar texter med switchMakeTxt");

  familyTypesTxt(sP, resultFamilyColor);
  cabColorTxt(sP, resultCabColors);
  drawerColorTxt(sP, resultDrawerColors);
  drawerGlassTxt(sP, resultGlassCompare);
  shelfColorTxt(sP, resultShelfColors);
  spotLightTxt(sP, resultSpotLights);
  benchLightTypeWidthTxt(sP, resultLight);
  outerWidthHeightTxt(sP, resultOuter);
  innerHeightTxt(sP, resultInner);


  console.log("==================================================");
  console.log("doTest() KLAR");

}