// Este archivo muestra el avance y la victoria.
// FUNCIONES DE VICTORIA
// =========================================
function completarNivel() {
    estadoJuego.juegoActivo = false;
    estadoJuego.puntaje += CONFIG.PUNTOS_NIVEL;

    const bonusTiempo = Math.floor(estadoJuego.tiempoRestante * 10);
    estadoJuego.puntaje += bonusTiempo;
    const bonusVidas = estadoJuego.vidas * 50;
    estadoJuego.puntaje += bonusVidas;

    document.getElementById('victoria-puntaje').textContent = estadoJuego.puntaje;
    document.getElementById('victoria-tiempo').textContent = formatearTiempo(CONFIG.TIEMPO_NIVEL - estadoJuego.tiempoRestante);
    document.getElementById('victoria-preguntas').textContent =
        estadoJuego.preguntasCorrectas + '/' + estadoJuego.preguntasRespondidas;

    const pantallaVictoria = document.getElementById('pantalla-victoria');
    const botonCreditos = document.getElementById('btn-creditos-victoria');
    const esUltimoNivel = Number(estadoJuego.nivelActual) === 5;
    botonCreditos.classList.toggle('oculto', !esUltimoNivel);
    if (esUltimoNivel) {
        pantallaVictoria.classList.add('juego-finalizado');
        pantallaVictoria.classList.remove('fondo-nivel');
    } else {
        pantallaVictoria.classList.remove('juego-finalizado');
        pantallaVictoria.classList.add('fondo-nivel');
        prepararAnimacionFondoVictoria();
    }

    mostrarPantalla('pantalla-victoria');
}

function prepararAnimacionFondoVictoria() {
    const polvo = document.getElementById('particulas-polvo');
    const destellos = document.getElementById('destellos-magicos');

    if (!polvo || !destellos || polvo.childElementCount > 0) return;

    for (let indice = 0; indice < 18; indice++) {
        const particula = document.createElement('span');
        particula.className = 'particula-polvo';
        particula.style.setProperty('--polvo-x', `${12 + Math.random() * 76}%`);
        particula.style.setProperty('--polvo-y', `${20 + Math.random() * 55}%`);
        particula.style.setProperty('--polvo-tamano', `${1 + Math.random() * 2}px`);
        particula.style.setProperty('--polvo-duracion', `${7 + Math.random() * 6}s`);
        particula.style.setProperty('--polvo-retraso', `${-Math.random() * 10}s`);
        polvo.appendChild(particula);
    }

    for (let indice = 0; indice < 4; indice++) {
        const destello = document.createElement('span');
        destello.className = 'destello-magico';
        destello.style.setProperty('--destello-x', `${20 + Math.random() * 65}%`);
        destello.style.setProperty('--destello-y', `${18 + Math.random() * 48}%`);
        destello.style.setProperty('--destello-duracion', `${6 + Math.random() * 5}s`);
        destello.style.setProperty('--destello-retraso', `${-Math.random() * 9}s`);
        destellos.appendChild(destello);
    }
}

function mostrarVictoria() {
    estadoJuego.juegoActivo = false;
    const pantallaVictoria = document.getElementById('pantalla-victoria');
    document.getElementById('btn-creditos-victoria').classList.add('oculto');
    pantallaVictoria.classList.remove('juego-finalizado', 'fondo-nivel');
    document.getElementById('victoria-puntaje').textContent = estadoJuego.puntaje;
    document.getElementById('victoria-tiempo').textContent = '01:00';
    document.getElementById('victoria-preguntas').textContent = '¡Parkour Completado!';
    mostrarPantalla('pantalla-victoria');
}

function siguienteNivel() {
    const siguienteNivelNum = estadoJuego.nivelActual + 1;
    if (siguienteNivelNum <= 5) {
        estadoJuego.vidas = Math.min(estadoJuego.vidas + 1, CONFIG.VIDAS_INICIALES);
        cargarNivel(siguienteNivelNum);
    } else {
        alert('¡Felicitaciones! Has completado todos los niveles de La Aventura de Facundo');
        volverAlMenu();
    }
}

// =========================================

