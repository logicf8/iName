import { main, currentSectionPortfolio, makeTestArray, makeReport } from './main.js'; // Din befintliga main.js-modul

const inputText = document.getElementById('inputText');
const copyStatus = document.getElementById('copyStatus');
const processBtn = document.getElementById('processBtn');
const displayList = document.getElementById('displayList');
const copyBtn = document.getElementById('copyBtn');
const h2 = document.getElementById('minH2');
const minH2 = document.getElementById('minAndraH2');
const expH3 = document.getElementById('expH3')
const missingH3 = document.getElementById('missingH3')
const emojiDescription = document.getElementById('emojiDescription')
const ritningsBtn = document.getElementById('ritningsBtn');
const internBtn = document.getElementById('internTextBtn');
const aliasBtn = document.getElementById('aliasBtn');
const belongBtn = document.getElementById('belongTextBtn');
let displayArray = [];
let currentIndex = 0;

// Bearbeta text när användaren klickar på knappen
processBtn.addEventListener('click', () => {
  const lines = inputText.value.split('\n');
  makeTestArray(lines);
  displayArray = main(lines); // Använd din main.js logik
  makeReport()
  
  currentIndex = 0;
  renderList();
  editText.value = displayArray[0]?.text || '';
  inputText.style.display = 'none';
  processBtn.style.display = 'none';
  emojiDescription.style.display = 'flex';
  document.querySelector('.button-row').style.display = 'flex';
  copyStatus.style.display = 'block';
  copyBtn.style.display = 'block';
  editText.style.display = 'block';
  h2.style.display = 'block';
  minH2.style.display = 'block';
});

// Rendera listan med rader
function renderList() {
  displayList.innerHTML = '';

  displayArray.forEach((line, index) => {
    const li = document.createElement('li');
    li.classList.add('line');

    if (index === currentIndex) li.classList.add('selected');
    if (index === lastBoldIndex) li.style.fontWeight = 'bold';

    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('emoji');
    emojiSpan.textContent = line.emoji || "";

    const textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.textContent = line.text;

    li.appendChild(emojiSpan);
    li.appendChild(textSpan);

    li.addEventListener('click', () => {
      currentIndex = index;
      renderList();
    });

    displayList.appendChild(li);
  });

  // Scrolla så att aktuell rad är synlig
  const selectedLi = displayList.querySelector('.selected');
  if (selectedLi) {
    selectedLi.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
    if (displayArray[currentIndex]) {
    editText.value = displayArray[currentIndex]?.text || "";
  }

}

// Navigering med tangentbord
document.addEventListener('keydown', (e) => {
  if(displayArray.length === 0) return;

  if(e.key === 'ArrowDown') {
    currentIndex = Math.min(currentIndex + 1, displayArray.length - 1);
    renderList();
    e.preventDefault();
  } else if(e.key === 'ArrowUp') {
    currentIndex = Math.max(currentIndex - 1, 0);
    renderList();
    e.preventDefault();
  } else if(e.key === 'c' && e.ctrlKey) {
    copyCurrentLine();
  }
});

let lastBoldIndex = null; // Håller koll på vilken rad som är fet

function copyCurrentLine() {
  if (displayArray.length === 0) return;

  const text = editText.value; // KOPIERA FRÅN TEXTAREA

  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    // Ta bort fet-stilen från tidigare rad
    if (lastBoldIndex !== null && lastBoldIndex !== currentIndex) {
      const prevLi = displayList.children[lastBoldIndex];
      if (prevLi) prevLi.style.fontWeight = 'normal';
    }

    // Gör aktuell rad fet
    const currentLi = displayList.children[currentIndex];
    if (currentLi) currentLi.style.fontWeight = 'bold';

    lastBoldIndex = currentIndex;

    // Gå till nästa rad
    currentIndex = Math.min(currentIndex + 1, displayArray.length - 1);
    renderList();
  });
}


// Kopiera-knapp
copyBtn.addEventListener('click', copyCurrentLine);

editText.addEventListener('input', () => {
  if (displayArray.length === 0) return;

  const text = editText.value;
  displayArray[currentIndex].text = text;

  if (text.length > 100) {
    editText.classList.add('text-too-long');
  } else {
    editText.classList.remove('text-too-long');
  }
});

// Ritnings-knapp
ritningsBtn.addEventListener('click', () => {
  if (!currentSectionPortfolio.drawNR) {
    copyStatus.textContent = "Ingen ritningsNR finns!";
    return;
  }

  const text = currentSectionPortfolio.drawNR;
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    // Ta bort fet stil från alla rader
    lastBoldIndex = null;
    renderList();
  });
});

// InternText-knapp
internBtn.addEventListener('click', () => {
  const text = `Säljare1: 
Säljare2: 
Se bifogad hantverksritning.`;

  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    // Ta bort fet stil från alla rader
    lastBoldIndex = null;
    renderList();
  });
});

aliasBtn.addEventListener('click', () => {
  const text = "Original - "
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    // Ta bort fet stil från alla rader
    lastBoldIndex = null;
    renderList();
  });
});

belongBtn.addEventListener('click', () => {
  const txtBelong = `Tillhör huvudorder: `;

  navigator.clipboard.writeText(txtBelong).then(() => {
    copyStatus.textContent = txtBelong;

    // Ta bort fet stil från alla rader
    lastBoldIndex = null;
    renderList();
  });
});
