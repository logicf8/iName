//CheckAndTell\switchMakeTxt.js
import { addCATtxt } from './helper/displayCAndTxt.js'

export function familyTypesTxt(sP, resultFamilyTypes) {
  let colorText = "Nej"; // default om ingen frontfamilj finns
  let colorMap = {};
  let pic = "fronter.png";
  let rows = [];

  if (resultFamilyTypes) {
    if (resultFamilyTypes.sameColor) {
      colorText = resultFamilyTypes.color;
      colorMap[colorText] = resultFamilyTypes.numbers || [];
    } else {
      const colors = Object.keys(resultFamilyTypes.colors);
      colorText = colors.join(" / ");
      colorMap = resultFamilyTypes.colors;
    }

    rows = Object.keys(colorMap).map(color => ({
      color,
      numbers: Array.isArray(colorMap[color])
        ? colorMap[color]
        : Array.from(colorMap[color])
    }));
  }

  addCATtxt(sP.checkTxts, {
    title: "Frontfamilj",
    text: colorText,
    level: "info",
    pic: pic,
    rows,
    message:
      "Här kontrolleras vilka frontfamiljer* som påträffas, varpå en unik lista presenteras.\n" +
      "Via 🔍 kan man utläsa i vilken nummer (stomme) dessa finns.\n" +
      "♦ Nej, betyder att inga artiklar tillhörande en frontfamilj har hittats.\n" +
      "* Frontfamilj = alla artiklar som tillhör t.ex. Axstad grön" 
  });
}

export function cabColorTxt(sP, resultCabColors) {

  let colorText = "Nej"; // default om inga stommar finns
  let rows = [];
  let pic = "Stommar_blandat.png";

  if (resultCabColors) {

    if (resultCabColors.sameColor) {
      colorText = resultCabColors.color;
    } else {
      const colors = Object.keys(resultCabColors.colors);
      colorText = colors.join(" / ");
    }

    const mapToUse = resultCabColors.colorMap || resultCabColors.colors;

    rows = Object.keys(mapToUse).map(color => ({
      color,
      numbers: mapToUse[color] // array
    }));

    pic = resultCabColors.pic || pic;
  }

  addCATtxt(sP.checkTxts, {
    title: "Stomme",
    text: colorText,
    level: "info",
    pic: pic,
    rows,
    message: "Här kontrolleras vilka färger på stommar som påträffas varefter en unik lista presenteras. \n" +
    "Via 🔍 kan man utläsa vilket nummer dessa har, samma som i nKP.\n" +
    "Nej = det finns inga stommar"
  });
}

export function drawerColorTxt(sP, resultDrawerColors) {
  let colorText = "Nej"; // default om inga lådor finns
  let rows = [];
  let pic = "Lådor_blandat.png";

  if (resultDrawerColors) {
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
    rows = Object.keys(mapToUse).map(color => ({
      color,
      numbers: Array.isArray(mapToUse[color])
        ? mapToUse[color]
        : Array.from(mapToUse[color])
    }));

    // Om pic finns i resultDrawerColors, använd den
    if (resultDrawerColors.pic) pic = resultDrawerColors.pic;
  }

  // Lägg till i checkTxts
  addCATtxt(sP.checkTxts, {
    title: "Låda",
    text: colorText,
    level: "info",
    pic: pic,
    rows,
    message:
      "Här kontrolleras vilka färger på lådor som påträffas, varpå en unik lista presenteras.\n" +
      "Via 🔍 kan man utläsa i vilket nummer (stomme) som en låda finns och vilken färg den har. Antal anges ej.\n" +
      "Nej = det finns inte några lådor."
  });
}

// ===============================
// Hyllplan färger
// ===============================
export function shelfColorTxt(sP, resultShelfColors) {

  if (!resultShelfColors) resultShelfColors = {};

  let colorText = "Nej";
  let rows = [];
  let pic = "Hyllplan_blandat.png";

  const mapToUse = resultShelfColors.colorMap || resultShelfColors.colors || {};
  const colors = Object.keys(mapToUse);

  if (colors.length === 0) {
    colorText = "Nej";
  }
  else if (resultShelfColors.sameColor) {
    colorText = resultShelfColors.color;
  }
  else {
    colorText = colors.join(" / ");
  }

  rows = colors.map(color => ({
    color,
    numbers: Array.isArray(mapToUse[color])
      ? mapToUse[color]
      : Array.from(mapToUse[color])
  }));

  pic = resultShelfColors.pic || pic;

  addCATtxt(sP.checkTxts, {
    title: "Hyllplan",
    text: colorText,
    level: "info",
    pic: pic,
    rows,
    message:
      "Här kontrolleras vilka hyllplan som påträffas, varpå en unik lista presenteras.\n" +
      "Via 🔍 kan man utläsa i vilket nummer (stomme) som ett hyllplan finns och vilken färg den har. Antal anges ej.\n" +
      "Nej = det finns inte några hyllplan."
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
    headersWithoutMedGlass,
    headersWithTooManyGlass
  } = resultGlass;

  const highCount = headersWithHighGlass.size;
  const medCount = headersWithMedGlass.size;

  // -------------------------
  // TEXTLOGIK
  // -------------------------
  if (headersWithTooManyGlass.size > 0) {

    glassText = "⚠️ Varning ⚠️";

  } else if (resultGlass.noPossibleDrawers) {

    glassText = "Nej";

  } else if (highCount === 0 && medCount === 0) {

    glassText = "Nej";

  } else if (allMatched) {

    glassText = "Alla lådor";

  } else {

    if (allHighDrawersHaveGlass && medCount === 0) {

      glassText = "Alla höga lådor";

    } else if (allMedDrawersHaveGlass && highCount === 0) {

      glassText = "Alla medel-lådor";

    } else if (!allHighDrawersHaveGlass && medCount === 0) {

      glassText = "Vissa höga lådor";

    } else if (!allMedDrawersHaveGlass && highCount === 0) {

      glassText = "Vissa medel-lådor";

    } else {

      glassText = "Blandat, men inte i alla";

    }

  }

  // -------------------------
  // Skapa rows
  // -------------------------
  const rows = [
    { color: "Hög med glassidor", numbers: Array.from(headersWithHighGlass || []) },
    { color: "Medel med glassidor", numbers: Array.from(headersWithMedGlass || []) },
    { color: "Hög utan glassidor", numbers: Array.from(headersWithoutHighGlass || []) },
    { color: "Medel utan glassidor", numbers: Array.from(headersWithoutMedGlass || []) },
    { color: "Fler glassidor än lådor", numbers: Array.from(headersWithTooManyGlass || []) }
  ];

  addCATtxt(sP.checkTxts, {
    title: "Glassidor",
    text: glassText,
    level: "info",
    pic: "glassidor.avif",
    rows,
    message:
      "Här kontrolleras vilka glassidor som påträffas i varje nummer (stomme) likväl som om dessa har en låda med samma djup och höjd. \n" +
      "Denna kontroll ger ett av flertalet olika resultat:\n" +
      "[1]. Nej = Det finns inga glassidor. \n" +
      "[2]. Alla lådor = Det finns glassidor i alla* lådor. \n" +
      "[3]. Alla höga lådor = Glassidor finns i alla höga lådor men INGEN till medellådor. \n" +
      "[4]. Alla medel-lådor = Samma som [3.] men tvärt om. \n" +
      "[5]. Vissa höga lådor = Det finns höga glassidor men inte till alla höga lådor men INGEN till medellådor. \n" +
      "[6]. Vissa medel-lådor = Samma som [5.] men tvärt om. \n" +
      "[7]. Blandat = Det finns glassidor av båda höjder men inte till alla lådor. \n" +
      "[8]. ⚠️ Varning ⚠️ = Kombination där antalet glassidor överstiger antalet lådor.\n" +
      "Via 🔍 kan man utläsa i vilket nummer (stomme) som en glassida finns eller saknas. Djup och antal anges ej.\n" +
      "Nej = det finns inte några lådor.\n" +      
      "*Kontroll görs endast på lådor som kan ha glassidor"
    });
}

// ===============================
// Outer width & height
// ===============================
export function outerWidthHeightTxt(sP, resultOuter) {
  if (!resultOuter) resultOuter = {};
  const widthMismatch = Array.isArray(resultOuter.widthMismatch) ? resultOuter.widthMismatch : [];
  const heightMismatch = Array.isArray(resultOuter.heightMismatch) ? resultOuter.heightMismatch : [];

  let text = "";

  if (widthMismatch.length === 0 && heightMismatch.length === 0) {
    text = "Inget uppenbart fel";
  } else if (widthMismatch.length > 0 && heightMismatch.length === 0) {
    text = "⚠️ Bredd stämmer ej ⚠️";
  } else if (widthMismatch.length === 0 && heightMismatch.length > 0) {
    text = "⚠️ Höjd stämmer ev. ej ⚠️";
  } else {
    text = "⚠️ Bredd & höjd stämmer ej ⚠️";
  }

  const rows = [
    { color: "Bredd stämmer ej", numbers: widthMismatch },
    { color: "Höjd stämmer ej", numbers: heightMismatch }
  ];

  addCATtxt(sP.checkTxts, {
    title: "Yttre mått",
    text,
    level: "info",
    pic: "Yttre.png",
    rows,
    message:
      "Här kontrolleras att alla dörrar, yttre lådfronter och vitvaror inte överskrider stommens yttre höjd och bredd\n" +
      "Denna kontroll ger ett av flertalet olika resultat:\n" +
      "[1]. Inget uppenbart fel - Med väldigt hög sannolikhet så stämmer alla yttre mått\n" + 
      "[2]. ⚠️ Bredd stämmer ej ⚠️ - En eller flera artiklar har fel bredd, se nummer (stomme) via 🔍\n" +
      "[3]. ⚠️ Höjd stämmer ev. ej ⚠️ - En eller flera artiklar har fel höjd. Eller en dörr eller vitvara är bortplockad, se nummer (stomme) via 🔍\n" +
      "[4]. ⚠️ Bredd & höjd stämmer ej ⚠️ - Det finns artiklar med fel bredd & höjd, se nummer (stomme) via 🔍"
  });
}

// ===============================
// Inner width, height & depth
// ===============================
export function innerHeightTxt(sP, resultInner) {

  if (!resultInner) resultInner = {};

  const widthMismatch = Array.isArray(resultInner.widthMismatch)
    ? resultInner.widthMismatch
    : [];

  const heightMismatch = Array.isArray(resultInner.heightMismatch)
    ? resultInner.heightMismatch
    : [];

  const depthMismatch = Array.isArray(resultInner.depthMismatch)
    ? resultInner.depthMismatch
    : [];

  let text = "";

  const hasWidth = widthMismatch.length > 0;
  const hasHeight = heightMismatch.length > 0;
  const hasDepth = depthMismatch.length > 0;

  if (!hasWidth && !hasHeight && !hasDepth) {
    text = "Inget uppenbart fel";
  }
  else {
    const errors = [];
    if (hasWidth) errors.push("Bredd");
    if (hasHeight) errors.push("Höjd");
    if (hasDepth) errors.push("Djup");

    text = `⚠️ ${errors.join(" & ")} stämmer ej ⚠️`;
  }

  const rows = [
    { color: "Bredd stämmer ej", numbers: widthMismatch },
    { color: "Höjd stämmer ej", numbers: heightMismatch },
    { color: "Djup stämmer ej", numbers: depthMismatch }
  ];

  addCATtxt(sP.checkTxts, {
    title: "Inre mått",
    text,
    level:
      hasWidth || hasHeight || hasDepth
        ? "warning"
        : "info",
    pic: "Inre.png",
    rows,
    message:
      "Kontrollerar typ alla artiklar som påverkar det inre måtten bredd, höjd och djup i förhållande till dess stomme. Grundare lådor förbises\n" +
      "Denna kontroll ger ett av flertalet olika resultat: \n" + 
      "[1]. Inget uppenbart fel - Med ganska hög säkerhet så är alla artiklar rätt bredd och deras totalhöjd överskrider inte höjden på stommen\n" +
      "[2]. ⚠️ Bredd stämmer ej ⚠️ - En eller flera artiklar har fel bredd, se nummer (stomme) via 🔍\n" +
      "[3]. ⚠️ Höjd stämmer ej ⚠️ - Artiklarnas totala höjd överskrider stommens höjd, se nummer (stomme) via 🔍\n" +
      "[4]. ⚠️ Djup stämmer ej ⚠️ - En eller flera artikalr är djupare än stommen, se nummer (stomme) via 🔍" +
      "[5]. ⚠️ Kombinationer av 2-3 ⚠️, se nummer (stomme) via 🔍" 
  });
}

export function benchLightTypeWidthTxt(sP, result) {
  if (!result) return;

  let text = "";

  const hasMITTLED =
    result.mittled.white.correct.length ||
    result.mittled.white.wrong.length ||
    result.mittled.aluminium.correct.length ||
    result.mittled.aluminium.wrong.length;

  const hasIRSTA =
    result.irsta.correct.length ||
    result.irsta.wrong.length;

  const hasTooMany =
    result.mittled.white.tooMany.length ||
    result.mittled.aluminium.tooMany.length ||
    result.irsta.tooMany.length;

  // ======================
  // Huvudtext
  // ======================
  if (!hasMITTLED && !hasIRSTA) {
    text = "Nej";
  } else if (hasTooMany) {
    text = "⚠️ Fel antal ⚠️"; // NY
  } else if (result.allMatched) {
    text = `${result.allMatched}, alla väggskåp`;
  } else if (result.mixedSystems) {
    text = "⚠️ Blandad belysning ⚠️";
  } else {
    text = "⚠️ Saknas eller fel bredd ⚠️";
  }

  const rows = [];

  const missingMITTLED = Array.from(
    new Set([
      ...result.mittled.white.missing,
      ...result.mittled.aluminium.missing
    ])
  );

  const hasWhite =
    result.mittled.white.correct.length ||
    result.mittled.white.wrong.length;

  const hasAluminium =
    result.mittled.aluminium.correct.length ||
    result.mittled.aluminium.wrong.length;

  // ======================
  // INGEN BELYSNING ALLS
  // ======================
  if (!hasMITTLED && !hasIRSTA) {
    if (missingMITTLED.length) {
      rows.push({
        color: "Väggskåp som saknar belysningslist",
        numbers: missingMITTLED
      });
    }
  }

  // ======================
  // MITTLED rows
  // ======================
  if (hasMITTLED) {
    if (hasWhite) {
      if (result.mittled.white.correct.length) {
        rows.push({
          color: "MITTLED vit, rätt bredd",
          numbers: result.mittled.white.correct
        });
      }
      if (result.mittled.white.wrong.length) {
        rows.push({
          color: "MITTLED vit, fel bredd",
          numbers: result.mittled.white.wrong
        });
      }
      if (result.mittled.white.tooMany.length) {  // NY
        rows.push({
          color: "MITTLED vit, för många lister",
          numbers: result.mittled.white.tooMany
        });
      }
    }

    if (hasAluminium) {
      if (result.mittled.aluminium.correct.length) {
        rows.push({
          color: "MITTLED alu, rätt bredd",
          numbers: result.mittled.aluminium.correct
        });
      }
      if (result.mittled.aluminium.wrong.length) {
        rows.push({
          color: "MITTLED alu, fel bredd",
          numbers: result.mittled.aluminium.wrong
        });
      }
      if (result.mittled.aluminium.tooMany.length) {  // NY
        rows.push({
          color: "MITTLED alu, för många lister",
          numbers: result.mittled.aluminium.tooMany
        });
      }
    }
  }

  // ======================
  // SAKNAS LOGIK
  // ======================
  if (hasMITTLED && !hasIRSTA && missingMITTLED.length) {
    rows.push({
      color: "MITTLED saknas",
      numbers: missingMITTLED
    });
  }

  if (hasIRSTA && !hasMITTLED && result.irsta.missing.length) {
    rows.push({
      color: "IRSTA saknas",
      numbers: result.irsta.missing
    });
  }

  if (hasMITTLED && hasIRSTA) {
    if (missingMITTLED.length) {
      rows.push({
        color: "MITTLED saknas",
        numbers: missingMITTLED
      });
    }
    if (result.irsta.missing.length) {
      rows.push({
        color: "IRSTA saknas",
        numbers: result.irsta.missing
      });
    }
  }

  // ======================
  // IRSTA rows
  // ======================
  if (hasIRSTA) {
    if (result.irsta.correct.length) {
      rows.push({
        color: "IRSTA, rätt bredd",
        numbers: result.irsta.correct
      });
    }
    if (result.irsta.wrong.length) {
      rows.push({
        color: "IRSTA, fel bredd",
        numbers: result.irsta.wrong
      });
    }
    if (result.irsta.tooMany.length) { // NY
      rows.push({
        color: "IRSTA, för många lister",
        numbers: result.irsta.tooMany
      });
    }
  }

  addCATtxt(sP.checkTxts, {
    title: "Bänkbelysning",
    text,
    level: hasTooMany ? "warning" : result.allMatched ? "info" : "warning",
    pic: result.pic || "bänkbelysning_vit.avif",
    rows,
    message:
      "Här kontrolleras vilka bänkbelysningar som påträffas, varpå en unik lista presenteras.\n" +
      "Via 🔍 kan man utläsa i vilket nummer (stomme) som en specifik belysning påträffas. Antal anges ej.\n" +
      "Denna kontroll ger ett av flertalet olika resultat:\n" +
      "[1]. Nej = det finns inte någon bänkbelysning.\n" +  
      "[2]. MITTLED vit, ALLA VÄGGSKÅP - Alla väggskåp har en belysning i rätt bredd och samtliga är MITTLED vit\n" +
      "[3]. ⚠️ Blandad belysning ⚠️ - Det finns t.ex. både MITTLED vit och aluminium\n" +
      "[4]. ⚠️ Saknas eller fel bredd ⚠️ - Ett väggskåp som kan ha belysning saknar detta eller en belysning är i fel bredd.\n" +
      "[5]. ⚠️ Fel antal ⚠️ - En eller flera stommar har för mycket belysning"
  });
}

// =========================
// SPOTTAR
// =========================

export function spotLightTxt(sP, resultSpotLights) {
  let colorText = "Nej";
  let rows = [];
  let pic = "Spott_blandat.png";

  if (resultSpotLights) {
    const { sameColor, colors, colorMap, wrongCount, noGlassDoorButSpot, pic: resultPic } = resultSpotLights;
    const mapToUse = colorMap || colors || {};

    // Filtrera bort färger utan stommar
    const filteredColors = Object.entries(mapToUse).filter(([color, numbers]) => {
      const nums = Array.isArray(numbers) ? numbers : Array.from(numbers);
      return nums.length > 0;
    });

    // Totalt antal spottar
    const totalSpots = filteredColors.reduce((sum, [, numbers]) => {
      return sum + (Array.isArray(numbers) ? numbers.length : Array.from(numbers).length);
    }, 0);

    // =============================
    // BESTÄM TEXT
    // =============================
    if (noGlassDoorButSpot && noGlassDoorButSpot.length > 0) {
      colorText = "⚠️ Spottar men inga vitrindörrar ⚠️";
    } else if (totalSpots === 0) {
      colorText = "Nej";
    } else if (wrongCount && wrongCount.length) {
      colorText = "⚠️ Saknas eller fel antal ⚠️";
    } else if (sameColor && filteredColors.length === 1) {
      colorText = filteredColors[0][0];
    } else if (filteredColors.length > 1) {
      colorText = filteredColors.map(([color]) => color).join(" / ");
    }

    // Skapa rows utan tomma färger
    rows = filteredColors.map(([color, numbers]) => ({
      color,
      numbers: Array.isArray(numbers) ? numbers : Array.from(numbers)
    }));

    // Fel antal spottar visas separat
    if (wrongCount && wrongCount.length) {
      rows.push({ color: "Fel antal spottar", numbers: wrongCount });
    }

    // Spottar utan vitrindörr visas separat
    if (noGlassDoorButSpot && noGlassDoorButSpot.length > 0) {
      rows.push({ color: "Spottar men inga vitrindörrar", numbers: noGlassDoorButSpot });
    }

    pic = resultPic || pic;
  }

  addCATtxt(sP.checkTxts, {
    title: "Spottar",
    text: colorText,
    level: colorText.includes("⚠️") ? "warning" : "info",
    pic: pic,
    rows,
    message:
      "Här kontrolleras vilka spottar som finns i väggskåp.\n" +
      "Via 🔍 kan du se i vilka stommar spottar är placerade och vilken färg de har.\n" +
      "Om antalet spottar inte stämmer med reglerna för vitrindörrar markeras detta som fel.\n" +
      "⚠️ Spottar men inga vitrindörrar visas när det finns spottar i skåp utan vitrindörrar.\n" +
      "Nej = inga spottar har påträffats."
  });
}