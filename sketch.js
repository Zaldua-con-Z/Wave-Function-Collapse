const celdas = []; // 30*30
let RETICULAX = document.getElementById("cellSize").value;
let RETICULAY;

let ancho; //anchura de las celdas
let alto; //altura de las celdas
const startButton = document.getElementById("start");

const azulejos = [];
const NA = 32; //número de azulejos

let opcionesI = [];

const reglas = [
  { UP: 14, RIGHT: 5, DOWN: 6, LEFT: 14 }, // 0
  { UP: 14, RIGHT: 5, DOWN: 2, LEFT: 5 }, // 1
  { UP: 14, RIGHT: 14, DOWN: 4, LEFT: 5 }, // 2
  { UP: 14, RIGHT: 5, DOWN: 2, LEFT: 5 }, // 3
  { UP: 14, RIGHT: 5, DOWN: 2, LEFT: 5 }, // 4
  { UP: 6, RIGHT: 3, DOWN: 0, LEFT: 14 }, // 5
  { UP: 2, RIGHT: 1, DOWN: 0, LEFT: 3 }, // 6
  { UP: 4, RIGHT: 14, DOWN: 0, LEFT: 1 }, // 7
  { UP: 14, RIGHT: 5, DOWN: 2, LEFT: 5 }, // 8
  { UP: 14, RIGHT: 14, DOWN: 7, LEFT: 14 }, // 9
  { UP: 9, RIGHT: 8, DOWN: 2, LEFT: 5 }, // 10
  { UP: 9, RIGHT: 10, DOWN: 9, LEFT: 14 }, // 11
  { UP: 12, RIGHT: 14, DOWN: 12, LEFT: 10 }, // 12
  { UP: 14, RIGHT: 14, DOWN: 7, LEFT: 14 }, // 13
  { UP: 7, RIGHT: 14, DOWN: 7, LEFT: 14 }, // 14
  { UP: 12, RIGHT: 5, DOWN: 2, LEFT: 8 }, // 15
  { UP: 9, RIGHT: 8, DOWN: 6, LEFT: 14 }, // 16
  { UP: 12, RIGHT: 14, DOWN: 4, LEFT: 8 }, // 17
  { UP: 14, RIGHT: 14, DOWN: 7, LEFT: 14 }, // 18
  { UP: 7, RIGHT: 5, DOWN: 2, LEFT: 5 }, // 19
  { UP: 14, RIGHT: 11, DOWN: 9, LEFT: 14 }, // 20
  { UP: 14, RIGHT: 13, DOWN: 14, LEFT: 14 }, // 21
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 14 }, // 22
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 14 }, // 23
  { UP: 14, RIGHT: 14, DOWN: 12, LEFT: 11 }, // 24
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 13 }, // 25
  { UP: 14, RIGHT: 13, DOWN: 14, LEFT: 14 }, // 26
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 14 }, // 27
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 13 }, // 28
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 13 }, // 29
  { UP: 14, RIGHT: 13, DOWN: 14, LEFT: 14 }, // 30
  { UP: 14, RIGHT: 14, DOWN: 14, LEFT: 14 }, // 31

 
];

function preload() {
  for (let i = 0; i < NA; i++) {
    azulejos[i] = loadImage(`azulejos/tile${i}.jpg`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }

  for (let i = 0; i < RETICULAX * RETICULAY; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
  startButton.addEventListener("click", resetAll);
}

function draw() {
  const celdasDisponibles = celdas.filter((celda) => {
    return celda.colapsada == false;
  });
  if (celdasDisponibles.length > 0) {
    celdasDisponibles.sort((a, b) => {
      return a.opciones.length - b.opciones.length;
    });

    const celdasPorColapsar = celdasDisponibles.filter((celda) => {
      return celda.opciones.length == celdasDisponibles[0].opciones.length;
    });

    const celdaSeleccionada = random(celdasPorColapsar);
    celdaSeleccionada.colapsada = true;

    const opcionSeleccionada = random(celdaSeleccionada.opciones);
    celdaSeleccionada.opciones = [opcionSeleccionada];

    // print(celdaSeleccionada);

    for (let x = 0; x < RETICULAX; x++) {
      for (let y = 0; y < RETICULAY; y++) {
        const celdaIndex = x + y * RETICULAX;
        const celdaActual = celdas[celdaIndex];
        if (celdaActual.colapsada) {
          const indiceDeAzulejo = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceDeAzulejo];

          image(azulejos[indiceDeAzulejo], x * ancho, y * alto, ancho, alto);

          //Monitorear UP
          if (y > 0) {
            const indiceUP = x + (y - 1) * RETICULAX;
            const celdaUP = celdas[indiceUP];
            if (!celdaUP.colapsada) {
              cambiarEntropia(celdaUP, reglasActuales["UP"], "DOWN");
            }
          }

          //Monitorear RIGHT
          if (x < RETICULAX - 1) {
            const indiceRIGHT = x + 1 + y * RETICULAX;
            const celdaRIGHT = celdas[indiceRIGHT];
            if (!celdaRIGHT.colapsada) {
              cambiarEntropia(celdaRIGHT, reglasActuales["RIGHT"], "LEFT");
            }
          }
          //Monitorear DOWN
          if (y < RETICULAY - 1) {
            const indiceDOWN = x + (y + 1) * RETICULAX;
            const celdaDOWN = celdas[indiceDOWN];
            if (!celdaDOWN.colapsada) {
              cambiarEntropia(celdaDOWN, reglasActuales["DOWN"], "UP");
            }
          }
          //Monitorear LEFT
          if (x > 0) {
            const indiceLEFT = x - 1 + y * RETICULAX;
            const celdaLEFT = celdas[indiceLEFT];
            if (!celdaLEFT.colapsada) {
              cambiarEntropia(celdaLEFT, reglasActuales["LEFT"], "RIGHT");
            }
          }
        } else {
          // strokeWeight(6);
          // rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }
    // noLoop();
  } else {
  }
}

function cambiarEntropia(_celda, _regla, _opuesta) {
  const nuevasOpciones = [];
  for (let i = 0; i < _celda.opciones.length; i++) {
    if (_regla == reglas[_celda.opciones[i]][_opuesta]) {
      const celdaCompatible = _celda.opciones[i];
      nuevasOpciones.push(celdaCompatible);
    }
  }
  _celda.opciones = nuevasOpciones;
}

function resetAll() {
  RETICULAX = document.getElementById("cellSize").value;

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  background(255, 255, 255);

  for (let i = 0; i < RETICULAX * RETICULAX; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
}


