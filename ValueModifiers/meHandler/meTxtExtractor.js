import { findHeaderME } from "./services/searchMeService.js"

export function createTxtByME(header){
    const meCode = extractMEcode(header.originalTxt)
    
    if(meCode !== null){
        
        const found = findHeaderME(meCode)
        if(found){ header.meDisplayTxt = `${header.number}. ${found.meDisplayTxt.trim()}`; }

    }
}

function extractMEcode(line) {
    // Ta bort allt innan "-"
    const left = line.includes("-") ? line.split("-")[0] : line;

    // Plocka fram ME-kod (ME eller ME/MA med siffror och ev. *)
    const match = left.match(/ME(?:\/[A-Z]+)?\s*[0-9A-Za-z*]*/);

    return match ? match[0].trim() : null;
}