import { addDisplayTxt } from "./helpers/displayTxtHelpers.js";

export function openTxt(sP, header){
  header.displayTxt = `${header.number}. ${header.description}`
  addDisplayTxt(sP.displayTxts, {
    text: header.displayTxt,
    level: "info"
  });
}