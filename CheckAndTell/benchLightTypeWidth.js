// CheckAndTell/benchLightTypeWidth.js
import { filter } from '../global/myConstants.js';

export function benchLightTypeWidth(sectionPortfolio) {

  console.log("==================================================");
  console.log("START benchLightTypeWidth()");

  const wallType = filter.Cabinet.group2.Wall;
  console.log("Wall type (filter):", wallType);

  const result = {
    mittled: {
      white: { correct: new Set(), wrong: new Set(), missing: new Set(), tooMany: new Set() },
      aluminium: { correct: new Set(), wrong: new Set(), missing: new Set(), tooMany: new Set() }
    },
    irsta: {
      correct: new Set(),
      wrong: new Set(),
      missing: new Set(),
      tooMany: new Set()
    },
    mixedSystems: false,
    allMatched: null
  };

  let anyMITTLEDWhite = false;
  let anyMITTLEDAlu = false;
  let anyIRSTA = false;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    console.log("--------------------------------------------------");
    console.log("HEADER:", header.number);
    console.log("Header type:", header.type);
    console.log("Header width:", header.width);

    if (header.type !== wallType) {
      console.log("Ej väggskåp → hoppar över");
      return;
    }

    const headerWidth = Number(header.width);

    const mittled = [];
    const irsta = [];

    let isFanCabinet = false;

    if (header.forFlags?.fan === true) {
      isFanCabinet = true;
    }

    header.returnArticles().forEach(article => {

      console.log("  Artikel:", article.name);
      console.log("    width:", article.width);
      console.log("    color:", article.color);
      console.log("    quantity:", article.quantity);

      const isMittledLighting =
          article.name === "MITTLED" &&
          article.group1 === filter.Light.grupp1 &&
          article.group2 === filter.Light.grupp2.benchLighting;

      if (isMittledLighting) {
          mittled.push(article);
          console.log("    ➜ MITTLED belysning hittad");
      }

      const isIrstaLighting =
          article.name === "IRSTA" &&
          article.group1 === filter.Light.group1 &&
          article.group2 === filter.Light.group2.benchLighting;

      if (isIrstaLighting) {
          irsta.push(article);
          console.log("    ➜ IRSTA belysning hittad");
      }

      if (
        article.group1 === filter.Appliance.group1 &&
        article.group2 === filter.Appliance.group2.Fan &&
        article.group3 === "Inbyggd"
      ) {
        isFanCabinet = true;
      }

    });

    console.log("  Är fläktskåp:", isFanCabinet);

    if (isFanCabinet) {
      console.log("  ⭐ Fläktskåp upptäckt → belysning ej tillåten");
      console.log("  ➜ Skåpet exkluderas från benchLightTypeWidth test");
      return;
    }

    // ============================
    // MITTLED
    // ============================
    console.log("  MITTLED antal:", mittled.length);

    const isCornerCabinet =
      header.corner === true &&
      headerWidth === 68;

    console.log("  Är hörnskåp 675:", isCornerCabinet);

    if (mittled.length === 0) {

      console.log("  ❌ MITTLED saknas");
      result.mittled.white.missing.add(header.number);
      result.mittled.aluminium.missing.add(header.number);

    }
    else if (mittled.length > 1 && !isCornerCabinet) {

      console.log("  ⚠️ Fler än 1 MITTLED (ej hörn)");
      mittled.forEach(a => {
        const colorKey = a.color === "vit" ? "white" : "aluminium";
        result.mittled[colorKey].tooMany.add(header.number);
      });

    }
    else {

      mittled.forEach(a => {

        const colorKey = a.color === "vit" ? "white" : "aluminium";

        if (colorKey === "white") anyMITTLEDWhite = true;
        if (colorKey === "aluminium") anyMITTLEDAlu = true;

        console.log("  MITTLED färg:", colorKey);
        console.log("  MITTLED width:", a.width);
        console.log("  MITTLED quantity:", a.quantity);

        if (isCornerCabinet) {

          console.log("  ➜ Hörnregel aktiv");

          const correctWidth = Number(a.width) === 40;
          const correctQty = Number(a.quantity) === 2;

          console.log("    Kräver width: 40 →", a.width);
          console.log("    Kräver quantity: 2 →", a.quantity);

          if (correctWidth && correctQty && mittled.length === 1) {

            console.log("  ✅ Hörnregel korrekt (40mm x2)");
            result.mittled[colorKey].correct.add(header.number);

          } else {

            if (mittled.length > 1) {
              console.log("  ⚠️ Too many MITTLED i hörnskåp");
              result.mittled[colorKey].tooMany.add(header.number);
            } else {
              console.log("  ❌ Hörnregel FEL");
              result.mittled[colorKey].wrong.add(header.number);
            }
          }
        }
        else {

          if (mittled.length > 1) {

            console.log("  ⚠️ Too many MITTLED");
            result.mittled[colorKey].tooMany.add(header.number);

          }
          else if (Number(a.width) === headerWidth) {

            console.log("  ✅ MITTLED rätt bredd");
            result.mittled[colorKey].correct.add(header.number);

          }
          else {

            console.log("  ❌ MITTLED fel bredd");
            result.mittled[colorKey].wrong.add(header.number);
          }
        }
      });
    }

    // ============================
    // IRSTA
    // ============================
    console.log("  IRSTA antal:", irsta.length);

    if (irsta.length === 0) {

      console.log("  ❌ IRSTA saknas");
      result.irsta.missing.add(header.number);

    }
    else if (irsta.length > 1) {

      console.log("  ⚠️ Fler än 1 IRSTA");
      result.irsta.tooMany.add(header.number);
      anyIRSTA = true;

    }
    else {

      anyIRSTA = true;

      console.log("  Jämför IRSTA bredd:", irsta[0].width, "med header:", headerWidth);

      if (Number(irsta[0].width) === headerWidth) {

        console.log("  ✅ IRSTA rätt bredd");
        result.irsta.correct.add(header.number);

      } else {

        console.log("  ❌ IRSTA fel bredd");
        result.irsta.wrong.add(header.number);
      }
    }
  });

  // ============================
  // Mixed systems?
  // ============================
  const usedMITTLED = anyMITTLEDWhite || anyMITTLEDAlu;
  result.mixedSystems = usedMITTLED && anyIRSTA;

  console.log("--------------------------------------------------");
  console.log("Any MITTLED white:", anyMITTLEDWhite);
  console.log("Any MITTLED aluminium:", anyMITTLEDAlu);
  console.log("Any IRSTA:", anyIRSTA);
  console.log("Mixed systems:", result.mixedSystems);

  const noLightingFound =
    !anyMITTLEDWhite &&
    !anyMITTLEDAlu &&
    !anyIRSTA;

  if (noLightingFound) {
    result.allMatched = "Ingen bänk- belysning";
  }

  // ============================
  // ALL MATCH CHECK
  // ============================

  const onlyWhite =
    anyMITTLEDWhite &&
    !anyMITTLEDAlu &&
    !anyIRSTA &&
    result.mittled.white.wrong.size === 0 &&
    result.mittled.white.missing.size === 0 &&
    result.mittled.white.tooMany.size === 0;

  const onlyAlu =
    anyMITTLEDAlu &&
    !anyMITTLEDWhite &&
    !anyIRSTA &&
    result.mittled.aluminium.wrong.size === 0 &&
    result.mittled.aluminium.missing.size === 0 &&
    result.mittled.aluminium.tooMany.size === 0;

  const mixedMITTLEDColors =
    anyMITTLEDWhite &&
    anyMITTLEDAlu &&
    !anyIRSTA &&
    result.mittled.white.wrong.size === 0 &&
    result.mittled.aluminium.wrong.size === 0 &&
    result.mittled.white.missing.size === 0 &&
    result.mittled.aluminium.missing.size === 0 &&
    result.mittled.white.tooMany.size === 0 &&
    result.mittled.aluminium.tooMany.size === 0;

  const onlyIRSTA =
    anyIRSTA &&
    !anyMITTLEDWhite &&
    !anyMITTLEDAlu &&
    result.irsta.wrong.size === 0 &&
    result.irsta.missing.size === 0 &&
    result.irsta.tooMany.size === 0;

  if (onlyWhite) result.allMatched = "MITTLED vit";
  else if (onlyAlu) result.allMatched = "MITTLED aluminium";
  else if (mixedMITTLEDColors) result.allMatched = "MITTLED - blandade färger";
  else if (onlyIRSTA) result.allMatched = "IRSTA";

  console.log("==================================================");
  console.log("RESULTAT benchLightTypeWidth()");
  console.log(result);
  console.log("==================================================");

  const convert = obj => {
    Object.keys(obj).forEach(k => {
      if (obj[k] instanceof Set) obj[k] = Array.from(obj[k]);
      else if (typeof obj[k] === "object" && obj[k] !== null) convert(obj[k]);
    });
  };

  convert(result);

  // ============================
  // Bildval
  // ============================
  let pic = "Belysning_blandat.png";

  if (onlyWhite) pic = "mittled_vit.avif";
  else if (onlyAlu) pic = "mittled_alu.avif";
  else if (onlyIRSTA) pic = "Irsta.avif";

  result.pic = pic;

  return result;
}