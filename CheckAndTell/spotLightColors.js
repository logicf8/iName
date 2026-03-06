import { filter } from "../global/myConstants.js";

export function spotLightColors(sectionPortfolio) {
  console.log("==================================================");
  console.log("START spotLightColors()");

  const wallType = filter.Cabinet.group2.Wall;
  console.log("Wall type (filter):", wallType);

  const result = {
    colorMap: { vit: new Set(), svart: new Set(), aluminium: new Set() },
    wrongCount: new Set(),
    noGlassDoorButSpot: new Set(),   // ⭐ NY
    sameColor: false,
    colors: {},
    pic: "Spott_blandat.png",
    totalGlassDoors: 0
  };

  let anyWhite = false;
  let anyBlack = false;
  let anyAlu = false;

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CombinationHeader") return;

    console.log("--------------------------------------------------");
    console.log("HEADER:", header.number);
    console.log("Header type:", header.type);
    console.log("Header width:", header.width);
    console.log("Header height:", header.height);
    console.log("Header corner:", header.corner);

    if (header.type !== wallType) {
      console.log("Ej väggskåp → hoppar över");
      return;
    }

    const headerWidth = Number(header.width);
    const headerHeight = Number(header.height);

    let glassDoors = 0;
    let glassDoorWidth30 = 0;

    let spotQty = 0;
    let spotColor = null;

    header.returnArticles().forEach(article => {

      // =========================
      // VITRINDÖRR
      // =========================
      if (
        article.group1 === filter.Fronts.group1 &&
        article.group2 === filter.Fronts.group2.Door &&
        article.group3 === filter.Fronts.group3.GlassDoor
      ) {
        const qty = Number(article.quantity) || 1;
        const width = Number(article.width);

        glassDoors += qty;
        result.totalGlassDoors += qty;

        if (width === 30) {
          glassDoorWidth30 += qty;
        }

        console.log(" ➜ Vitrindörr hittad");
        console.log(" ➜ width:", width);
        console.log(" ➜ Totalt vitrindörrar:", glassDoors);
      }

      // =========================
      // SPOTTAR
      // =========================
      const lightGroup1 = filter.Light.grupp1 || filter.Light.group1;
      const lightGroup2 = filter.Light.grupp2?.Spot || filter.Light.group2?.Spot;

      if (article.group1 === lightGroup1 && article.group2 === lightGroup2) {
        const qty = Number(article.quantity) || 1;
        spotQty += qty;

        const color = (article.color || "").toLowerCase();

        if (color === "vit") {
          spotColor = "vit";
          anyWhite = true;
        } else if (color === "svart") {
          spotColor = "svart";
          anyBlack = true;
        } else if (color === "aluminium") {
          spotColor = "aluminium";
          anyAlu = true;
        }

        console.log(" ➜ Spot hittad:", qty);
      }
    });

    // =========================
    // ⭐ NY KONTROLL
    // spottar utan vitrindörr
    // =========================
    if (spotQty > 0 && glassDoors === 0) {
      console.log(" ⚠️ Spottar men inga vitrindörrar");
      result.noGlassDoorButSpot.add(header.number);
    }

    // =========================
    // MAX ANTAL SPOTTAR
    // =========================
    let maxSpots = 0;

    if (headerHeight === 100 && headerWidth === 40) {
      maxSpots = 1;
    } else if (headerHeight === 100 && headerWidth === 80) {
      maxSpots = 2;
    } else if (headerWidth === 60) {
      if (glassDoorWidth30 === 2) {
        maxSpots = 1;
      } else {
        maxSpots = glassDoors;
      }
    } else if (headerWidth === 30) {
      maxSpots = 1;
    } else if (headerWidth === 80 || headerWidth === 40) {
      maxSpots = glassDoors;
    } else if (headerWidth === 68 && glassDoors > 0) {
      maxSpots = 1;
    }

    console.log(" Vitrindörrar:", glassDoors);
    console.log(" 30-dörrar:", glassDoorWidth30);
    console.log(" Spottar:", spotQty);
    console.log(" Max tillåtna:", maxSpots);

    // =========================
    // FEL ANTAL
    // =========================
    let wrongSpots = false;

    if (!(headerWidth === 80 && header.corner === true)) {
      if (glassDoors > 0 && spotQty !== maxSpots) {
        wrongSpots = true;
      }
    }

    if (wrongSpots) {
      console.log(" ⚠️ Ev. Fel antal spottar");
      result.wrongCount.add(header.number);
    }

    // =========================
    // SPARA FÄRG
    // =========================
    if (spotColor) {
      result.colorMap[spotColor].add(header.number);
    }

  });

  // =========================
  // COLORS
  // =========================
  const colors = {};
  Object.keys(result.colorMap).forEach(color => {
    if (result.colorMap[color].size > 0) {
      colors[color] = Array.from(result.colorMap[color]);
    }
  });

  result.colors = colors;
  result.sameColor = Object.keys(colors).length === 1;

  // =========================
  // BILDVAL
  // =========================
  if (result.wrongCount.size > 0) {
    result.pic = "Spott_blandat.png";
  } else if (Object.keys(colors).length === 1) {
    const key = Object.keys(colors)[0];

    if (key === "vit") result.pic = "spott_vit.avif";
    else if (key === "svart") result.pic = "spott_svart.avif";
    else if (key === "aluminium") result.pic = "spott_alu.avif";
  } else if (Object.keys(colors).length > 1) {
    result.pic = "Spott_blandat.png";
  }

  Object.keys(result.colorMap).forEach(k => {
    result.colorMap[k] = Array.from(result.colorMap[k]);
  });

  result.wrongCount = Array.from(result.wrongCount);
  result.noGlassDoorButSpot = Array.from(result.noGlassDoorButSpot); // ⭐ NY

  console.log("==================================================");
  console.log("RESULTAT spotLightColors()");
  console.log(result);
  console.log("==================================================");

  return result;
}