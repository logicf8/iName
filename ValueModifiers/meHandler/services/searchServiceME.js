import { meData } from '../services/dataServiceME.js';

export function findHeaderME(meCode) {
  return meData.find(meLine => meLine.meCode === meCode) || null;
}