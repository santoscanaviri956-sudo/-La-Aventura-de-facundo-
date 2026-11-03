// Reproducción de la música de fondo y controles de volumen.
let musicaDeFondo;

function configurarMusica() {
    musicaDeFondo = new Audio('audio/wombat.mp3');
    musicaDeFondo.loop = true;
    musicaDeFondo.preload = 'auto';
    actualizarVolumenMusica();
    actualizarControlMusica();

    document.addEventListener('pointerdown', reintentarMusicaEnMenu);
    document.addEventListener('keydown', reintentarMusicaEnMenu);
    document.addEventListener('input', (evento) => {
        const control = evento.target;
        if (!(control instanceof HTMLInputElement) || control.id !== 'volumen') return;

        estadoJuego.volumen = Number(control.value);
        actualizarVolumenMusica();
    });
}

function reintentarMusicaEnMenu() {
    if (estadoJuego.pantallaActual === 'pantalla-menu') {
        actualizarReproduccionMusica();
    }
}

function actualizarReproduccionMusica() {
    if (!musicaDeFondo) return;

    if (estadoJuego.musicaActiva) {
        const reproduccion = musicaDeFondo.play();
        if (reproduccion) {
            reproduccion.catch((error) => {
                if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
                    console.error('No se pudo reproducir la música de fondo.', error);
                }
            });
        }
    } else {
        musicaDeFondo.pause();
    }
}

function actualizarVolumenMusica() {
    if (musicaDeFondo) {
        musicaDeFondo.volume = Math.min(Math.max(estadoJuego.volumen / 100, 0), 1);
    }

    const control = document.getElementById('volumen');
    if (control) control.value = String(estadoJuego.volumen);
}

function actualizarControlMusica() {
    const boton = document.getElementById('btn-musica');
    if (!boton) return;

    boton.textContent = estadoJuego.musicaActiva ? 'ON' : 'OFF';
    boton.classList.toggle('off', !estadoJuego.musicaActiva);
}
