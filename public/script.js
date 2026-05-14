"use strict";

// CONSTANTES
const numFiles = 3;
const numColumnes = 3;
const midaCasella = 100;

// Ruta de la imagen
const imatgePuzzle = "img/image.png"; 

//-- ESTADO DEL TABLERO --
let tauler = [
  [1, 2, 3],[4, 5, 6],[7, 8, 0]
];

let moviments = 0;

// -- REFERENCIAS AL DOM --
const taulerDiv = document.getElementById("tauler");
const moveCounterSpan = document.getElementById("moveCounter");
const missatgeP = document.getElementById("missatge");
const resetBtn = document.getElementById("resetBtn");

// tablero en pantalla
function init() {
  // rreinicia el tablero en el html y el mensaje, y el contador de movimientos
  taulerDiv.innerHTML = ""; 
  missatgeP.textContent = ""; 
  moveCounterSpan.textContent = moviments;

  // ajusta el tamaño del tablero según el número de filas y columnas
  taulerDiv.style.width = `${numColumnes * midaCasella}px`;
  taulerDiv.style.height = `${numFiles * midaCasella}px`;

  // recorre tauler y crea las fichas correspondientes, asignándoles la imagen de fondo recortada  
  for (let fila = 0; fila < numFiles; fila++) {
    for (let col = 0; col < numColumnes; col++) {
      const valor = tauler[fila][col];

      // si el valor es 0 se crea espacio vacio
      if (valor !== 0) {
        const fitxa = document.createElement("div");
        fitxa.classList.add("fitxa");
        fitxa.dataset.valor = valor;

        // RECORTE DE IMAGEN PARA CADA FICHA:

        // se pone la imagen completa a cada ficha
        fitxa.style.backgroundSize = `${numColumnes * midaCasella}px ${numFiles * midaCasella}px`;

        // calcula dónde estaba originalmente esa pieza en la imagen completa.
        const originalCol = (valor - 1) % numColumnes;
        const originalFila = Math.floor((valor - 1) / numColumnes);
        
        const posX = originalCol * midaCasella;
        const posY = originalFila * midaCasella;

        // muestra solo un trozo de la imagen por cada ficba
        fitxa.style.backgroundPosition = `-${posX}px -${posY}px`;

        fitxa.addEventListener("click", clicFitxa);
        
        // posicion en la pantalla
        fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;

        // añada la ficha al tablero 
        taulerDiv.appendChild(fitxa);
      }
    }
  }
}

// busca la posición del espacio vacío (valor 0) en el tablero y devuelve su fila y columna
function trobarBuit() {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === 0) {
        return { fila: f, col: c };
      }
    }
  }
}

// maneja el evento de clic en una ficha
function clicFitxa(e) {
  //e.currentTarget.dataset.valor da el valor de la ficha clicada, que es un número del 1 al 8.
  const valor = parseInt(e.currentTarget.dataset.valor);
  let fila, col;

  // recorre el tablero en busca de la ficah clicada
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

  // comprubea si la ficha clicada está adyacente al espacio vacío (es decir, si se puede mover). 

  // si si se intercambia la ficha con el espacio vacío en el tablero y actualiza la interfaz.
  // despues verfica si el puzle está resuelto, y si lo está muestra un mensaje con el número de movimientos
  if (Math.abs(df) + Math.abs(dc) === 1) {
    tauler[posBuit.fila][posBuit.col] = valor;
    tauler[fila][col] = 0;

    // sumar contador
    moviments++;
    moveCounterSpan.textContent = moviments;

    actualitzarUI();

    // comprueba si el puzle está resuelto y si lo está muestra un mensaje con el número de movimientos
    if (estaResol()) {
      missatgeP.textContent = `Puzle resolt en ${moviments} moviments.`;
    }
  }
}

function actualitzarUI() {
  // busca los elementos "fitxa" del tablero
  const fitxes = taulerDiv.querySelectorAll(".fitxa");

  // recorre cada ficha y actualiza su posicion en pantalla
  fitxes.forEach(fitxa => {
    const valor = parseInt(fitxa.dataset.valor);
    // busca la posición actual de esa ficha en el tablero
    for (let fila = 0; fila < numFiles; fila++) {
      for (let col = 0; col < numColumnes; col++) {
        // si encuentra la ficha en el tablero, actualiza su posición 
        if (tauler[fila][col] === valor) {
          fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;
        }
      }
    }
  });
}

function estaResol() {
  //estado resuelto
  const resolt = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

  // compara el estado actual del tablero con el estado resuelto
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      //Si encuentra una casilla incorrecta → NO está resuelto
      if (tauler[f][c] !== resolt[f][c]) {
        return false;
      }
    }
  }
  return true;
}

function barrejarTauler(passos = 80) {
  // para mezclar el tablero, se hace una serie de movimientos aleatorios a partir del estado resuelto
  for (let i = 0; i < passos; i++) {
    //Encontrar dónde está el hueco
    const posBuit = trobarBuit();
    // lista de posibles movimientos 
    const movs = [];
    const dirs = [{ df: -1, dc: 0 }, { df: 1, dc: 0 }, { df: 0, dc: -1 }, { df: 0, dc: 1 }];

    //Calcula las posiciones vecinas del hueco
    // Comprueba que están dentro del tablero
    // Las añade a movs
    dirs.forEach(d => {
      const nf = posBuit.fila + d.df;
      const nc = posBuit.col + d.dc;
      if (nf >= 0 && nf < numFiles && nc >= 0 && nc < numColumnes) {
        movs.push({ fila: nf, col: nc });
      }
    });

    // elige un movimiento aleatorio de la lista de movimientos posibles
    const aleatori = movs[Math.floor(Math.random() * movs.length)];

    //Intercambiar la ficha elegida con el hueco
    const temp = tauler[aleatori.fila][aleatori.col];
    tauler[aleatori.fila][aleatori.col] = 0;
    tauler[posBuit.fila][posBuit.col] = temp;
  }
}

// REINICO JUEGO
function resetJoc() {
  tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  barrejarTauler(80);
  moviments = 0;
  init();
}

resetBtn.addEventListener("click", resetJoc);

// Arrancada inicial
init();
resetJoc();