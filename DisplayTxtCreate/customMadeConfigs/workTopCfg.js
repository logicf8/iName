export const workTopCfg = {
  infoKey: "wtInfo",
  label: "Bänkskiva",

  header: {
    singular: "Måttbeställd bänkskiva",
    plural: "Måttbeställda bänkskivor",
    singularPC: "Bänkskiva - Färdig längd",
    pluralPC: "Bänkskivor - Färdiga längder",
    buildSingleTxt: art =>
      ` - ${art.name} ${art.description}, ${art.color}`
  },

  priceByColor: color =>
    (color === "laminat" || color === "faner")
      ? " Pris per löpmeter"
      : " Pris per m²",

  getDimension(a) {
    switch (a.group3) {
      case "30-45":
        return `Bänkskiva - ❌${a.quantity * 1000} x 411 mm`;
      case "45.1-63.5":
        return `Bänkskiva - ❌${a.quantity * 1000} x 635 mm`;
      case "63.6-125":
        return `Bänkskiva - ❌${a.quantity * 1000} x 890 mm`;
      default:
        return `Bänkskiva - ❌ x 635 mm`;
    }
  }
};
