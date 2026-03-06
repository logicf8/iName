// CheckAndTell/drawerGlassCompare.js
import { filter } from "../global/myConstants.js";

export function collectDrawerGlass(sectionPortfolio) {

  const drawers = {};
  const glassSides = {};

  const group1Value = filter.Interior.group1;
  const group2DrawerValue = filter.Interior.group2.Drawer;
  const drawerValue = filter.Interior.group3.Drawer;
  const pullOutValue = filter.Interior.group3.PullOut;
  const addOnSidesValue = filter.Interior.group3.AddOnSides;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    header.returnArticles().forEach(article => {

      if (article.name !== "MAXIMERA") return;

      const depth = String(article.depth || "").trim();

      // -----------------------
      // Normalisera höjd robust
      // -----------------------
      const rawHeight = (article.group4 || "").toString().toLowerCase().trim();
      let height = null;

      if (rawHeight === "hög") height = "hög";
      if (rawHeight === "med") height = "med";

      const qty = Number(article.quantity) || 1;

      // -----------------------
      // VANLIGA LÅDOR
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === drawerValue &&
        height &&
        depth !== "45"
      ) {
        const key = `${depth}-${height}`;

        if (!drawers[key]) drawers[key] = new Map();

        drawers[key].set(
          header.number,
          (drawers[key].get(header.number) || 0) + qty
        );
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

          if (!drawers[key]) drawers[key] = new Map();

          drawers[key].set(
            header.number,
            (drawers[key].get(header.number) || 0) + qty
          );
        });
      }

      // -----------------------
      // GLASSIDOR
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === addOnSidesValue &&
        height
      ) {
        const key = `${depth}-${height}`;

        if (!glassSides[key]) glassSides[key] = new Map();

        glassSides[key].set(
          header.number,
          (glassSides[key].get(header.number) || 0) + qty
        );
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
  headersWithoutMedGlass: new Set(),
  headersWithTooManyGlass: new Set(),
  noPossibleDrawers: false
};

  // -------------------------
  // Samla alla headers som har lådor per höjd
  // -------------------------
  const headersByHeight = {
    hög: new Set(),
    med: new Set()
  };

  Object.keys(drawers).forEach(key => {

    const parts = key.split("-");
    if (parts.length !== 2) return;

    const height = parts[1];
    if (!headersByHeight[height]) return;

    drawers[key].forEach((qty, headerNr) => {
      headersByHeight[height].add(headerNr);
    });
  });


  // -------------------------
  // Jämför drawer vs glass per header
  // -------------------------
  Object.keys(drawers).forEach(key => {

    if (!glassSides[key]) glassSides[key] = new Map();

    drawers[key].forEach((drawerQty, headerNr) => {

      const glassQty = glassSides[key].get(headerNr) || 0;

      if (glassQty > drawerQty) {
        result.headersWithTooManyGlass.add(headerNr);
      }

      if (glassQty < drawerQty) {
        result.allMatched = false;
        result.missingCombinations.push(key);
      }

    });
  });


  // -------------------------
  // Samla headers som HAR glassidor
  // -------------------------
  Object.keys(glassSides).forEach(key => {

    const parts = key.split("-");
    if (parts.length !== 2) return;

    const height = parts[1];

    glassSides[key].forEach((qty, headerNr) => {

      if (height === "hög") result.headersWithHighGlass.add(headerNr);
      if (height === "med") result.headersWithMedGlass.add(headerNr);

    });
  });


  // -------------------------
  // Headers som saknar glassidor
  // (bara om de har låda av den höjden)
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
  // Finns det några lådor alls?
  // -------------------------
  const hasAnyDrawers =
    headersByHeight.hög.size > 0 ||
    headersByHeight.med.size > 0;

  if (!hasAnyDrawers) {
    result.noPossibleDrawers = true;
  }

  // -------------------------
  // Boolean-resultat
  // -------------------------
  result.allHighDrawersHaveGlass =
    [...headersByHeight.hög].every(h =>
      result.headersWithHighGlass.has(h)
    );

  result.allMedDrawersHaveGlass =
    [...headersByHeight.med].every(h =>
      result.headersWithMedGlass.has(h)
    );

  return result;
}