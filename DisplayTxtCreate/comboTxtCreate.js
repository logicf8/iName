export function createDisplayTxtCombo(sectionPortfolio, header) {

    let displayName = `${header.number}. ${header.description}`;
    // -----------------------------------------------------
    //  1. Vitvaror (forFlags)
    // -----------------------------------------------------
    const appParts = [];
    const f = header.forFlags;
    let bypass = false;

    if (f.oven && f.combiMicro) appParts.push("ugn och kombimikrovågsugn");
    else if (f.oven && f.micro) appParts.push("ugn och mikrovågsugn");
    else if (f.combiMicro && f.micro) appParts.push("kombimikrovågsugn och mikrovågsugn");
    else if (f.hob && f.oven) appParts.push("häll och ugn");
    else if (f.hob && f.combiMicro) appParts.push("häll och kombimikrovågsugn");
    else if (f.hob && f.micro) appParts.push("häll och mikrovågsugn");
    else if (f.hob) appParts.push("häll");
    else if (f.hobFan) appParts.push("häll med inbyggd fläkt");
    else if (f.ugn) appParts.push("ugn");
    else if (f.combiMicro) appParts.push("kombimikrovågsugn");
    else if (f.micro) appParts.push("mikrovågsugn");
    else if (f.fan) appParts.push("fläkt");
    else if (f.sink) appParts.push("diskho");
    else if (f.fridgeOrF) { appParts.push(header.applianceDescription); bypass = true };

    if (appParts.length > 0) {
        displayName += " för " + appParts.join(", ");
    }
    if(!bypass){ 
    // -----------------------------------------------------
    //  2. withFlags
    // -----------------------------------------------------
    const w = header.withFlags;
    const f = header.hingeFlags;
    const flagList = [];

    // Grupp 1 — Om någon är true, stoppa resten
    if (w.pullOut > 0) flagList.push("utdragsfunktion");
    if (w.carousel > 0) flagList.push("karusell");
    if (w.larder > 0) flagList.push("skafferiutdrag");
    if (w.cleaningInt > 0) flagList.push("städskåpsinredning");
    
    if (flagList.length === 0) {
        // Grupp 2 — körs bara om ingen i grupp 1 var true
        let oFrontDrawersNr = outDrawCheck(header); 
        if (oFrontDrawersNr > 0) flagList.push(oFrontDrawersNr === 1 ? "låda" : "lådor");
        if (w.innerDF > 0) flagList.push(w.innerDF === 1 ? "innerlåda" : "innerlådor");
        if (w.wireBaskets > 0) flagList.push(w.wireBaskets === 1 ? "trådback" : "trådbackar");
        if (w.workSerfaces > 0) flagList.push(w.workSerfaces === 1 ? "arbetsyta" : "arbetsytor");
        if (w.conectFronts > 0) flagList.push("ihopkopplade fronter");
        if (blindCheck(header)) flagList.push("blindfront");
        

        if (f.hHorr > 0) { //Horisontella gångjärn
            let check = freeOutFronts(header);
            if(f.hHorr === check) { flagList.push(f.hHorr === 1 ? "horisontell dörr" : "horisontella dörrar"); }
            else if(f.hHorr === w.glasDoors && check === 0){ flagList.push(f.hHorr === 1 ? "horisontell vitrindörr" : "horisontella vitrindörrar"); w.glasDoors -= f.hHorr}
            else if(f.hHorr === check + w.glasDoors) { flagList.push("horisontell; dörr och vitrindörr"); w.glasDoors -= (f.hHorr - check) }
        }
        if (w.glasDoors > 0) flagList.push(w.glasDoors === 1 ? "vitrindörr" : "vitrindörrar");
        if (w.doors > 0) flagList.push(w.doors === 1 ? "dörr" : "dörrar");
        if (w.shelfs > 0) flagList.push("hyllplan");
    }

    // Lägg till flaggorna i displayName
    if (flagList.length === 0) {
        sectionPortfolio.displayTxts.push(`${displayName}, utan inredning`)
        return;
    }
    if (flagList.length === 1) {
        displayName += ", med " + flagList[0];
    } else if (flagList.length === 2) {
        displayName += ", med " + flagList[0] + " och " + flagList[1];
    } else {
        const last = flagList.pop();
        displayName += ", med " + flagList.join(", ") + " och " + last;
    }
    }
    header.displayTxt = displayName;
    sectionPortfolio.displayTxts.push(header.displayTxt)
}

function freeOutFronts(header){
    let doCheck = header.drawersFlags.drawerFront +  header.withFlags.innerDF - header.withFlags.drawers;
    return doCheck
}

function blindCheck(header){
  let doCheck = header.drawersFlags.drawerFront - (header.withFlags.drawers - header.withFlags.innerDF - header.hingeFlags.hHorr)
  console.log("This is the check: " + doCheck)
  if(doCheck === 1) {
    if(header.withFlags.glasDoors === header.hingeFlags.hHorr) return false;
    return true }
  return false;
}

function outDrawCheck(header){
    let doCheck = header.withFlags.drawers - header.withFlags.innerDF;
    return doCheck;
}
