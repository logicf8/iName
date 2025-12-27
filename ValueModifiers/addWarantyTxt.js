const startTxt = "(!) Viktigt för garanti -"

export function setBaseCabWarrantyTxt(header){

  if(header.forFlags.sink){
    header.warrantyTxt = `${startTxt} Hyllplansskydd & tätningssats`
  }
  else if(header.forFlags.oven || header.forFlags.combiMicro){
    header.warrantyTxt = `${startTxt} Diffusionsspärr`
  }
  else if(header.forFlags.hob){
    header.warrantyTxt = `${startTxt} Hällskydd`
  }
  else if(header.forFlags.hobFan){
    if(header.drawerFront === 2) {
      header.warrantyTxt = `${startTxt} Hällskydd av blind- innerlådsfront`
    }    
  }
}
export function setHighCabWarrantyTxt(header){
  if(header.forFlags.fridgeOrF){
    header.warrantyTxt = `${startTxt} Hyllplansskydd & ventilation. KÖP HYLLPLANSSKYDD!`
  }
}

export function setFreeStandingWarrantyTxt(header){
  if(header.group2 === "Diskmaskin"){
    header.warrantyTxt = `${startTxt} Golvskydd och diffusionsspärr`
  }
  else if (header.group2 === "Kyl/Frys"){
      if(header.name === "SPELNÄS"){
        header.warrantyTxt = `${startTxt} Golvskydd. KÖP! IKEA säljer ej rätt storlek`
      }
      else{
        header.warrantyTxt === `${startTxt} Golvskydd och ventilation`
      }
  }
}