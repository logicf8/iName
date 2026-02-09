import { filter } from "../global/myConstants.js";

const GROUP1 = {
  CABINET: filter.Cabinet.group1,
  OPENCAB: filter.CabTyp2.group1,
  APPLIANCE: filter.Appliance.group1,
  FRONT: filter.Fronts.group1,
  CUSTOM: filter.CustomMade.group1
};

const FRONT = {
  DOOR: filter.Fronts.group2.Door,
  DRAWERFRONT: filter.Fronts.group2.DrawerFront,
  DOORDISHW: filter.Fronts.group2.DishwasherFront
};

const APPLIANCE_G2 = {
  ACCESSORIES: filter.Appliance.group2.Accessories
};

export function CalcPNA(sP) {
  sP.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CoverPanelHeader") {
      header.returnArticles().forEach(article => {

        switch (article.group1) {
          case GROUP1.CABINET:
          case GROUP1.OPENCAB: {
            sP.countArtFlag.cabinets += article.quantity;
            sP.priceFlag.pCabinets += article.totPrice;
          } break;

          case GROUP1.APPLIANCE: {
            if (article.group2 !== APPLIANCE_G2.ACCESSORIES) {
              sP.countArtFlag.appliance += article.quantity;
              sP.priceFlag.pAppliances += article.totPrice;
            }
          } break;

          case GROUP1.FRONT: {
            if (Object.values(FRONT).includes(article.group2)) {
              article.height === 10
                ? sP.countArtFlag.fronts += 2 * article.quantity
                : sP.countArtFlag.fronts += article.quantity;

              sP.priceFlag.pFronts += article.totPrice;
            }
          } break;
        }

        if (
          article.group1 === GROUP1.CUSTOM && article.group3 !== "Operation" ||
          article.name === "YTTRE"
        ) {
          sP.countArtFlag.totArt += 1;
        }
        else if (!Number.isInteger(article.quantity)) {
          sP.countArtFlag.totArt += 1;
        }
        else {
          sP.countArtFlag.totArt += article.quantity;
        }

        sP.priceFlag.totPrice += article.totPrice;
      });
    }
  });
}
