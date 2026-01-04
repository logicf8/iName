import { meVentWarranty } from './addWarantyTxt.js'

export function cPanels(sP){
  sP.displayTxts.push("Täcksidor - För placering se hantverksritning")
}

export function handels(sP, header) {
  let handels = false;
  let knobs = false;
  let push = false;

  header.returnArticles().forEach(article => {
    switch (article.group2) {
      case "handtag":
        handels = true;
        break;
      case "knopp":
        knobs = true;
        break;
      case "tryck och öppna":
        push = true;
        break;
    }
  });

  const items = [];

  if (knobs) items.push("knoppar");
  if (handels) items.push("handtag");
  if (push) items.push("tryck & öppna beslag");

  if (items.length > 0) {
    let txt = "";

    if (items.length === 1) {
      txt = items[0];
    } else if (items.length === 2) {
      txt = items.join(" och ");
    } else {
      txt = items.slice(0, -1).join(", ") + " och " + items.at(-1);
    }

    sP.displayTxts.push(capitalizeFirstWord(txt));
  }
}

export function otherArt(sP, header){
  header.returnArticles().forEach(article => {
    if(article.artNr === "702.561.77"){ meVentWarranty(sP) }
    if(article.artNr === "702.746.28"){ sP.displayTxts.push("Stödbeslag för fixering av täcksida / stödsida❌")}
  })
}

function capitalizeFirstWord(text) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}
