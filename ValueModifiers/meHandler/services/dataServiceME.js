import staticME from '../../../Data/meCodes.js';

export const meData = staticME.map(str => {
  const parts = str.split("_");
  return {
    original: str,
    meCode: parts[0],
    meDescription: parts[1],
    type: parts[2],
    width: parts[3],
    depth: parts[4],
    height: parts[5],
    appliance: parts[6]
  };
});