import { meData } from '../services/dataMeService.js';

export function findHeaderME(meCode) {
  return meData.find(meLine => meLine.meCode === meCode) || null;
}