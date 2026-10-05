import {
  updatePinAmount
} from '../state/cPinState.js';

import {
  copyCustomText
} from '../services/clipboardService.js';

export function createImagePinRow(article) {
  const wrapper = document.createElement('div');

  wrapper.className = 'pin-image-item';

  wrapper.dataset.artNr = article.artNr;

  const title = document.createElement('div');

  title.className = 'pin-image-title';

  title.textContent = article.name;

  const row = document.createElement('div');

  row.className = 'pin-image-row';

  const imgContainer = document.createElement('div');

  imgContainer.className = 'img-container';

  const img = document.createElement('img');

  img.src = `./app/mainPage/pics/articlar/${article.pic}`;

  img.alt = article.name;

  const copyIcon = document.createElement('span');

  copyIcon.className = 'quick-copy-icon';

  copyIcon.textContent = '📋';

  copyIcon.title = 'Kopiera artikelnummer';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (article.artNr) {
      copyCustomText(article.artNr);

      // Ändra bakgrundsfärgen till var(--main), texten till vit och tvinga opacitet 1 vid klick
      copyIcon.style.backgroundColor = 'var(--main)';
      copyIcon.style.color = '#ffffff';
      copyIcon.style.opacity = '1';

      // Återställ stilarna efter 0,5 sekunder (500 ms)
      setTimeout(() => {
        copyIcon.style.backgroundColor = '';
        copyIcon.style.color = '';
        copyIcon.style.opacity = '';
      }, 500);
    }
  };

  img.addEventListener('click', handleCopy);
  copyIcon.addEventListener('click', handleCopy);

  imgContainer.appendChild(img);
  imgContainer.appendChild(copyIcon);

  const amountWrap = document.createElement('div');

  amountWrap.className = 'amount-wrap';

  const minusBtn = document.createElement('button');

  minusBtn.type = 'button';
  minusBtn.textContent = '−';
  minusBtn.tabIndex = -1;

  const plusBtn = document.createElement('button');

  plusBtn.type = 'button';
  plusBtn.textContent = '+';
  plusBtn.tabIndex = -1;

  const input = document.createElement('input');

  input.type = 'number';
  input.min = 0;
  input.max = 99;
  input.value = 0;
  input.tabIndex = 0;

  function setValue(val) {
    val = Math.max(0, Math.min(99, val));

    input.value = val;

    updatePinAmount(article.artNr, val);
  }

  minusBtn.addEventListener('click', () => {
    setValue(Number(input.value) - 1);
  });

  plusBtn.addEventListener('click', () => {
    setValue(Number(input.value) + 1);
  });

  input.addEventListener('input', () => {
    setValue(Number(input.value));
  });

  amountWrap.appendChild(minusBtn);
  amountWrap.appendChild(input);
  amountWrap.appendChild(plusBtn);

  row.appendChild(imgContainer);
  row.appendChild(amountWrap);

  wrapper.appendChild(title);
  wrapper.appendChild(row);

  return wrapper;
}