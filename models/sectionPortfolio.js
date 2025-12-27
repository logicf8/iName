export default class SectionPortfolio {
    constructor() {
      this.cmInfoFlag = {
      corners: 0,
      posCutOut: 0,
    }
    this.displayTxts = [];
    this.headers = [];
  }

  addCombinationHeader(comboHeader) {
  this.headers.push(comboHeader);
  }

  addCpFpHeader(cPanelHeader) {
  this.headers.push(cPanelHeader);
  }
  addOpenHeader(openCpHeader) {
  this.headers.push(openCpHeader);
  }
  addSecondStageHeader(ssHeader) {
  this.headers.push(ssHeader);
  }
  returnHeaders(){
    return this.headers
  }
  returnDisplayTxts(){
    return this.displayTxts;
  }
}
