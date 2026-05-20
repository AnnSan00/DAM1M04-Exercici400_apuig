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
        let columnaTemporal = valor - 1;
        let filaTemporal = 0;
        
        // Ajustar la columna y fila temporal para encontrar la posición correcta en el sprite
        while (columnaTemporal >= numColumnes) {
          columnaTemporal = columnaTemporal - numColumnes;
          filaTemporal = filaTemporal + 1;
        }

        const originalCol = columnaTemporal;
        const originalFila = filaTemporal;
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
// Encontrar la posición del hueco vacío (0) 
function trobarBuit() {
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      if (tauler[f][c] === 0) {
        // Devolvemos un objeto con la fila y columna del hueco
        return { fila: f, columna: c };
      }
    }
  }
}
//MANEJO DE CLICS EN LAS FICHAS
// Manejar el clic en una ficha para intentar moverla
function clicFitxa(e) {
  const valorHTML = e.currentTarget.dataset.valor;
  let posFitxa = { fila: -1, columna: -1 };

  // Encontrar la posición actual en la matriz de la ficha clicada
  for (let f = 0; f < numFiles; f++) {
    for (let c = 0; c < numColumnes; c++) {
      // Usamos == para comparar el texto del HTML con el número de la matriz sin romper el código
      if (tauler[f][c] == valorHTML) {
        posFitxa.fila = f;
        posFitxa.columna = c;
      }
    }
  }

  // Obtener la posición actual del hueco vacio
  const buit = trobarBuit();

  // Validar si la ficha está al lado del hueco
  let difFila = posFitxa.fila - buit.fila;
  let difColumna = posFitxa.columna - buit.columna;
 
  if (difFila < 0) {
    difFila = -difFila;}
  if (difColumna < 0) {
    difColumna = -difColumna;}
    // La ficha es adyacente al hueco si la suma de las diferencias absolutas es 1
  const esAdjacente = (difFila + difColumna) === 1;

  if (esAdjacente) {
    // Intercambiar valores en la matriz de datos
    tauler[buit.fila][buit.columna] = tauler[posFitxa.fila][posFitxa.columna];
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
    const valorHTML = refFitxa.dataset.valor;
    
    for (let f = 0; f < numFiles; f++) {
      for (let c = 0; c < numColumnes; c++) {
        // Usamos == para comprobar correspondencia directa de caracteres
        if (tauler[f][c] == valorHTML) {
          refFitxa.style.transform = `translate(${c * midaCasella}px, ${f * midaCasella}px)`;
        }
      }
    }
  });

  // Actualizar el contador del DOM
  refMoveCounter.textContent = moviments;
}
//ESTADO DE VICTORIA
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

    // Elegir un movimiento aleatorio de entre los posibles de manera manual
    let aleatori = Math.random() * movimentsPossibles.length;
    let indiceAleatorio = 0;

    // Restamos de uno en uno para simular el recorte de decimales de forma manual
    while (aleatori >= 1) {
      aleatori = aleatori - 1;
      indiceAleatorio = indiceAleatorio + 1;
    }

    const ternaAleatoria = movimentsPossibles[indiceAleatorio];
    
    let temporal = tauler[buit.fila][buit.columna];
    tauler[buit.fila][buit.columna] = tauler[ternaAleatoria.fila][ternaAleatoria.columna];
    tauler[ternaAleatoria.fila][ternaAleatoria.columna] = temporal;
  }
}

// REINICIAR EL JUEGO
function resetJoc() {
  // Restaurar el tablero ordenado antes de mezclar
  tauler = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
  barrejarTauler(80);
  moviments = 0;
  init();
}

// ARRANQUE DEL JUEGO
resetJoc();