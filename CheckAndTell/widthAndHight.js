import { filter } from '../global/myConstants.js';

export function checkWidthAndHight(header) {
  const { Fronts, Appliance } = filter;

  let totalHeight = 0;
  let widthMismatch = false;

  const foundWidths = [];
  const invalidHeightArticles = [];

  const headerHeight = Number(header.hight ?? header.height);
  const headerWidth = Number(header.width);

  header.returnArticles().forEach(article => {

    // -----------------------
    // FILTER
    // -----------------------

    const isFront =
      article.group1 === Fronts.group1 &&
      (article.group2 === Fronts.group2.Door ||
       article.group2 === Fronts.group2.DrawerFront);

    const isAppliance =
      article.group1 === Appliance.group1 &&
      (article.group2 === Appliance.group2.Oven ||
       article.group2 === Appliance.group2.CombiMicro ||
       article.group2 === Appliance.group2.Micro);

    if (!isFront && !isAppliance) return;

    const qty = Number(article.quantity || 1);
    const height = Number(article.height);
    const width = Number(article.width);

    // -----------------------
    // Spara unika bredder
    // -----------------------

    if (!foundWidths.includes(width)) {
      foundWidths.push(width);
    }

    // -----------------------
    // HEIGHT VALIDATION
    // -----------------------

    if (isNaN(height)) {
      invalidHeightArticles.push({
        id: article.id,
        group1: article.group1,
        group2: article.group2,
        value: article.height
      });
      return;
    }

    // -----------------------
    // WIDTH & HEIGHT LOGIK
    // -----------------------

    // 1️⃣ Om bredd är exakt lika
    if (width === headerWidth) {

      if (
        article.group2 === Fronts.group2.DrawerFront &&
        height === 10
      ) {
        totalHeight += height * 2 * qty;
      } else {
        totalHeight += height * qty;
      }

    }
    // 2️⃣ Om bredd är halva headerbredden
    else if (headerWidth / 2 === width) {

      if (qty % 2 === 0) {
        totalHeight += (qty / 2) * height;
      } else {
        widthMismatch = true;
      }

    }
    // 3️⃣ Annan bredd → mismatch
    else {
      widthMismatch = true;
    }

  });

const heightMismatch = !(totalHeight === headerHeight || totalHeight === headerHeight + 10);

// -----------------------
// FORMATTERAD SUMMERING
// -----------------------

  const formattedWidths = foundWidths.map(w => {
    if (w === headerWidth / 2) {
      return `${w}x2`;
    }
    return `${w}`;
  }).join(", ");
/*
  const summary =
  `${header.number}. MissMatchWH: ${widthMismatch} : ${heightMismatch}
  HightHA: ${headerHeight} : ${totalHeight}
  WidthHA: ${headerWidth} : ${formattedWidths}
  -------------------------`;

  console.log(summary);
*/
  return {
    widthMismatch,
    heightMismatch
  };
}
