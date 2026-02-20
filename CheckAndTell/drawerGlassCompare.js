// CheckAndTell/drawerGlassCompare.js
import { filter } from "../../global/myConstants.js";

export function collectDrawerGlass(sectionPortfolio) {

  const drawers = {};
  const glassSides = {};

  const group1Value = filter.Interior.group1;
  const group2DrawerValue = filter.Interior.group2.Drawer;
  const drawerValue = filter.Interior.group3.Drawer;
  const pullOutValue = filter.Interior.group3.PullOut;
  const addOnSidesValue = filter.Interior.group3.AddOnSides;

  sectionPortfolio.returnHeaders().forEach(header => {

    // Endast CombinationHeader
    if (header.constructor.name !== "CombinationHeader") return;

    header.returnArticles().forEach(article => {

      if (article.name !== "MAXIMERA") return;

      const depth = String(article.depth).trim();
      const height = article.group4?.toLowerCase().trim();

      // -----------------------
      // VANLIGA LÅDOR (ej låg eller 45)
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === drawerValue &&
        height &&
        height !== "låg" &&
        depth !== "45"
      ) {
        const key = `${depth}-${height}`;
        if (!drawers[key]) drawers[key] = new Set();
        drawers[key].add(header.number);
      }

      // -----------------------
      // PULLOUT → alltid 60-med + 60-hög
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === pullOutValue
      ) {
        ["med", "hög"].forEach(h => {
          const key = `60-${h}`;
          if (!drawers[key]) drawers[key] = new Set();
          drawers[key].add(header.number);
        });
      }

      // -----------------------
      // GLASSIDOR
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === addOnSidesValue &&
        (height === "med" || height === "hög")
      ) {
        const key = `${depth}-${height}`;
        if (!glassSides[key]) glassSides[key] = new Set();
        glassSides[key].add(header.number);
      }

    });

  });

  return { drawers, glassSides };
}

export function compareDrawerGlass(drawers, glassSides) {

  const result = {
    allMatched: true,
    allHighDrawersHaveGlass: true,
    allMedDrawersHaveGlass: true,
    missingCombinations: [],
    headersWithHighGlass: new Set(),
    headersWithMedGlass: new Set(),
    headersWithoutHighGlass: new Set(),
    headersWithoutMedGlass: new Set()
  };

  // Samla alla headers som har lådor per höjd
  const headersByHeight = {
    hög: new Set(),
    med: new Set()
  };

  Object.keys(drawers).forEach(key => {
    const [, height] = key.split("-");
    drawers[key]?.forEach(headerNr => {
      headersByHeight[height]?.add(headerNr);
    });
  });

  // Kontrollera matchning per depth-height
  Object.keys(drawers).forEach(key => {
    const drawerCount = drawers[key]?.size || 0;
    const glassCount = glassSides[key]?.size || 0;

    if (glassCount < drawerCount) {
      result.allMatched = false;
      result.missingCombinations.push(key);
    }
  });

  // Samla headers som HAR glassidor
  Object.keys(glassSides).forEach(key => {
    const [, height] = key.split("-");
    glassSides[key]?.forEach(headerNr => {
      if (height === "hög") result.headersWithHighGlass.add(headerNr);
      if (height === "med") result.headersWithMedGlass.add(headerNr);
    });
  });

  // -------------------------
  // Headers som saknar glassidor (bara om de har låda av den höjden)
  // -------------------------
  headersByHeight.hög.forEach(headerNr => {
    if (!result.headersWithHighGlass.has(headerNr)) {
      result.headersWithoutHighGlass.add(headerNr);
    }
  });

  headersByHeight.med.forEach(headerNr => {
    if (!result.headersWithMedGlass.has(headerNr)) {
      result.headersWithoutMedGlass.add(headerNr);
    }
  });

  // -------------------------
  // Boolean-resultat
  // -------------------------
  result.allHighDrawersHaveGlass =
    [...headersByHeight.hög].every(h => result.headersWithHighGlass.has(h));

  result.allMedDrawersHaveGlass =
    [...headersByHeight.med].every(h => result.headersWithMedGlass.has(h));

  return result;
}