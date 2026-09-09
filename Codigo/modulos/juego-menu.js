// Este archivo cambia entre pantallas.
// FUNCIONES DE PANTALLA
// =========================================
function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(p => {
        p.classList.remove('activa');
    });
    const pantalla = document.getElementById(idPantalla);
    if (pantalla) {
        pantalla.classList.add('activa');
        estadoJuego.pantallaActual = idPantalla;
    }

    if (idPantalla === 'pantalla-creditos') {
        iniciarParticulasCreditos();
    } else {
        detenerParticulasCreditos();
    }
}

function iniciarParticulasCreditos() {
    const contenedor = document.getElementById('particulas-creditos');
    if (!contenedor || contenedor.children.length > 0) return;

    for (let indice = 0; indice < 18; indice++) {
        const particula = document.createElement('span');
        particula.className = 'particula-credito';
        particula.style.left = `${Math.random() * 100}%`;
        particula.style.setProperty('--tamano-particula', `${2 + Math.random() * 4}px`);
        particula.style.setProperty('--duracion-particula', `${7 + Math.random() * 7}s`);
        particula.style.setProperty('--retraso-particula', `${-Math.random() * 12}s`);
        particula.style.setProperty('--desplazamiento-particula', `${-35 + Math.random() * 70}px`);
        contenedor.appendChild(particula);
    }
}

function detenerParticulasCreditos() {
    const contenedor = document.getElementById('particulas-creditos');
    if (contenedor) contenedor.replaceChildren();
}

// =========================================
// FUNCIONES DEL MENU
// =========================================
function iniciarJuego() {
    estadoJuego.vidas = CONFIG.VIDAS_INICIALES;
    estadoJuego.puntaje = 0;
    estadoJuego.parkourCompletado = false;
    mostrarPantalla('pantalla-niveles');
}

function toggleSonido() {
    estadoJuego.sonidoActivo = !estadoJuego.sonidoActivo;
    const btn = document.getElementById('btn-sonido');
    btn.textContent = estadoJuego.sonidoActivo ? 'ON' : 'OFF';
    btn.classList.toggle('off', !estadoJuego.sonidoActivo);
}

function toggleMusica() {
    estadoJuego.musicaActiva = !estadoJuego.musicaActiva;
    const btn = document.getElementById('btn-musica');
    btn.textContent = estadoJuego.musicaActiva ? 'ON' : 'OFF';
    btn.classList.toggle('off', !estadoJuego.musicaActiva);
}

function volverAlMenu() {
    estadoJuego.juegoActivo = false;
    if (animacionJuego) cancelAnimationFrame(animacionJuego);
    if (animacionParkour) cancelAnimationFrame(animacionParkour);
    mostrarPantalla('pantalla-menu');
}

// =========================================

