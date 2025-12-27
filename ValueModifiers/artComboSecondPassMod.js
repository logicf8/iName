export function forButNotInCombo(header){
  if(header.meDisplayTxt !== undefined){
    let text = header.meDisplayTxt;
    switch (true) {
      case text.includes("för häll med utsugsfläkt"):{
        header.forFlags.hobFan = true
      } break;

      case text.includes("för häll och ugn"):{
        header.forFlags.hob = true;
        header.forFlags.oven = true;
      } break;

      case text.includes("för ugn och kombimikrovågsugn"): {
          header.forFlags.oven = true;
          header.forFlags.combiMicro = true;

      } break;
      case text.includes("för ugn och mikrovågsugn"): {
          header.forFlags.oven = true;
          header.forFlags.micro = true;
    
      } break;

      case text.includes("för ugn"): {
        header.forFlags.oven = true;
      }break;

      case text.includes("för kombimikrovågsugn"):{
        header.forFlags.combiMicro = true;
      }break;

      case text.includes("för fläkt"):{
        header.forFlags.fan = true;
      }break;

      case text.includes("för kyl/frys"):{
        header.forFlags.fridgeOrF = true;
      }break;

      case text.includes("för mikrovågsugn"):{
        header.forFlags.micro = true;
      }break;

      case text.includes("för diskho"):
        header.forFlags.sink = true;
        break;

      case text.includes("för häll"):{
        header.forFlags.hob = true;
      }break;

  }


  }
}