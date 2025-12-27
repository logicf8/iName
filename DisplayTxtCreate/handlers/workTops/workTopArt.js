export function makeHeaderTxt(sP, wtInfo) {
    const singular = "Måttbeställd bänkskiva";
    const plural = "Måttbeställda bänkskivor";

    if (!wtInfo.article || wtInfo.status === 0) {
     sP.displayTxts.push(plural);
        return;
    }

    if (wtInfo.status === 1) {
        // Endast en artikel → visa artikelinfo på header
        const art = wtInfo.article;
        let dT = wtInfo.count === 1 ? singular : plural;
        dT += ` - ${art.name} ${art.description}, ${art.color}`;
        addWithPriceLimit(sP.displayTxts, dT, art.color);
    } else {
        // Status 2 eller 3 → endast plural som header
        sP.displayTxts.push(plural);
    }
}

export function DtByArtWT(sectionPortfolio, header, wtPreInfo){
    header.returnArticles().forEach(article => {
	    if(article.group3 !== "Operation"){
            makeCustomMadeWtTxt(sectionPortfolio, article, wtPreInfo);
		}
		else { sectionPortfolio.displayTxts.push(article.description) }
    });
}

/**
 * Genererar individuella rader för varje artikel
 */
function makeCustomMadeWtTxt(sectionPortfolio, thisArt, wtInfo) {

    const status = wtInfo?.status ?? 0;

    if (!wtInfo.article) {
        addDimensionOnly(sectionPortfolio.displayTxts, getDimension(thisArt));
        return;
    }

    switch (status) {

        case 1: {
            // Status 1 → dimension med kolon, ingen punkt, ingen pris
            let dim = getDimension(thisArt);
            dim = dim.replace("Bänkskiva -", "Bänkskiva:");
            addDimensionOnly(sectionPortfolio.displayTxts, dim);
        } break;

        case 2:
        case 3:
        case 99: {
            // Status 2,3,99 → dimension + artikel info + pris
            let baseTxt = `${getDimension(thisArt)} - ${thisArt.name} ${thisArt.description}, ${thisArt.color}`;
            baseTxt = baseTxt.replace(/^Bänkskiva\s*-/, "Bänkskiva:");
            addWithPriceLimit(sectionPortfolio.displayTxts, baseTxt, thisArt.color);
        } break;

        default: {
            let dim = getDimension(thisArt);
            dim = dim.replace("Bänkskiva -", "Bänkskiva:");
            addDimensionOnly(sectionPortfolio.displayTxts, dim);
        }
    }
}

/* --------------------------------------------------------------------------
   HJÄLPFUNKTIONER
-------------------------------------------------------------------------- */

function addWithPriceLimit(arr, baseText, color) {
    if (!baseText) return;

    let text = baseText.trim();
    if (text.endsWith(".")) text = text.slice(0, -1);

    const priceText =
        (color === "laminat" || color === "faner")
            ? " Pris per löpmeter."
            : " Pris per m².";

    const fullText = text + "." + priceText;

    if (fullText.length <= 100) {
        arr.push(fullText);
    } else {
        arr.push(text); // utan pris
    }
}

function addDimensionOnly(arr, txt) {
    if (!txt) return;
    arr.push(txt); // ingen punkt
}

function getDimension(a) {
    switch (a.group3) {
        case "30-45":
            return `Bänkskiva - ${a.quantity * 1000} x 411 mm`;
        case "45.1-63.5":
            return `Bänkskiva - ${a.quantity * 1000} x 635 mm`;
        case "63.6-125":
            return `Bänkskiva - ${a.quantity * 1000} x 890 mm`;
        default:
            return `Bänkskiva - ${Math.floor((a.quantity / 0.635) * 1000)} x 635 mm`;
    }
}

