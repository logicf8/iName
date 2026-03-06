// CheckAndTell/innerHeight.js

import { filter } from "../global/myConstants.js";

export function checkInnerHeight(sectionPortfolio) {

  const widthMismatch = new Set();
  const heightMismatch = new Set();
  const depthMismatch = new Set();

  const hingeValue = filter.FrontAccessories.group2.Hinges;
  const baseType = filter.Cabinet.group2.Base;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const headerWidth = Number(header.width);
    const headerHeight = Number(header.height);
    const headerDepth = Number(header.depth);

    let totalHeight = 0;
    let hasTestedArticles = false;

    console.log("--------------------------------------------------");
    console.log("HEADER:", header.number);
    console.log("Header type:", header.type);
    console.log("Header width:", headerWidth);
    console.log("Header height (inner):", headerHeight);
    console.log("Header depth:", headerDepth);
    console.log("Header corner:", header.corner);

    header.returnArticles().forEach(article => {

      const innerHeightAffecting =
        String(article.innerHeightAffecting)
          .trim()
          .toLowerCase() === "true";

      if (!innerHeightAffecting) return;

      hasTestedArticles = true;

      const width = Number(article.width);
      const height = Number(article.height);
      const depth = Number(article.depth);
      const qty = Number(article.quantity) || 1;

      console.log("  ✅ Artikel testas:", article.name);
      console.log("    group1:", article.group1);
      console.log("    group2:", article.group2);
      console.log("    width:", width);
      console.log("    height:", height);
      console.log("    depth:", depth);
      console.log("    quantity:", qty);

      // =====================================
      // ⭐ SPECIALREGEL 1 – Gångjärn
      // Bredd & djup ignoreras
      // =====================================
      if (article.group2 === hingeValue) {

        console.log("    ⭐ Gångjärn regel: bredd & djup ignoreras");

        if (isNaN(height)) {
          console.log("    ❌ Height är NaN (gångjärn)");
          heightMismatch.add(header.number);
        } else {
          totalHeight += height * qty;
        }

        return;
      }

      // =====================================
      // ⭐ SPECIALREGEL 2 – Cleaning
      // =====================================
      const isCleaning =
        article.group1 === filter.Interior.group1 &&
        article.group2 === filter.Interior.group2.Cleaning;

      if (isCleaning) {

        console.log("    ⭐ Cleaning regel: width 40 eller 60 godkänt");

        if (isNaN(width) || isNaN(height) || isNaN(depth)) {
          console.log("    ❌ Width, height eller depth är NaN (Cleaning)");
          widthMismatch.add(header.number);
          heightMismatch.add(header.number);
          depthMismatch.add(header.number);
          return;
        }

        if (width !== 40 && width !== 60) {
          console.log("    ❌ Bredd är varken 40 eller 60");
          widthMismatch.add(header.number);
        }

        if (depth > headerDepth) {
          console.log("    ❌ Djup större än header");
          depthMismatch.add(header.number);
        }

        totalHeight += height * qty;
        return;
      }

      // =====================================
      // För alla andra artiklar: NaN-kontroll
      // =====================================
      if (isNaN(width) || isNaN(height) || isNaN(depth)) {

        if (isNaN(width)) {
          console.log("    ❌ Width är NaN");
          widthMismatch.add(header.number);
        }

        if (isNaN(height)) {
          console.log("    ❌ Height är NaN");
          heightMismatch.add(header.number);
        }

        if (isNaN(depth)) {
          console.log("    ❌ Depth är NaN");
          depthMismatch.add(header.number);
        }

        return;
      }

      // =====================================
      // ⭐ SPECIALREGEL 3 – BaseCorner128
      // =====================================
      const isBaseCorner128 =
        header.type === baseType &&
        header.corner === true &&
        headerWidth === 128 &&
        article.group1 === filter.Interior.group1 &&
        article.group2 === filter.Interior.group2.Drawer;

      if (isBaseCorner128) {

        console.log("    ⭐ Bänkskåp Hörn 128 innerregel (width ska vara 60)");

        if (width !== 60) {
          console.log("    ❌ Bredd är inte 60");
          widthMismatch.add(header.number);
        }

        if (depth > headerDepth) {
          console.log("    ❌ Djup större än header");
          depthMismatch.add(header.number);
        }

        totalHeight += height * qty;
        return;
      }

      // =====================================
      // NORMAL LOGIK
      // =====================================
      if (width !== headerWidth) {
        console.log("    ❌ Bredd matchar inte header (inner)");
        widthMismatch.add(header.number);
        return;
      }

      if (depth > headerDepth) {
        console.log("    ❌ Djup större än header (inner)");
        depthMismatch.add(header.number);
        return;
      }

      totalHeight += height * qty;

    });

    if (!hasTestedArticles) {
      console.log("  ❌ Inga innerHeightAffecting-artiklar");
      heightMismatch.add(header.number);
      return;
    }

    console.log("  Total beräknad INNER height:", totalHeight);

    if (totalHeight > headerHeight) {
      console.log("  ❌ Inner height mismatch");
      heightMismatch.add(header.number);
    } else {
      console.log("  ✅ Inner height OK");
    }

  });

  return {
    widthMismatch: Array.from(widthMismatch),
    heightMismatch: Array.from(heightMismatch),
    depthMismatch: Array.from(depthMismatch)
  };
}