const numFiles = 3;
const numColumnes = 3;
const midaCasella = 100;

let tauler = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

let moviments = 0;

const taulerDiv = document.getElementById("tauler");
const moveCounterSpan = document.getElementById("moveCounter");
const missatgeP = document.getElementById("missatge");
const resetBtn = document.getElementById("resetBtn");

function init() {
  taulerDiv.innerHTML = "";
  missatgeP.textContent = "";
  moveCounterSpan.textContent = moviments;

  for (let fila = 0; fila < numFiles; fila++) {
    for (let col = 0; col < numColumnes; col++) {
      const valor = tauler[fila][col];

      if (valor !== 0) {
        const fitxa = document.createElement("div");
        fitxa.classList.add("fitxa");
        fitxa.dataset.valor = valor;
        fitxa.style.backgroundImage = `url("img/${valor}.png")`;

        fitxa.addEventListener("click", clicFitxa);

        fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;

        taulerDiv.appendChild(fitxa);
      }
    }
  }
}

function trobarBuit() {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === 0) return { fila: f, col: c };
    }
  }
}

function clicFitxa(e) {
  const valor = parseInt(e.currentTarget.dataset.valor);

  let fila = -1, col = -1;

  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === valor) {
        fila = f;
        col = c;
      }
    }
  }

  const posBuit = trobarBuit();
  const df = fila - posBuit.fila;
  const dc = col - posBuit.col;

  if (Math.abs(df) + Math.abs(dc) === 1) {
    tauler[posBuit.fila][posBuit.col] = valor;
    tauler[fila][col] = 0;

    moviments++;
    moveCounterSpan.textContent = moviments;

    actualitzarUI();

    if (estaResol()) {
      missatgeP.textContent = `Puzle resolt en ${moviments} moviments.`;
    }
  }
}

function actualitzarUI() {
  const fitxes = taulerDiv.querySelectorAll(".fitxa");

  fitxes.forEach(fitxa => {
    const valor = parseInt(fitxa.dataset.valor);

    for (let fila = 0; fila < numFiles; fila++) {
      for (let col = 0; col < numColumnes; col++) {
        if (tauler[fila][col] === valor) {
          fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;
        }
      }
    }
  });
}

function estaResol() {
  const resolt = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];

  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] !== resolt[f][c]) return false;
    }
  }
  return true;
}

function barrejarTauler(passos = 50) {
  for (let i = 0; i < passos; i++) {
    const posBuit = trobarBuit();
    const movs = [];

    const dirs = [
      { df: -1, dc: 0 },
      { df: 1, dc: 0 },
      { df: 0, dc: -1 },
      { df: 0, dc: 1 }
    ];

    dirs.forEach(d => {
      const nf = posBuit.fila + d.df;
      const nc = posBuit.col + d.dc;
      if (nf >= 0 && nf < numFiles && nc >= 0 && nc < numColumnes) {
        movs.push({ fila: nf, col: nc });
      }
    });

    const aleatori = movs[Math.floor(Math.random() * movs.length)];

    const temp = tauler[aleatori.fila][aleatori.col];
    tauler[aleatori.fila][aleatori.col] = 0;
    tauler[posBuit.fila][posBuit.col] = temp;
  }
}

function resetJoc() {
  tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  barrejarTauler(80);
  moviments = 0;
  init();
}

resetBtn.addEventListener("click", resetJoc);

init();
resetJoc();
