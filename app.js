//app.js
import { main, currentSectionPortfolio, makeTestArray, makeReport } from './main.js'; // Din befintliga main.js-modul
import { renderCPinOrder } from './appExport.js'
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

  renderCheckTxts();
  renderReport();
  expReportDisplay();
  renderCPinOrder(currentSectionPortfolio);

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
    e.preventDefault(); // blockera standardkopiering
    copyCurrentLine();  // kopiera alltid aktiv rad
  }
});



let lastBoldIndex = null; // Håller koll på vilken rad som är fet

function copyCurrentLine() {
  if (displayArray.length === 0) return;

  // Hämta text direkt från arrayen
  const text = displayArray[currentIndex]?.text || "";

  // Kopiera texten till clipboard
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    // Ta bort fetstil från tidigare rad
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

function renderCheckTxts() {
  const mainContainer = document.querySelector(".checkMainContainer");
  const checkContainer = document.querySelector(".checkTxtContainer");
  const zoomContainer = document.querySelector(".zoomResultContainer");

  if (!mainContainer || !checkContainer || !zoomContainer) return;

  const checkTxts = currentSectionPortfolio.returncheckTxts
    ? currentSectionPortfolio.returncheckTxts()
    : currentSectionPortfolio.checkTxts;

  if (!checkTxts || checkTxts.length === 0) {
    mainContainer.style.display = "none";
    return;
  }

  mainContainer.style.display = "flex";
  checkContainer.style.display = "flex";
  checkContainer.innerHTML = "";
  zoomContainer.style.display = "none";
  zoomContainer.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.classList.add("checkTxtHeader");
  header.textContent = "Kontroll av artikellista";
  checkContainer.appendChild(header);

  checkTxts.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("checkItem");

    // Bild
    const img = document.createElement("img");
    img.src = `pics/testPics/${item.pic}`;
    img.alt = item.title;
    img.width = 50;
    img.height = 50;
    wrapper.appendChild(img);

    // Zoom-ikon
    const zoom = document.createElement("span");
    zoom.classList.add("checkZoom");
    zoom.textContent = "🔍";
    wrapper.appendChild(zoom);

    // Text-wrap
    const textWrap = document.createElement("div");
    textWrap.classList.add("checkTextWrap");

    const row1 = document.createElement("div");
    row1.classList.add("checkRow1");
    row1.innerHTML = `
      <strong>${item.title}</strong>
      <span class="infoEmoji" title="${item.message || ""}">🛈</span>
      <span class="checkEmoji">${item.emoji || ""}</span>
    `;
    const row2 = document.createElement("div");
    row2.classList.add("checkRow2");
    row2.textContent = item.text;

    textWrap.appendChild(row1);
    textWrap.appendChild(row2);
    wrapper.appendChild(textWrap);

    checkContainer.appendChild(wrapper);

    // 🔽 Zoom click
    zoom.addEventListener("click", () => {
      if (!item.rows || item.rows.length === 0) return;

      // Rensa tidigare zoom
      zoomContainer.innerHTML = "";

      // Wrapper för zoom
      const zoomWrapper = document.createElement("div");
      zoomWrapper.classList.add("zoomContent");

      // Titel
      const zoomTitle = document.createElement("div");
      zoomTitle.classList.add("checkTxtHeader");
      zoomTitle.textContent = item.title;
      zoomWrapper.appendChild(zoomTitle);

      // Tabell
      const table = document.createElement("table");
      table.classList.add("zoomTable");

      let firstColName = "Färg";
      let firstProp = "color"; // default

      if (item.title === "Glassidor") {
        firstColName = "Lådhöjd";
        firstProp = "color";
      } else if (item.title === "Frontfamilj") {
        firstColName = "Artiklar från";
        firstProp = "color"; // <-- använd color, inte article
      } else if (item.title === "Yttermått") {
        firstColName = "Avvikelse";
        firstProp = "color";
        }

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th>${firstColName}</th>
          <th>Nummer på stomme (samma som i SäljaPro och nKP)</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      item.rows.forEach(row => {
        const tr = document.createElement("tr");

        const tdFirst = document.createElement("td");
        tdFirst.textContent = row[firstProp] || "";
        tr.appendChild(tdFirst);

        const tdNumbers = document.createElement("td");
        if (row.numbers && row.numbers.length > 0) {
          row.numbers.forEach(number => {
            const span = document.createElement("span");
            span.textContent = number;
            span.classList.add("zoomNumber");
            tdNumbers.appendChild(span);
          });
        } else {
          // 👇 viktigt: lägg in ett "osynligt" innehåll
          tdNumbers.textContent = ".";   // eller ""
          tdNumbers.classList.add("emptyCell");
        }
        tr.appendChild(tdNumbers);

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      zoomWrapper.appendChild(table);

      // Stäng-knapp
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Stäng";
      closeBtn.classList.add("closeZoom");
      closeBtn.addEventListener("click", () => {
        zoomContainer.style.display = "none";
        zoomContainer.innerHTML = "";
      });
      zoomWrapper.appendChild(closeBtn);

      zoomContainer.appendChild(zoomWrapper);
      zoomContainer.style.display = "block";
    });
  });
}

function renderReport() {
  const container = document.querySelector(".reportContainer");

  container.style.display = 'grid';
  // Rensa tidigare innehåll
  container.innerHTML = "";

  currentSectionPortfolio.reportTxts.forEach(item => {
    const reportItem = document.createElement("div");
    reportItem.classList.add("reportItem");

    reportItem.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span class="infoEmoji" title="${item.info}">🛈</span>
      </div>
      <div>${item.text1}</div>
      <div>${item.text2}</div>
    `;

    container.appendChild(reportItem);
  });
}

// Hämta containern
const containerExp = document.querySelector('.reportExpContainer');
function expReportDisplay(){
// Kontrollera om expAlert finns och har element
if (currentSectionPortfolio.expAlert.length > 0) {
  containerExp.style.display = 'grid';
  containerExp.innerHTML = "";
  // Skapa H2 med varningsmeddelande
  const warningTitle = document.createElement('h3');
  warningTitle.textContent = '🔔 Varning följande artiklar har utgått och kommer inte att importeras!';
  containerExp.appendChild(warningTitle);

  // Loopa igenom arrayen och skapa <p> för varje produkt
  currentSectionPortfolio.expAlert.forEach(product => {
    const p = document.createElement('p');
    p.textContent = `⇝ ${product.name} | ${product.description.toLowerCase()} | ${product.artNr} `; // Om produkten är ett objekt, använd t.ex. product.name
      containerExp.appendChild(p);
    });
  }
}