// CheckAndTell/outerHight.js

import { filter } from "../global/myConstants.js";

export function checkOuterWidthAndHight(sectionPortfolio) {

  const widthMismatch = new Set();
  const heightMismatch = new Set();

  const wallType = filter.Cabinet.group2.Wall;
  const baseType = filter.Cabinet.group2.Base;

  const frontsGroup1 = filter.Fronts.group1;
  const doorType = filter.Fronts.group2.Door;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const headerWidth = Number(header.width);
    const headerHeight = Number(header.height);

    let totalHeight = 0;
    let hasTestedArticles = false;

    console.log("==================================================");
    console.log("HEADER:", header.number);
    console.log("Header type:", header.type);
    console.log("Header width:", headerWidth);
    console.log("Header height:", headerHeight);
    console.log("Header corner:", header.corner);

    // 🔹 Hämta alla Horizontal FrontAccessories artiklar
    const horizontalArticles = header.returnArticles().filter(a =>
      a.group1 === filter.FrontAccessories.group1 &&
      a.group3 === filter.FrontAccessories.group3.Horizontal
    );
    const totalHorizontalQty = horizontalArticles.reduce((sum, a) => sum + (Number(a.quantity) || 1), 0);

    header.returnArticles().forEach(article => {

      const outerHeightAffecting =
        String(article.outerHeightAffecting)
          .trim()
          .toLowerCase() === "true";

      if (!outerHeightAffecting) return;

      hasTestedArticles = true;

      let width = Number(article.width);
      let height = Number(article.height);
      const qty = Number(article.quantity) || 1;

      // =====================================
      // ⭐ NY SPECIALREGEL – Vitrindörr med Horizontal FrontAccessories
      // =====================================
      if (article.group3 === filter.Fronts.group3.GlassDoor) {
        if (qty === totalHorizontalQty && totalHorizontalQty > 0) {
          console.log("    ⭐ Vitrindörr regel: vänder width/height för matchande antal");
          [width, height] = [height, width]; // swap
        } else if (totalHorizontalQty > 0) {
          console.log("    ⚠️ Vitrindörr kvantitet matchar inte antal Horizontal artiklar:", qty, "vs", totalHorizontalQty);
        }
      }

      console.log("  ✅ Artikel testas:", article.name);
      console.log("    group1:", article.group1);
      console.log("    group2:", article.group2);
      console.log("    group3:", article.group3);
      console.log("    width:", width);
      console.log("    height:", height);
      console.log("    quantity:", qty);

      if (isNaN(width) || isNaN(height)) {
        console.log("    ❌ width eller height är NaN");
        widthMismatch.add(header.number);
        return;
      }

      // =====================================
      // ⭐ SPECIALREGEL 1 – Väggskåp Hörn + Dörr → 40
      // =====================================
      const isWallCorner =
        header.type === wallType &&
        header.corner === true &&
        article.group1 === frontsGroup1 &&
        article.group2 === doorType;

      if (isWallCorner) {
        console.log("    ⭐ Väggskåp Hörn regel (width ska vara 40)");
        if (width !== 40) {
          console.log("    ❌ Bredd är inte 40");
          widthMismatch.add(header.number);
        }
        totalHeight += height * qty;
        return;
      }

      // =====================================
      // ⭐ SPECIALREGEL 2 – Bänkskåp Hörn → 25 / 88 width
      // =====================================
      const isBaseCorner88 =
        header.type === baseType &&
        header.corner === true &&
        headerWidth === 88 &&
        article.group1 === frontsGroup1 &&
        article.group2 === doorType;

      if (isBaseCorner88) {
        console.log("    ⭐ Bänkskåp Hörn 88 regel (width ska vara 25 eller 26)");
        if (width !== 25 && width !== 26) {
          console.log("    ❌ Bredd är inte 25 eller 26");
          widthMismatch.add(header.number);
        }
        totalHeight += height * qty;
        return;
      }

      // =====================================
      // ⭐ SPECIALREGEL 3 – Bänkskåp Hörn → 128 width → 60
      // =====================================
      const isBaseCorner128 =
        header.type === baseType &&
        header.corner === true &&
        headerWidth === 128 &&
        article.group1 === frontsGroup1 &&
        (article.group2 === doorType || article.group2 === filter.Fronts.group2.DrawerFront);

      if (isBaseCorner128) {
        console.log("    ⭐ Bänkskåp Hörn 128 regel (width ska vara 60)");
        if (width !== 60) {
          console.log("    ❌ Bredd är inte 60");
          widthMismatch.add(header.number);
        }
        totalHeight += height * qty;
        return;
      }

      // =====================================
      // ⭐ NY SPECIALREGEL – DrawerFront ×2 höjd
      // =====================================
      const drawerFrontDoubleHeight =
        article.group1 === frontsGroup1 &&
        article.group2 === filter.Fronts.group2.DrawerFront &&
        height === 10;

      if (drawerFrontDoubleHeight) {
        console.log("    ⭐ DrawerFront regel: multiplicerar höjd ×2");
        totalHeight += height * 2 * qty;
        return;
      }

      // =====================================
      // NORMAL LOGIK
      // =====================================
      if (width === headerWidth) {
        totalHeight += height * qty;
      }
      else if (width * 2 === headerWidth) {
        if (qty % 2 === 0) {
          totalHeight += (qty / 2) * height;
        } else if (!(header.type === wallType && header.corner === true)) {
          console.log("    ❌ Halvbredd men ojämn quantity");
          widthMismatch.add(header.number);
        } else {
          // Wall corner – ignore odd qty warning
          totalHeight += (qty / 2) * height;
        }
      }
      else {
        console.log("    ❌ Bredd matchar inte header");
        widthMismatch.add(header.number);
      }

    });

    // 🔴 Om inga artiklar testades → alltid height mismatch
    if (!hasTestedArticles) {
      console.log("  ❌ Inga artiklar testades som outerHeightAffecting");
      heightMismatch.add(header.number);
      return;
    }

    console.log("  Total beräknad OUTER height:", totalHeight);

    if (totalHeight !== headerHeight) {
      console.log("  ❌ Height mismatch");
      heightMismatch.add(header.number);
    } else {
      console.log("  ✅ Height match");
    }

  });

  return {
    widthMismatch: Array.from(widthMismatch),
    heightMismatch: Array.from(heightMismatch)
  };
}