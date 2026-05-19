"use strict";

// CONFIGURACIÓN Y ESTADO INICIAL
const numFiles = 3;
const numColumnes = 3;
const midaCasella = 100;
const imatgePuzzle = "./img/image.png";

// Matriz del tablero (0 representa el hueco vacío)
let tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
let moviments = 0;

// Referencias a los elementos del DOM (Interfaz)
const refTauler = document.getElementById("tauler");
const refMoveCounter = document.getElementById("moveCounter");
const refMissatge = document.getElementById("missatge");
const refBtnReset = document.getElementById("resetBtn");

// CREACIÓN DEL TABLERO
function init() {
  // Vaciar el contenedor y limpiar textos 
  refTauler.innerHTML = "";
  refMissatge.textContent = "";
  refMoveCounter.textContent = moviments;

  // Configurar el tamaño del tablero según las dimensiones del juego
  refTauler.style.width = `${numColumnes * midaCasella}px`;
  refTauler.style.height = `${numFiles * midaCasella}px`;

  // Recorrer la matriz para crear y posicionar las fichas en el DOM
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      const valor = tauler[fila][columna];

      // Si el valor no es 0, creamos la pieza visual
      if (valor !== 0) {
        const refFitxa = document.createElement("div");
        refFitxa.classList.add("fitxa");
        refFitxa.dataset.valor = valor;

        // Estilo de la imagen de fondo y recorte (Sprite)
        refFitxa.style.backgroundImage = `url('${imatgePuzzle}')`;
        refFitxa.style.backgroundSize = `${numColumnes * midaCasella}px ${numFiles * midaCasella}px`;

        // Calcular qué trozo de la imagen le corresponde según su número original
        const originalCol = (valor - 1) % numColumnes;
        const originalFila = Math.floor((valor - 1) / numColumnes);
        refFitxa.style.backgroundPosition = `-${originalCol * midaCasella}px -${originalFila * midaCasella}px`;

        // Evento de clic y posicionamiento inicial
        refFitxa.addEventListener("click", clicFitxa);
        refFitxa.style.transform = `translate(${columna * midaCasella}px, ${fila * midaCasella}px)`;
        
        refTauler.appendChild(refFitxa);
      }
    }
  }
  
  // Asignar el evento al botón de reinicio una sola vez
  refBtnReset.removeEventListener("click", resetJoc); 
  refBtnReset.addEventListener("click", resetJoc);
}

// LÓGICA DE MOVIMIENTO
//Encontrar la posición del hueco vacío (0) 
function trobarBuit() {
  // Localiza las coordenadas { fila, columna } del hueco (0)
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === 0) {
        return { fila: f, columna: c };
      }
    }
  }
}

// Manejar el clic en una ficha para intentar moverla
function clicFitxa(e) {
  const valor = parseInt(e.currentTarget.dataset.valor);
  let posFitxa = { fila: -1, columna: -1 };

  // Encontrar la posición actual en la matriz de la ficha clicada
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === valor) {
        posFitxa.fila = f;
        posFitxa.columna = c;
      }
    }
  }

  // Obtener la posición actual del hueco vacio
  const buit = trobarBuit();

  // Validar si la ficha está al lado del hueco (Distancia Manhattan === 1)
  const esAdjacente = Math.abs(posFitxa.fila - buit.fila) + Math.abs(posFitxa.columna - buit.columna) === 1;

  if (esAdjacente) {
    // Intercambiar valores en la matriz de datos
    tauler[buit.fila][buit.columna] = valor;
    tauler[posFitxa.fila][posFitxa.columna] = 0;
    
    moviments++;
    
    // Renderizar los cambios en la pantalla
    actualitzarUI();

    // Comprobar si el jugador ha ganado
    if (estaResol()) {
      refMissatge.textContent = `¡Resuelto en ${moviments} movimientos!`;
    }
  }
}

// ACTUALIZACIÓN VISUAL Y VICTORIA
function actualitzarUI() {
  const refFitxes = refTauler.querySelectorAll(".fitxa");

  // Mover cada elemento HTML a su nueva posición física leyendo la matriz
  refFitxes.forEach(refFitxa => {
    const valor = parseInt(refFitxa.dataset.valor);
    
    for (let f = 0; f < numFiles; f++) {
      for (let c = 0; c < numColumnes; c++) {
        if (tauler[f][c] === valor) {
          refFitxa.style.transform = `translate(${c * midaCasella}px, ${f * midaCasella}px)`;
        }
      }
    }
  });

  // Actualizar el contador del DOM
  refMoveCounter.textContent = moviments;
}

function estaResol() {
  const estatGuanyador = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  return JSON.stringify(tauler) === JSON.stringify(estatGuanyador);
}

// MEZCLA Y REINICIO
function barrejarTauler(passos = 80) {
  for (let i = 0; i < passos; i++) {
    const buit = trobarBuit();
    const movimentsPossibles = [];
    const direccions = [{f:-1, c:0}, {f:1, c:0}, {f:0, c:-1}, {f:0, c:1}];

    // Buscar qué casillas válidas rodean al hueco
    direccions.forEach(d => {
      let novaFila = buit.fila + d.f;
      let novaColumna = buit.columna + d.c;
      
      if (novaFila >= 0 && novaFila < numFiles && novaColumna >= 0 && novaColumna < numColumnes) {
        movimentsPossibles.push({ fila: novaFila, columna: novaColumna });
      }
    });

    // Elegir un movimiento aleatorio de entre los posibles e intercambiarlo por el hueco
    const ternaAleatoria = movimentsPossibles[Math.floor(Math.random() * movimentsPossibles.length)];
    
    [tauler[buit.fila][buit.columna], tauler[ternaAleatoria.fila][ternaAleatoria.columna]] = 
    [tauler[ternaAleatoria.fila][ternaAleatoria.columna], tauler[buit.fila][buit.columna]];
  }
}

//REINICIAR EL JUEGO
function resetJoc() {
  // Restaurar el tablero ordenado antes de mezclar
  tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  barrejarTauler(80);
  moviments = 0;
  init();
}

// ARRANQUE DEL JUEGO
resetJoc();