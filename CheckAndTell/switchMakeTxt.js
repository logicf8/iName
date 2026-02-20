//CheckAndTell\switchMakeTxt.js
import { addCATtxt } from './helper/displayCAndTxt.js'

export function cabColorTxt(sP, resultCabColors) {

  if (!resultCabColors) return;

  let colorText = "";

  if (resultCabColors.sameColor) {
    colorText = resultCabColors.color;
  } else {
    const colors = Object.keys(resultCabColors.colors);
    colorText = colors.join(" / ");
  }

  const mapToUse = resultCabColors.colorMap || resultCabColors.colors;

  const rows = Object.keys(mapToUse).map(color => ({
    color,
    numbers: mapToUse[color] // array
  }));

  addCATtxt(sP.checkTxts, {
    title: "Stomme",
    text: colorText,
    level: "info",
    pic: "stommar.avif",
    rows,
    message: "3st möjliga resultat: \n[1]. vit = alla stommar är vita. \n[2]. svartGrå = alla stommar är svartgrå. \n[3]. vit/svartgrå = stommar finns i båda färgerna."
  });
}

export function drawerColorTxt(sP, resultDrawerColors) {

  if (!resultDrawerColors) return;

  let colorText = "";

  // Text som visas överst
  if (resultDrawerColors.sameColor) {
    colorText = resultDrawerColors.color;
  } else {
    const colors = Object.keys(resultDrawerColors.colors);
    colorText = colors.join(" / ");
  }

  // Map att använda (colorMap är nu Set per färg)
  const mapToUse = resultDrawerColors.colorMap || resultDrawerColors.colors;

  // Skapa rows med unika header.numbers
  const rows = Object.keys(mapToUse).map(color => ({
    color,
    numbers: Array.isArray(mapToUse[color])
      ? mapToUse[color]
      : Array.from(mapToUse[color])
  }));

  // Lägg till i checkTxts
  addCATtxt(sP.checkTxts, {
    title: "Låda",
    text: colorText,
    level: "info",
    pic: "drawers.avif",
    rows,
    message: "3st möjliga resultat: \n[1]. vit = alla lådor är vita. \n[2]. mörkgrå = alla lådor är mörkgrå. \n[3]. vit/mörkgrå = lådor finns i båda färger."
  });
}
export function familyTypesTxt(sP, resultFamilyTypes) {
  if (!resultFamilyTypes) return;

  let colorText = "";
  let colorMap = {};

  if (resultFamilyTypes.sameColor) {
    colorText = resultFamilyTypes.color;
    // Skapa en "colors" struktur med ett fiktivt nummer så rows fungerar
    colorMap[colorText] = resultFamilyTypes.numbers || []; // använd numbers om den finns
  } else {
    const colors = Object.keys(resultFamilyTypes.colors);
    colorText = colors.join(" / ");
    colorMap = resultFamilyTypes.colors;
  }

  // Skapa rows med alla header.numbers oberoende av sameColor
  const rows = Object.keys(colorMap).map(color => ({
    color,
    numbers: Array.isArray(colorMap[color]) ? colorMap[color] : Array.from(colorMap[color])
  }));

  addCATtxt(sP.checkTxts, {
    title: "Frontfamilj",
    text: colorText,
    level: "info",
    pic: "fronter.avif",
    rows,
    message: "2st möjliga resultat:\n[1]. Endast ett namn = Alla artiklar tillhör samma frontfamilj.\n[2]. Flera namn = Artiklar finns i flera olika frontfamiljer."
  });
}

export function drawerGlassTxt(sP, resultGlass) {

  if (!resultGlass) return;

  let glassText = "";

  const {
    allMatched,
    allHighDrawersHaveGlass,
    allMedDrawersHaveGlass,
    headersWithHighGlass,
    headersWithMedGlass,
    headersWithoutHighGlass,
    headersWithoutMedGlass
  } = resultGlass;

  const highCount = headersWithHighGlass.size;
  const medCount = headersWithMedGlass.size;

  // -------------------------
  // TEXTLOGIK (oförändrad)
  // -------------------------
  if (highCount === 0 && medCount === 0) {
    glassText = "Inga alls";
  } else if (allMatched) {
    glassText = "Alla lådor";
  } else {
    if (allHighDrawersHaveGlass && medCount === 0) {
      glassText = "Endast alla höga lådor";
    } else if (allMedDrawersHaveGlass && highCount === 0) {
      glassText = "Endast alla medel-lådor";
    } else if (!allHighDrawersHaveGlass && medCount === 0) {
      glassText = "Vissa höga lådor";
    } else if (!allMedDrawersHaveGlass && highCount === 0) {
      glassText = "Vissa medel-lådor";
    } else {
      glassText = "Vissa medel-/höga lådor";
    }
  }

  // -------------------------
  // VIKTIGT: skapa rows
  // -------------------------

  const rows = [
    {
      color: "Hög med glassidor",
      numbers: Array.from(headersWithHighGlass || [])
    },
    {
      color: "Medel med glassidor",
      numbers: Array.from(headersWithMedGlass || [])
    },
    {
      color: "Hög utan glassidor",
      numbers: Array.from(headersWithoutHighGlass || [])
    },
    {
      color: "Medel utan glassidor",
      numbers: Array.from(headersWithoutMedGlass || [])
    }
  ];

  addCATtxt(sP.checkTxts, {
    title: "Glassidor:",
    text: glassText,
    level: "info",
    pic: "glassidor.avif",
    rows, // ← DETTA VAR DET SOM SAKNADES
    message:
      "7st möjliga resultat: \n" +
      "[1]. Inga alls = Det finns inga glassidor. \n" +
      "[2]. Alla lådor = Det finns glassidor i alla* lådor. \n" +
      "[3]. Endast höga lådor = Glassidor finns i alla höga lådor men INGEN till medellådor. \n" +
      "[4]. Endast medel-lådor = Samma som [3.] men tvärt om. \n" +
      "[5]. Vissa höga lådor = Det finns höga glassidor men inte till alla höga lådor men INGEN till medellådor. \n" +
      "[6]. Vissa medel-lådor = Samma som [5.] men tvärt om. \n" +
      "[7]. Vissa medel-/höga lådor = Det finns glassidor av båda höjder men inte till alla lådor. \n" +
      "*OBS! Kontroll görs endast på lådor som kan ha glassidor"
  });
}
