"use strict";

// CONFIGURACIÓN Y ESTADO INICIAL 
const numFiles = 3;
const numColumnes = 3;
const midaCasella = 100;
const imatgePuzzle = "./img/image.png"; 

let tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]; // 0 es el hueco
let moviments = 0;

const taulerDiv = document.getElementById("tauler");
const moveCounterSpan = document.getElementById("moveCounter");
const missatgeP = document.getElementById("missatge");
const resetBtn = document.getElementById("resetBtn");

// RENDERIZADO: CREACIÓN DEL TABLERO 
function init() {
  taulerDiv.innerHTML = ""; 
  missatgeP.textContent = ""; 
  moveCounterSpan.textContent = moviments;

  taulerDiv.style.width = `${numColumnes * midaCasella}px`;
  taulerDiv.style.height = `${numFiles * midaCasella}px`;

  for (let fila = 0; fila < numFiles; fila++) {
    for (let col = 0; col < numColumnes; col++) {
      const valor = tauler[fila][col];

      if (valor !== 0) { // Si no es el hueco, creamos la pieza
        const fitxa = document.createElement("div");
        fitxa.classList.add("fitxa");
        fitxa.dataset.valor = valor;

        // Estilo de la imagen y recorte (Sprite)
        fitxa.style.backgroundImage = `url('${imatgePuzzle}')`;
        fitxa.style.backgroundSize = `300px 300px`;

        // Cálculo del recorte según la posición original del número
        const originalCol = (valor - 1) % numColumnes;
        const originalFila = Math.floor((valor - 1) / numColumnes);
        fitxa.style.backgroundPosition = `-${originalCol * midaCasella}px -${originalFila * midaCasella}px`;

        fitxa.addEventListener("click", clicFitxa);
        fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;
        taulerDiv.appendChild(fitxa);
      }
    }
  }
}

//LÓGICA DE MOVIMIENTO
function trobarBuit() { // Localiza la posición del 0
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === 0) return { fila: f, col: c };
    }
  }
}

function clicFitxa(e) {
  const valor = parseInt(e.currentTarget.dataset.valor);
  let fila, col;

  // Encontrar posición actual de la ficha clicada
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === valor) { fila = f; col = c; }
    }
  }

  const buit = trobarBuit();
  // Validar si es adyacente (Distancia Manhattan === 1)
  if (Math.abs(fila - buit.fila) + Math.abs(col - buit.col) === 1) {
    tauler[buit.fila][buit.col] = valor; // Mover ficha al hueco
    tauler[fila][col] = 0;               // El lugar de la ficha queda vacío
    moviments++;
    actualitzarUI();
    if (estaResol()) missatgeP.textContent = `Resolt en ${moviments} moviments!`;
  }
}

// ACTUALIZACIÓN VISUAL Y VICTORIA
function actualitzarUI() {
  const fitxes = taulerDiv.querySelectorAll(".fitxa");
  fitxes.forEach(fitxa => {
    const valor = parseInt(fitxa.dataset.valor);
    for (let f = 0; f < numFiles; f++) {
      for (let c = 0; c < numColumnes; c++) {
        if (tauler[f][c] === valor) {
          fitxa.style.transform = `translate(${c * midaCasella}px, ${f * midaCasella}px)`;
        }
      }
    }
  });
  moveCounterSpan.textContent = moviments;
}

function estaResol() {
  const ok = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  return JSON.stringify(tauler) === JSON.stringify(ok);
}

// MEZCLA Y REINICIO
function barrejarTauler(passos = 80) {
  for (let i = 0; i < passos; i++) {
    const buit = trobarBuit();
    const movs = [];
    const dirs = [{f:-1, c:0}, {f:1, c:0}, {f:0, c:-1}, {f:0, c:1}];

    dirs.forEach(d => {
      let nf = buit.fila + d.f, nc = buit.col + d.c;
      if (nf>=0 && nf<numFiles && nc>=0 && nc<numColumnes) movs.push({f:nf, c:nc});
    });

    const m = movs[Math.floor(Math.random() * movs.length)];
    [tauler[buit.fila][buit.col], tauler[m.f][m.c]] = [tauler[m.f][m.c], tauler[buit.fila][buit.col]];
  }
}

function resetJoc() {
  tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  barrejarTauler(80);
  moviments = 0;
  init();
}

// EVENTOS Y ARRANQUE 
resetBtn.addEventListener("click", resetJoc);
init();
resetJoc();