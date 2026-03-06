import { addDisplayTxt } from "./helpers/displayTxtHelpers.js";

export function createFsDisplayName(sP, header) {
  const displayTxt = buildDisplayText(header);

  addDisplayTxt(sP.displayTxts, {
    text: displayTxt,
    level: "info"
  });
}

function buildDisplayText(header) {
  const width = header.width !== "N/A" ? ` ${header.width} cm` : "";
  let text = `${header.number}. ${header.description}${width}`;

  text += getFrontText(header.withFlags);
  text += getGroupText(header);
  text += ` (${capitalizeFirstLetter(header.name)})`;

  return text;
}

function getFrontText(withFlags) {
  if (withFlags.doors > 0) return ", med dörr";

  const drawerMap = {
    2: "två",
    3: "tre",
    4: "fyra",
    5: "fem"
  };

  if (drawerMap[withFlags.drawerFronts]) {
    return `, med ${drawerMap[withFlags.drawerFronts]} lådfronter`;
  }

  return "";
}

function getGroupText(header) {
  if (header.group2 === "Diskmaskin" && header.width !== 45 && header.name !== "SÖDERBODA" && header.name !== "LAGAN") {
    return " och kopplingsskenor";
  }

  if (header.group2 === "Köksfläkt") {
    return header.carbonFilter
      ? ", med kolfilter"
      : " för utluft";
  }

  return "";
}

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}