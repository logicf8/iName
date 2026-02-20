// CheckAndTell/familyTypes.js
import { filter } from "../../global/myConstants.js";

export function familyTypes(sectionPortfolio) {

  const frontGroup = filter.Fronts.group1;
  const validGroup2Values = Object.values(filter.Fronts.group2);

  const colorMap = {}; // { "Dörr Vit": Set(header1, header2) }

  sectionPortfolio.returnHeaders().forEach(header => {

    // Alla headers utom dessa exkluderas
    if (
      header.constructor.name !== "CoverPanelHeader" &&
      header.constructor.name !== "OpenHeader" &&
      header.constructor.name !== "CombinationFreeStanding"
    ) {

      header.returnArticles().forEach(article => {

        const isFrontGroup = article.group1 === frontGroup;
        const isValidGroup2 = validGroup2Values.includes(article.group2);

        if (isFrontGroup && isValidGroup2) {

          const colorKey = `${article.name} ${article.color}`;

          if (!colorMap[colorKey]) {
            colorMap[colorKey] = new Set();
          }

          // Hantering för SecondStageHeader
          let headerId;
          if (header.constructor.name === "SecondStageHeader") {
            if (header.originalTxt === "Ben och socklar") {
              headerId = "Socklar"; // ersätt visningsnamnet
            } else {
              headerId = header.originalTxt; // annars originalTxt
            }
          } else {
            headerId = header.number; // vanliga headers använder number
          }

          colorMap[colorKey].add(headerId);

        }

      });

    }

  });

  const colors = Object.keys(colorMap);

  if (colors.length === 0) return null;

  if (colors.length === 1) {
    return {
      sameColor: true,
      color: colors[0],
      numbers: Array.from(colorMap[colors[0]]), // konvertera Set → Array
      colorMap
    };
  }

  // Alla värden konverteras från Set → Array för enkel hantering
  const arrayColorMap = {};
  Object.keys(colorMap).forEach(color => {
    arrayColorMap[color] = Array.from(colorMap[color]);
  });

  return {
    sameColor: false,
    colors: arrayColorMap,
    colorMap: arrayColorMap
  };
}