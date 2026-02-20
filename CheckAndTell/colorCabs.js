// CheckAndTell/colorCabs.js

import { filter } from "../global/myConstants.js";

export function cabColors(sectionPortfolio) {
  const cabinetGroup = filter.Cabinet.group1;
  const colorMap = {}; 

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name === "CombinationHeader"){
      header.returnArticles().forEach(article => {

        if (article.group1 === cabinetGroup) {

          if (!colorMap[article.color]) {
            colorMap[article.color] = [];
          }

          colorMap[article.color].push(header.number);

        }

      });
    }
  });

  const colors = Object.keys(colorMap);

  if (colors.length === 0) {
    return null;
  }

  if (colors.length === 1) {
    return {
      sameColor: true,
      color: colors[0],
      colorMap // Lägg till colorMap för result
    };
  }

  return {
    sameColor: false,
    colors: colorMap,
    colorMap // Lägg till colorMap för result
  };

}
