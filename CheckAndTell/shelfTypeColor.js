import { filter } from "../global/myConstants.js";

// Returnerar hyllplansfärger på samma sätt som cabColors/drawerColors
export function shelfColors(sectionPortfolio) {

  const shelfGroup1 = filter.Interior.group1;
  const shelfGroup2 = filter.Interior.group2.Shelf;

  const colorMap = {};

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {

      header.returnArticles().forEach(article => {

        if (article.group1 === shelfGroup1 && article.group2 === shelfGroup2) {

          if (!colorMap[article.color]) {
            colorMap[article.color] = new Set();
          }

          colorMap[article.color].add(header.number);

        }

      });

    }

  });

  // Konvertera Set → Array
  Object.keys(colorMap).forEach(color => {
    colorMap[color] = Array.from(colorMap[color]);
  });

  const colors = Object.keys(colorMap);

  // =========================
  // INGA HYLLPLAN
  // =========================
  if (colors.length === 0) {

    return {
      sameColor: false,
      colors: {},
      colorMap: {},
      pic: "Hyllplan_blandat.png"
    };

  }

  let pic = "Hyllplan_blandat.png";

  if (colors.length === 1) {

    const color = colors[0];

    if (color === "vit") pic = "hyllplan_vita.avif";
    else if (color === "svartgrå") pic = "hyllplan_svarta.avif";
    else if (color === "glas") pic = "hyllplan_glas.avif";

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