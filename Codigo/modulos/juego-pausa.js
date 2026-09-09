// Este archivo controla la pausa.
// PAUSA
// =========================================
function pausarJuego() {
    estadoJuego.juegoPausado = true;
    mostrarPantalla('pantalla-pausa');
}

function reanudarJuego() {
    estadoJuego.juegoPausado = false;
    mostrarPantalla('pantalla-juego');
    if (estadoJuego.enParkour) {
        bucleDelParkour([]);
    } else {
        bucleDelJuego();
    }
}

// =========================================

