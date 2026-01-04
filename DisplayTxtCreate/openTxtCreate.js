export function openTxt(sectionPortfolio, header){
  header.displayTxt = `${header.number}. ${header.description}`
  sectionPortfolio.displayTxts.push(header.displayTxt)
}