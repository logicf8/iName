import { meData } from './dataMeService.js'

export function findHeaderME(meCode) {
  return meData.find(meLine => meLine.meCode === meCode) || null;
}