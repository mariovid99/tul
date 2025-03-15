// Variables globales
const grecia = document.getElementById("grecia");
const enemigos = document.querySelectorAll(".enemigo");
const monedas = document.querySelectorAll(".moneda");
const mensaje = document.getElementById("mensaje");

let greciaX = 50;
let greciaY = 50;
let monedasRecolectadas = 0;
let juegoActivo = true; // Controlar si el juego está activo o no

// Posiciones iniciales de los enemigos
let enemigo1X = 200;
let enemigo1Y = 100;
let enemigo2X = 400;
let enemigo2Y = 200;
let enemigo3X = 300;
let enemigo3Y = 300;

// Velocidad de los enemigos
let velocidadEnemigo1X = 2;
let velocidadEnemigo1Y = 2;
let velocidadEnemigo2X = -2;
let velocidadEnemigo2Y = 2;
let velocidadEnemigo3X = 2;
let velocidadEnemigo3Y = -2;

// Variables para el arrastre
let isDragging = false;
let offsetX, offsetY;

// Función para generar una posición aleatoria dentro del mapa
function generarPosicionAleatoria() {
  const maxX = 307; // 600 (ancho del contenedor) - 40 (tamaño de la moneda)
  const maxY = 320; // 400 (alto del contenedor) - 40 (tamaño de la moneda)
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
}

// Posicionar monedas aleatoriamente al inicio
function posicionarMonedas() {
    const posiciones = []; // Almacenar las posiciones generadas
  
    monedas.forEach((moneda) => {
      let posicion;
      let colisiona;
      const tamañoMoneda = 80; // Tamaño de las monedas
  
      // Generar una posición que no colisione con otras monedas
      do {
        colisiona = false;
        posicion = generarPosicionAleatoria();
  
        // Verificar si la nueva posición colisiona con alguna posición existente
        for (const p of posiciones) {
          const distanciaX = Math.abs(p.x - posicion.x);
          const distanciaY = Math.abs(p.y - posicion.y);
          if (distanciaX < tamañoMoneda && distanciaY < tamañoMoneda) {
            colisiona = true;
            break;
          }
        }
      } while (colisiona); // Repetir hasta encontrar una posición válida
  
      // Asignar la posición a la moneda
      moneda.style.left = `${posicion.x}px`;
      moneda.style.top = `${posicion.y}px`;
      moneda.classList.remove("recolectada");
      moneda.style.display = "block";
  
      // Guardar la posición generada
      posiciones.push(posicion);
    });
  }

// Reiniciar posiciones de los enemigos
function reiniciarEnemigos() {
  enemigo1X = 200;
  enemigo1Y = 100;
  enemigo2X = 250;
  enemigo2Y = 200;
  enemigo3X = 300;
  enemigo3Y = 300;

  document.getElementById("enemigo1").style.left = `${enemigo1X}px`;
  document.getElementById("enemigo1").style.top = `${enemigo1Y}px`;
  document.getElementById("enemigo2").style.left = `${enemigo2X}px`;
  document.getElementById("enemigo2").style.top = `${enemigo2Y}px`;
  document.getElementById("enemigo3").style.left = `${enemigo3X}px`;
  document.getElementById("enemigo3").style.top = `${enemigo3Y}px`;
}

// Eventos táctiles para arrastrar a Grecia
grecia.addEventListener("touchstart", (e) => {
  if (!juegoActivo) return; // No mover si el juego no está activo
  e.preventDefault();
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - greciaX;
  offsetY = touch.clientY - greciaY;
});

grecia.addEventListener("touchmove", (e) => {
  if (!juegoActivo) return; // No mover si el juego no está activo
  if (isDragging) {
    const touch = e.touches[0];
    greciaX = touch.clientX - offsetX;
    greciaY = touch.clientY - offsetY;

    // Limitar el movimiento dentro del contenedor del juego
    greciaX = Math.max(0, Math.min(greciaX, 560)); // 600 (ancho) - 40 (tamaño de Grecia)
    greciaY = Math.max(0, Math.min(greciaY, 360)); // 400 (alto) - 40 (tamaño de Grecia)

    grecia.style.left = `${greciaX}px`;
    grecia.style.top = `${greciaY}px`;
    verificarColisiones();
  }
});

grecia.addEventListener("touchend", () => {
  isDragging = false;
});

// Mover enemigos
function moverEnemigos() {
  if (!juegoActivo) return; // No mover enemigos si el juego no está activo

  // Enemigo 1
  enemigo1X += velocidadEnemigo1X;
  enemigo1Y += velocidadEnemigo1Y;
  if (enemigo1X <= 0 || enemigo1X >= 300) velocidadEnemigo1X *= -1;
  if (enemigo1Y <= 0 || enemigo1Y >= 320) velocidadEnemigo1Y *= -1;
  document.getElementById("enemigo1").style.left = `${enemigo1X}px`;
  document.getElementById("enemigo1").style.top = `${enemigo1Y}px`;

  // Enemigo 2
  enemigo2X += velocidadEnemigo2X;
  enemigo2Y += velocidadEnemigo2Y;
  if (enemigo2X <= 0 || enemigo2X >= 300) velocidadEnemigo2X *= -1;
  if (enemigo2Y <= 0 || enemigo2Y >= 320) velocidadEnemigo2Y *= -1;
  document.getElementById("enemigo2").style.left = `${enemigo2X}px`;
  document.getElementById("enemigo2").style.top = `${enemigo2Y}px`;

  // Enemigo 3
  enemigo3X += velocidadEnemigo3X;
  enemigo3Y += velocidadEnemigo3Y;
  if (enemigo3X <= 0 || enemigo3X >= 300) velocidadEnemigo3X *= -1;
  if (enemigo3Y <= 0 || enemigo3Y >= 320) velocidadEnemigo3Y *= -1;
  document.getElementById("enemigo3").style.left = `${enemigo3X}px`;
  document.getElementById("enemigo3").style.top = `${enemigo3Y}px`;

  verificarColisiones();
  if (juegoActivo) {
    requestAnimationFrame(moverEnemigos);
  }
}

// Verificar colisiones con enemigos y monedas
function verificarColisiones() {
  if (!juegoActivo) return; // No verificar colisiones si el juego no está activo

  // Colisión con enemigos
  enemigos.forEach((enemigo) => {
    const rectEnemigo = enemigo.getBoundingClientRect();
    const rectGrecia = grecia.getBoundingClientRect();
    if (
      rectGrecia.left < rectEnemigo.right &&
      rectGrecia.right > rectEnemigo.left &&
      rectGrecia.top < rectEnemigo.bottom &&
      rectGrecia.bottom > rectEnemigo.top
    ) {
      mostrarMensaje("¡Perdiste! Toca la pantalla para jugar de nuevo.");
      juegoActivo = false;
    }
  });

  // Colisión con monedas
  monedas.forEach((moneda) => {
    const rectMoneda = moneda.getBoundingClientRect();
    const rectGrecia = grecia.getBoundingClientRect();
    if (
      rectGrecia.left < rectMoneda.right &&
      rectGrecia.right > rectMoneda.left &&
      rectGrecia.top < rectMoneda.bottom &&
      rectGrecia.bottom > rectMoneda.top &&
      !moneda.classList.contains("recolectada")
    ) {
      moneda.classList.add("recolectada");
      moneda.style.display = "none";
      monedasRecolectadas++;
      if (monedasRecolectadas === 5) {
        mostrarMensaje("¡Ganaste! Toca la pantalla para jugar de nuevo.");
        juegoActivo = false;
      }
    }
  });
}

// Mostrar mensaje de fin de juego
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.style.display = "block";
}

// Reiniciar juego
function reiniciarJuego() {
  greciaX = 50;
  greciaY = 50;
  grecia.style.left = `${greciaX}px`;
  grecia.style.top = `${greciaY}px`;
  monedasRecolectadas = 0;
  posicionarMonedas(); // Volver a posicionar las monedas aleatoriamente
  reiniciarEnemigos(); // Reiniciar posiciones de los enemigos
  mensaje.style.display = "none";
  juegoActivo = true;
  moverEnemigos(); // Reiniciar el movimiento de los enemigos
}

// Reiniciar al tocar la pantalla
document.addEventListener("touchstart", () => {
  if (!juegoActivo) {
    reiniciarJuego();
  }
});

// Iniciar movimiento de enemigos y posicionar monedas al inicio
posicionarMonedas();
reiniciarEnemigos();
moverEnemigos();