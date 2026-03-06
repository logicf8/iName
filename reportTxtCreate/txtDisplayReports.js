import { addReportTxt } from "./helpers/reportTxtHelpers.js";

export function reportOverView(sP){
  // Funktion för att formatera pris enligt svenskt format
  const formatSEK = (value) => {
    return new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  if(sP.priceFlag.totPrice > 0 && sP.countArtFlag.totArt > 0){
    addReportTxt(sP.reportTxts, {
      title: "Order totalt",
      text1: `💰 Pris: ${formatSEK(sP.priceFlag.totPrice)} kr`,
      text2: `🛒 Antal: ${sP.countArtFlag.totArt} st`,
      info: "Avser artikelvärde som kommer att importeras"
    });
  }

  if(sP.countArtFlag.cabinets > 0 && sP.priceFlag.pCabinets > 0){
    addReportTxt(sP.reportTxts, {
      title: "Stommar",
      text1: `💵 Pris: ${formatSEK(sP.priceFlag.pCabinets)} kr`, 
      text2: `🧺 Antal: ${sP.countArtFlag.cabinets} st`,
      info: "Avser Metod, Tornviken och Vadholma"
    });
  }

  if(sP.countArtFlag.appliance > 0 && sP.priceFlag.pAppliances > 0){
    addReportTxt(sP.reportTxts, {
      title: "Vitvaror",
      text1: `💵 Pris: ${formatSEK(sP.priceFlag.pAppliances)} kr`,
      text2: `🧺 Antal: ${sP.countArtFlag.appliance} st`,
      info: "Avser vitvaror utan tillbehör. Kan därav diffa emot nKP"
    });
  }

  if(sP.countArtFlag.fronts > 0 && sP.priceFlag.pFronts > 0){
    addReportTxt(sP.reportTxts, {
      title: "Fronter",
      text1: `💵 Pris: ${formatSEK(sP.priceFlag.pFronts)} kr`,
      text2: `🧺 Antal: ${sP.countArtFlag.fronts} st`,
      info: "Avser yttre dörrar och lådfronter"
    });
  }
  // Kampanj: minst 6 stommar och 4 vitvaror
  if (sP.countArtFlag.cabinets >= 6 && sP.countArtFlag.appliance >= 4) {
    const discount = sP.priceFlag.pFronts * 0.25;

    addReportTxt(sP.reportTxts, {
      title: "🔥 Kampanj 🔥",
      text1: `🔖 Rabatt: ${formatSEK(discount)} kr`,
      text2: "",
      info: "Minst 6 stommar och 4 vitvaror → OK!"
    });
  }
}