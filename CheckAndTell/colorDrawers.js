// CheckAndTell/colorDrawers.js

import { filter } from "../../global/myConstants.js";

export function drawerColors(sectionPortfolio) {

  const interiorGroup = filter.Interior.group1;
  const drawerType = filter.Interior.group3.Drawer;
  const pullOutType = filter.Interior.group3.PullOut;

  const colorMap = {};

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {

      header.returnArticles().forEach(article => {

        const isInterior = article.group1 === interiorGroup;
        const isDrawerOrPullOut =
          article.group3 === drawerType ||
          article.group3 === pullOutType;

        if (isInterior && isDrawerOrPullOut) {

          if (!colorMap[article.color]) {
            colorMap[article.color] = new Set();
          }
          colorMap[article.color].add(header.number);
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
      colorMap
    };
  }

  return {
    sameColor: false,
    colors: colorMap,
    colorMap
  };
}