/*
stats	Betydelse
1	Samma namn, beskrivning & material
2	Samma material
3	Endast laminat/faner
4	Endast kompositmaterial
5	Blandning av enkla + komposit
*/

export function makeHeaderTxt(sP, cfg) {
    const info = sP.cmInfoFlag?.[cfg.infoKey];

    if (!info) return;

    // Endast färdiga längder
    if (!info.firstCustomArticle && info.preCut !== 0) {
        sP.displayTxts.push(
            info.preCut === 1 ? cfg.header.singularPC : cfg.header.pluralPC
        );
        return;
    }

    // Ingenting alls
    if (!info.firstCustomArticle) return;

    if (info.stats === 1) {
        const art = info.firstCustomArticle;
        let txt = info.count === 1
            ? cfg.header.singular
            : cfg.header.plural;

        txt += cfg.header.buildSingleTxt(art);
        addWithPriceLimit(
            sP.displayTxts,
            txt,
            art.color,
            cfg.priceByColor
        );
    } else {
        sP.displayTxts.push(cfg.header.plural);
    }
}

export function DtByArt(sP, header, cfg) {
    const info = sP.cmInfoFlag?.[cfg.infoKey];

    header.returnArticles().forEach(article => {
        if(article.artNr === "702.746.28"){
          sP.displayTxts.push("Stöd för bänkskiva i tomt hörn❌")
          return;
        }  

        if (article.group3 !== "Operation") {
            makeCustomMadeTxt(sP, article, info, cfg);
        } else {
            let dTxt = article.description;
            if(cfg.infoKey === "wtInfo"){
              if(sP.cmInfoFlag.wtInfo.stats > 1){
                dTxt += ` - ${article.color}`
              }
            }
            else if(cfg.infoKey === "wtInfo"){
              if(sP.cmInfoFlag.wpInfo > 1){
                dTxt += ` - ${article.color}`
              }
            }
            sP.displayTxts.push(dTxt)
            
        }
    });
}

/* -------------------------------------------------------------------------- */
/*
stats	Betydelse
1	Samma namn, beskrivning & material
2	Samma material
3	Endast laminat/faner
4	Endast kompositmaterial
5	Blandning av enkla + komposit
*/
function makeCustomMadeTxt(sP, art, info, cfg) {
    const status = info?.stats ?? 0;

    if (!info?.firstCustomArticle) {
        addDimensionOnly(sP.displayTxts, cfg.getDimension(art));
        return;
    }

    switch (status) {

        case 1: {
            let dim = cfg.getDimension(art)
                .replace(`${cfg.label} -`, `${cfg.label}:`);
            addDimensionOnly(sP.displayTxts, dim);
            break;
        }

        case 2:
        case 3:
        case 4:
        case 5: {
            let baseTxt =
                `${cfg.getDimension(art)} - ${art.name} ${art.description}, ${art.color}`;

            baseTxt = baseTxt.replace(
                new RegExp(`^${cfg.label}\\s*-`),
                `${cfg.label}:`
            );

            addWithPriceLimit(
                sP.displayTxts,
                baseTxt,
                art.color,
                cfg.priceByColor
            );
            break;
        }

        default: {
            let dim = cfg.getDimension(art)
                .replace(`${cfg.label} -`, `${cfg.label}:`);
            addDimensionOnly(sP.displayTxts, dim);
        }
    }
}

/* -------------------------------------------------------------------------- */
/* HJÄLPFUNKTIONER                                                            */
/* -------------------------------------------------------------------------- */

function addWithPriceLimit(arr, baseText, color, priceByColor) {
    if (!baseText) return;

    let text = baseText.trim();
    if (text.endsWith(".")) text = text.slice(0, -1);

    const priceText = priceByColor
        ? priceByColor(color)
        : "";

    const fullText = text + "." + priceText;

    if (fullText.length <= 100) {
        arr.push(fullText);
    } else {
        arr.push(text);
    }
}

function addDimensionOnly(arr, txt) {
    if (!txt) return;
    arr.push(txt);
}
