export function checkDrawerWidthDepthHight(header) {
  let widthMismatch = false;
  let depthMismatch = false;
  let totalHeight = 0;

  const foundDepths = []; // För att hålla reda på om någon låda är grundare
  const drawerHeightMap = {
    låg: 10,
    med: 20,
    hög: 30
  };

  const headerWidth = Number(header.width);
  const headerDepth = Number(header.depth);
  const headerHeight = Number(header.height);

  header.returnArticles().forEach(article => {
    // -----------------------
    // FILTER: Endast InredningStomme / Drawer / Drawer
    // -----------------------
    if (
      article.group1 === "InredningStomme" &&
      article.group2 === "Låda" &&
      article.group3 === "Låda"
    ) {

      const articleWidth = Number(article.width);
      const articleDepth = Number(article.depth);
      const articleQuantity = Number(article.quantity || 1);

      // -----------------------
      // WIDTH CHECK
      // -----------------------
      if (articleWidth !== headerWidth) {
        widthMismatch = true;
      }

      // -----------------------
      // DEPTH CHECK
      // -----------------------
      if (articleDepth > headerDepth) {
        depthMismatch = true;
      } else if (articleDepth < headerDepth) {
        // Spara värden för info om låda är grundare
        foundDepths.push(`ID:${article.number}(${articleDepth})`);
      }

      // -----------------------
      // HEIGHT SUM
      // -----------------------
      const articleHeightLabel = article.group4; // alltid "låg", "med", "hög"
      const h = (drawerHeightMap[articleHeightLabel.toLowerCase()] ?? 0) * articleQuantity;
      totalHeight += h;
    }
  });

  // -----------------------
  // HEIGHT MISMATCH
  // -----------------------
  const heightMismatch = totalHeight > headerHeight;

  // -----------------------
  // FORMATTERAD CONSOLE LOG
  // -----------------------
  /*
  const summary =
    `${header.number}. WidthNotOK: ${widthMismatch} DepthNotOK: ${depthMismatch} NAROW: ${foundDepths.join(", ")} HeightNotOK: ${heightMismatch} TotHeight: ${totalHeight}`;
  
  console.log(summary);
*/
  // -----------------------
  // RETURN
  // -----------------------
  return {
    widthMismatch,
    depthMismatch,
    heightMismatch,
    totalHeight,
    foundDepths
  };
}
