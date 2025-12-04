
/ LUTIN – Bingo enfants
(function() {
  // https://tmr2002.github.io/LUTIN-BINGO/
  const APP_URL = 'https://lutin-bingo.example.com';

  // Affichage du QR code via un service d'image public
  // Astuce : fonctionne sans librairie et affiche un QR correct quand la page est en ligne
  function renderQR() {
    const qrContainer = document.getElementById('qrImageContainer');
    const linkEl = document.getElementById('appLink');
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(APP_URL);
    const img = new Image();
    img.width = 220; img.height = 220; img.alt = 'Code QR vers LUTIN';
    img.src = qrUrl;
    qrContainer.innerHTML = '';
    qrContainer.appendChild(img);
    linkEl.textContent = APP_URL;
    linkEl.href = APP_URL;
  }

  // État du jeu
  let variant = 75; // 75 ou 90
  let remaining = [];
  let drawn = [];

  const labelsEl = document.getElementById('labels');
  const gridEl = document.getElementById('numberGrid');
  const ballEl = document.getElementById('currentBall');
  const historyEl = document.getElementById('historyList');

  function buildLabels() {
    labelsEl.innerHTML = '';
    if (variant === 75) {
      ['B','I','N','G','O'].forEach(l => {
        const d = document.createElement('div'); d.className = 'label'; d.textContent = l; labelsEl.appendChild(d);
      });
    } else {
      ['L','U','T','I','N'].forEach(l => {
        const d = document.createElement('div'); d.className = 'label'; d.textContent = l; labelsEl.appendChild(d);
      });
    }
  }

  function buildGrid() {
    gridEl.innerHTML = '';
    const max = variant;
    // 5 colonnes pour garder des boutons bien gros
    for (let n = 1; n <= max; n++) {
      const btn = document.createElement('button');
      btn.className = 'number-btn';
      btn.textContent = n;
      btn.setAttribute('role','gridcell');
      btn.setAttribute('aria-label','Numéro ' + n);
      btn.dataset.num = n;
      btn.addEventListener('click', () => toggleMark(n));
      gridEl.appendChild(btn);
    }
  }

  function resetGame() {
    remaining = Array.from({length: variant}, (_, i) => i + 1);
    drawn = [];
    ballEl.textContent = '—';
    historyEl.innerHTML = '';
    document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('called'));
    document.getElementById('drawBtn').disabled = false;
  }

  function toggleMark(n) {
    const btn = gridEl.querySelector('[data-num="' + n + '"]');
    if (btn) btn.classList.toggle('called');
  }

  function drawBall() {
    if (remaining.length === 0) {
      ballEl.textContent = '🎉';
      document.getElementById('drawBtn').disabled = true;
      return;
    }
    const idx = Math.floor(Math.random() * remaining.length);
    const val = remaining.splice(idx, 1)[0];
    drawn.push(val);
    showCurrent(val);
    markCalled(val);
    addHistory(val);
  }

  function showCurrent(n) {
    ballEl.textContent = n;
    ballEl.style.animation = 'none';
    void ballEl.offsetWidth; // reflow pour rejouer l'animation
    ballEl.style.animation = 'appear .35s ease-out';
  }

  function markCalled(n) {
    const btn = gridEl.querySelector('[data-num="' + n + '"]');
    if (btn) btn.classList.add('called');
  }

  function addHistory(n) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = n;
    historyEl.appendChild(chip);
  }

  function undo() {
    if (drawn.length === 0) return;
    const last = drawn.pop();
    remaining.push(last);
    const btn = gridEl.querySelector('[data-num="' + last + '"]');
    if (btn) btn.classList.remove('called');
    if (historyEl.lastChild) historyEl.removeChild(historyEl.lastChild);
    ballEl.textContent = drawn.length ? drawn[drawn.length - 1] : '—';
    document.getElementById('drawBtn').disabled = false;
  }

  // Liaison des contrôles
  document.getElementById('variant').addEventListener('change', (e) => {
    variant = parseInt(e.target.value, 10);
    buildLabels();
    buildGrid();
    resetGame();
  });
  document.getElementById('newGameBtn').addEventListener('click', () => { resetGame(); });
  document.getElementById('drawBtn').addEventListener('click', () => { drawBall(); });
  document.getElementById('undoBtn').addEventListener('click', () => { undo(); });
  document.getElementById('resetBtn').addEventListener('click', () => { resetGame(); });

  // Initialisation
  renderQR();
  buildLabels();
  buildGrid();
  resetGame();
})();
