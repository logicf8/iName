export function createFsDisplayName(sectionPortfolio, header){
  let width = "";
  header.width === "N/A" ? width = "" : width = ` ${header.width} cm`
  header.displayTxt = `${header.number}. ${header.description}${width}`

  if(header.withFlags.doors > 0 ) { header.displayTxt += ", med dörr" }
  else if (header.withFlags.drawerFronts === 2 ) { header.displayTxt += ", med två lådfronter" }
  else if (header.withFlags.drawerFronts === 3 ) { header.displayTxt += ", med tre lådfronter" }
  else if (header.withFlags.drawerFronts === 4 ) { header.displayTxt += ", med fyra lådfronter" }
  else if (header.withFlags.drawerFronts === 4 ) { header.displayTxt += ", med fem lådfronter" }
  if(header.group2 === "Diskmaskin") {header.displayTxt += " och kopplingsskenor"}
  if(header.group2 === "Köksfläkt") { let addTxt = ""; header.carbonFilter ? addTxt = ", med kolifilter" : addTxt = " för utluft"; header.displayTxt += addTxt}
  header.displayTxt += ` (${capitalizeFirstLetter(header.name)})`
  sectionPortfolio.displayTxts.push(header.displayTxt)
}

function capitalizeFirstLetter(str) {
  if (!str) return str; // hantera tom sträng
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
