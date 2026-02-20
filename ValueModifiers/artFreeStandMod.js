import { filter } from '../global/myConstants.js';

export function artValuesModifyFreeS(sectionPortfolio, header) {
  header.returnArticles().forEach(article => {
    switch(article.group1) {
      case filter.Appliance.group1: // Vitvaror
        if(article.group2 !== filter.Appliance.group2.Accessories) { // Ej tillbehör
          // FREESTANDING: endast en vitvara
          header.qualifier = true;
          header.name = article.name;
          header.description = article.description;
          header.group2 = article.group2;
          header.group3 = article.group3;
          header.width = article.width;
        } else {
          if(article.group3 === filter.Appliance.group3.CarbonFilter) {
            header.carbonFilter = true;
          }
        }
        break;

      case filter.Fronts.group1: // FrontFamilj
        fronts(header, article);
        break;
    }
  });
}

function fronts(header, article) {
  switch(article.group2) {
    case filter.Fronts.group2.Door:
      header.withFlags.doors += article.quantity;
      break;

    case filter.Fronts.group2.DrawerFront:
      header.withFlags.drawerFronts += article.quantity;
      break;
  }
}
