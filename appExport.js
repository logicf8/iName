function createPinRow(article) {
  const row = document.createElement('div');
  row.className = 'pin-row';
  row.dataset.artNr = article.artNr;

  const label = document.createElement('span');
  label.className = 'pin-label';
  let text;

  if (article.width && article.height) {
    text =
      article.group3 === "N/A"
        ? `${article.width} x ${article.height}`
        : `${article.width} x ${article.height} (${article.group3})`;
  } else {
    text = article.name;
  }

  label.textContent = text;

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

  row.appendChild(label);
  row.appendChild(amountWrap);

  return row;
}

/* ===============================
   cPinOrder – Artikelräknare
   =============================== */

export function renderCPinOrder(currentSectionPortfolio) {
  console.log(currentSectionPortfolio)
  if (!currentSectionPortfolio?.cPinOrder?.length) return;

  const pinContainer = document.createElement('div');
  pinContainer.className = 'container';

  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'pin-columns';
  pinContainer.appendChild(columnsContainer);

  let lastGroupKey = null;
  let sectionDiv = null;

  /* ===== Vanliga artiklar ===== */
  currentSectionPortfolio.cPinOrder.forEach(article => {
    const groupKey = `${article.name}||${article.color}`;

    if (groupKey !== lastGroupKey) {
      sectionDiv = document.createElement('div');
      sectionDiv.className = 'pin-section';

      const h3 = document.createElement('h3');
      h3.textContent = `${article.name} ${article.color}`;
      sectionDiv.appendChild(h3);

      columnsContainer.appendChild(sectionDiv);
      lastGroupKey = groupKey;
    }

    sectionDiv.appendChild(createPinRow(article));
  });

  // --- Tilläggsartiklar ---
  const extraArticles = [
    { name: 'Borrmall', artNr: '903.233.93' },
    { name: 'Stödbeslag', artNr: '702.746.28' },
    { name: 'Diffusionsspärr', artNr: '006.135.42' },
    { name: 'Golvskydd 60', artNr: '402.819.94' },
    { name: 'Stödgavel vit', artNr: '705.160.95' },
    { name: 'Stödgavel svart', artNr: '105.160.98' }, 
    { name: 'Skarvkoppling dörrar', artNr: '303.669.17' },
    { name: 'Ventilationsgaller', artNr: '702.561.77' },
    { name: 'Ventilerad sockel', artNr: '302.214.58' },    
    
  ];

    const MAX_PER_COLUMN = 6;
    let extraSection = null;

    extraArticles.forEach((article, index) => {
      // Ny kolumn var 6:e artikel
      if (index % MAX_PER_COLUMN === 0) {
        extraSection = document.createElement('div');
        extraSection.className = 'pin-section';

        const h3 = document.createElement('h3');
        h3.textContent = index === 0 ? 'Övrigt' : '.';
        extraSection.appendChild(h3);

        columnsContainer.appendChild(extraSection);
      }

      extraSection.appendChild(createPinRow(article));
});

    // --- Skapa exportknappen på egen rad UNDER kolumnen ---
    const exportBtnWrapper = document.createElement('div');
    exportBtnWrapper.style.width = '100%';
    exportBtnWrapper.style.textAlign = 'center';
    exportBtnWrapper.style.marginTop = '12px';

    pinContainer.appendChild(createBottomButtonRow());


  const extraArtPics = [
    { pic: '80012853.avif', name: 'Lådmatta 150 cm', artNr: '800.128.53' },
    { pic: '50549836.avif', name: 'Lådmatta 50x48 cm', artNr: '505.498.36' },
    { pic: '40551052.avif', name: 'Lådmatta 50x96 cm', artNr: '405.510.52' },
    { pic: '50600575.avif', name: 'För kryddburkar 10x50 cm', artNr: '506.005.75' },
    { pic: '80433207.avif', name: 'Knivställ 20x50 cm', artNr: '804.332.07' },
    { pic: '00488326.avif', name: 'Redskapslåda 10x50 cm', artNr: '004.883.26' },
    { pic: '70459976.avif', name: 'Redskapslåda 20x50 cm', artNr: '704.599.76' },
    { pic: '40459973.avif', name: 'Besticklåda 32x50 cm', artNr: '404.599.73' },
    { pic: '70433104.avif', name: 'Besticklåda 52x50 cm', artNr: '704.331.04' },
    { pic: '99500904.avif', name: 'Bestickl. 52 cm (32+20)', artNr: '995.009.04' },
    { pic: '29501054.avif', name: 'Bestickl. 72 cm (52+20)', artNr: '295.010.54' },
    { pic: '69500910.avif', name: 'Bestickl. 72 cm (32+2x20)', artNr: '695.009.10' },
    { pic: '50460018.avif', name: 'Redskapslåda 20x50 cm', artNr: '504.600.18' },
    { pic: '10460020.avif', name: 'Redskapslåda 32x50 cm', artNr: '104.600.20' },
    { pic: '09500791.avif', name: 'Bestickl. 52 cm (32+20)', artNr: '095.007.91' },
    { pic: '29500907.avif', name: 'Bestickl. 72 cm (32+2x20)', artNr: '295.009.07' },
    { pic: '10460015.avif', name: 'Redskapslåda 20x31 cm', artNr: '104.600.15' },
    { pic: '70460017.avif', name: 'Besticklåda 32x31 cm', artNr: '704.600.17' },
    { pic: '60460008.avif', name: 'Hålplatta 60 cm', artNr: '604.600.08' },
    { pic: '00460011.avif', name: 'Hålplatta 80 cm', artNr: '004.600.11' },
    { pic: '20459988.avif', name: 'Avdelare 40 cm för låda', artNr: '204.599.88' },
    { pic: '40459992.avif', name: 'Avdelare 60 cm för låda', artNr: '404.599.92' },
    { pic: '90459999.avif', name: 'Avdelare 80 cm för låda', artNr: '904.599.99' },
    { pic: '70486178.avif', name: 'Tallriksställ 15-23 cm', artNr: '704.861.78' },
    { pic: '50486179.avif', name: 'Tallriksställ 19-31 cm', artNr: '504.861.79' },
    { pic: '50503466.avif', name: 'Durkslag, Lillhavet', artNr: '505.034.66' },
    { pic: '00339713.avif', name: 'Durkslag, Norrsjön', artNr: '003.397.13' },
    { pic: '40339711.avif', name: 'Skärbräda, Norrsjön', artNr: '403.397.11' },
    { pic: '70186090.avif', name: 'Mikrolock', artNr: '701.860.90' },
    { pic: '70154800.avif', name: 'Grytlockshållare', artNr: '701.548.00' },
    { pic: '90506104.avif', name: 'Snurrad', artNr: '905.061.04' },
    { pic: '00569426.avif', name: 'Snurrbricka', artNr: '005.694.26' }
  ]

  const imageSection = document.createElement('div');
  imageSection.className = 'pin-image-section';

  const imageH3 = document.createElement('h3');
  imageH3.textContent = 'Tilläggsartiklar';
  imageSection.appendChild(imageH3);

  const imageGrid = document.createElement('div');
  imageGrid.className = 'pin-image-grid';

  extraArtPics.forEach(article => {
    imageGrid.appendChild(createImagePinRow(article));
  });

  imageSection.appendChild(imageGrid);
  imageSection.appendChild(createBottomButtonRow());
  pinContainer.appendChild(imageSection);
  //pinContainer.appendChild(createExportBtn());

  document.body.appendChild(pinContainer);
}

// --- Exportfunktion ---
function exportSelectedArticles() {
  const rows = document.querySelectorAll('.pin-row, .pin-image-item');
  const lines = [];

  rows.forEach(row => {
    const input = row.querySelector('input[type="number"]');
    const artNr = row.dataset.artNr;

    if (!input || !artNr) return;

    const count = Number(input.value);
    if (count > 0) {
      lines.push(`${artNr},${count}`);
    }
  });

  if (!lines.length) {
    alert('Inga artiklar valda!');
    return;
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'ImportFil.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Hjälpfunktion som skapar en artikelrad
function createImagePinRow(article) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pin-image-item';
  wrapper.dataset.artNr = article.artNr;

  const title = document.createElement('div');
  title.className = 'pin-image-title';
  title.textContent = article.name;

  const row = document.createElement('div');
  row.className = 'pin-image-row';

  const img = document.createElement('img');
  img.src = `pics/articlar/${article.pic}`;
  img.alt = article.name;

  const amountWrap = document.createElement('div');
  amountWrap.className = 'amount-wrap';

  const minusBtn = document.createElement('button');
  minusBtn.type = 'button';
  minusBtn.textContent = '−';
  minusBtn.tabIndex = -1; // ❌ inte tabb-bar

  const plusBtn = document.createElement('button');
  plusBtn.type = 'button';
  plusBtn.textContent = '+';
  plusBtn.tabIndex = -1; // ❌ inte tabb-bar

  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.max = 99;
  input.value = 0;
  input.tabIndex = 0; // ✅ tabb-bar (egentligen default, men tydligt)

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

  row.appendChild(img);
  row.appendChild(amountWrap);

  wrapper.appendChild(title);
  wrapper.appendChild(row);

  return wrapper;
}

/* ===== Skapa exportknapp som wrapper ===== */
function createExportBtn() {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';

  const btn = document.createElement('button');
  btn.textContent = 'Hämta import fil';
  btn.addEventListener('click', exportSelectedArticles);

  wrapper.appendChild(btn);
  return wrapper;
}

function createResetBtn() {
  const btn = document.createElement('button');
  btn.textContent = 'Nollställ';
  btn.addEventListener('click', () => {
    if (!confirm('Vill du nollställa alla valda artiklar?')) return;
    resetAllPinInputs();
  });
  return btn;
}

function resetAllPinInputs() {
  // Nollställ alla inputs
  document.querySelectorAll('.pin-row input[type="number"], .pin-image-item input[type="number"]')
    .forEach(input => input.value = 0);

  // Nollställ lagrad data
  Object.keys(cPinAmounts).forEach(key => {
    cPinAmounts[key] = 0;
  });
}

function createBottomButtonRow() {
  const row = document.createElement('div');
  row.className = 'pin-button-row';

  const resetWrap = document.createElement('div');
  resetWrap.className = 'pin-btn-reset';
  resetWrap.appendChild(createResetBtn());

  const exportWrap = document.createElement('div');
  exportWrap.className = 'pin-btn-export';
  exportWrap.appendChild(createExportBtn());

  row.appendChild(resetWrap);
  row.appendChild(exportWrap);

  return row;
}


/* ==================================
   Lagring av antal per artikelnummer
   ================================== */

const cPinAmounts = {};

function updatePinAmount(artNr, amount) {
  cPinAmounts[artNr] = Number(amount);
  // redo för filgenerering senare
  // console.log(cPinAmounts);
}
