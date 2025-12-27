/**
 * checkArticles() – förbättrad
 * - Ger ALDRIG undefined artikel om det finns någon artikel i headern
 * - Prioriterar artiklar som INTE är laminat eller faner
 * - Om toCheck är tomt används fallback
 */
export function checkMaterialsAntQuantity(header) {
  const articles = header.returnArticles();

  // Matchande artiklar
  let toCheck = articles.filter(
      a => a.group1 === "Måttbeställt" && a.group3 !== "Operation"
  );

  // --- FALLBACK: Om inga artiklar matchar villkoret ---
  if (toCheck.length === 0) {

      // Hitta artikel som inte är laminat/faner
      const nonLam = articles.find(a => 
          a.color !== "laminat" && a.color !== "faner"
      );

      // Eller bara ta första artikeln
      const fallbackArt = nonLam || articles[0];

      // Saknas ALLA artiklar
      if (!fallbackArt) {
          return {
              status: 0,
              message: "Inga artiklar alls i denna header.",
              article: undefined,
              count: 0
          };
      }

      return {
          status: 99,
          message: "Fallback-artikel vald.",
          article: fallbackArt,
          count: 1
      };
  }

  const refName = toCheck[0].name;
  const refDesc = toCheck[0].description;
  const refColor = toCheck[0].color;

  const allSameName = toCheck.every(a => a.name === refName);
  const allSameDesc = toCheck.every(a => a.description === refDesc);
  const allSameColor = toCheck.every(a => a.color === refColor);

  let status;
  let message;

  if (allSameName && allSameDesc && allSameColor) {
      status = 1;
      message = "Alla artiklar har samma namn, description och färg.";
  } else if (allSameName && allSameColor && !allSameDesc) {
      status = 2;
      message = "Alla artiklar har samma namn och färg men olika description.";
  } else {
      status = 3;
      message = "Artiklarna skiljer sig i namn, färg eller description.";
  }

  return {
      status,
      message,
      article: toCheck[0],
      count: toCheck.length
  };
}