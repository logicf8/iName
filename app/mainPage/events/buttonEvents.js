// app\mainPage\events\buttonEvents.js

import { currentSectionPortfolio } from '../../../main.js';

import {
  ritningsBtn,
  internBtn,
  copyBtn,
} from '../../mainPage/config/selectors.js';

import { copyCustomText, copyCurrentLine } from '../services/clipboardService.js';

export function setupButtonEvents() {
  copyBtn.addEventListener('click', copyCurrentLine);

  ritningsBtn.addEventListener('click', () => {
    if (!currentSectionPortfolio.drawNR) {
      copyCustomText('Ingen ritningsNR finns!');
      return;
    }

    copyCustomText(currentSectionPortfolio.drawNR);
  });

  internBtn.addEventListener('click', () => {
    copyCustomText(`Säljare1: 
Säljare2: 
Se bifogad hantverksritning.`);
  });

}