import { filter } from "../global/myConstants.js";

export function cabColors(sectionPortfolio) {
  const cabinetGroup = filter.Cabinet.group1;
  const colorMap = {}; 

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name === "CombinationHeader") {

      header.returnArticles().forEach(article => {

        if (article.group1 === cabinetGroup) {

          if (!colorMap[article.color]) {
            colorMap[article.color] = new Set();
          }
          colorMap[article.color].add(header.number);
        }
      });
    }
  });

  // 🔁 Konvertera Set → Array innan vi returnerar
  Object.keys(colorMap).forEach(color => {
    colorMap[color] = Array.from(colorMap[color]);
  });

  const colors = Object.keys(colorMap);

  if (colors.length === 0) {
    return null;
  }

  let pic = "Stommar_blandat.png";

  if (colors.length === 1) {

    const color = colors[0];

    if (color === "vit") pic = "stomme_vit.avif";
    else if (color === "svartgrå") pic = "stomme_svart.avif";

    return {
      sameColor: true,
      color,
      colorMap,
      pic
    };
  }

  return {
    sameColor: false,
    colors: colorMap,
    colorMap,
    pic
  };
}