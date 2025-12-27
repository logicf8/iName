import staticME from '../../../Data/StaticME.js'

export const meData = staticME.map(str => {
  const parts = str.split("_");
  return {
    original: str,
    filter: parts[0],
    meCode: parts[1],
    meDisplayTxt: parts[2],
    warentyNr: parts[parts.length - 1],
  };
});