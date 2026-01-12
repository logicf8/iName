export default class SectionPortfolio {
    constructor() {
      this.cmInfoFlag = {
      corners: 0,
      corner135: 0,
      sinks: 0,
      hobs: 0,
      wtInfo: undefined,
      wpInfo: undefined
    }

    this.countPriceFlag = {
      totCountArt: 0,
      totPrice: 0,
      pCabinets: 0,
      pFronts: 0,
      pCoverPanel: 0,
      pCustomMade: 0,
      pAppliance: 0,
      pLight: 0,
      pOther: 0
    }

    this.drawNR = undefined
    this.displayTxts = [];
    this.headers = [];

    this.totCountArt = 0;

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
