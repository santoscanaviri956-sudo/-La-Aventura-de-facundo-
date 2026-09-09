// Este archivo revisa los choques.
// Detección de choques entre el jugador, el escenario y los objetos.

function resolverColisionBloque(jugador, bloque) {
    if (!bloque.activo || !jugador.colisionaCon(bloque)) return false;

    const posicionAnteriorX = jugador.xAnterior ?? jugador.x;
    const posicionAnteriorY = jugador.yAnterior ?? jugador.y;
    const golpeDesdeAbajo = jugador.velocidadY < 0 &&
        posicionAnteriorY >= bloque.y + bloque.alto &&
        jugador.y < bloque.y + bloque.alto;

    if (golpeDesdeAbajo) {
        jugador.y = bloque.y + bloque.alto;
        jugador.velocidadY = 0;
        bloque.desactivar();
        mostrarPregunta();
        return true;
    }

    const cruzoDesdeIzquierda = posicionAnteriorX + jugador.ancho <= bloque.x &&
        jugador.x + jugador.ancho > bloque.x;
    const cruzoDesdeDerecha = posicionAnteriorX >= bloque.x + bloque.ancho &&
        jugador.x < bloque.x + bloque.ancho;
    const cruzoDesdeArriba = posicionAnteriorY + jugador.alto <= bloque.y &&
        jugador.y + jugador.alto > bloque.y;
    const estabaALaIzquierda = posicionAnteriorX + jugador.ancho <= bloque.x;
    const estabaALaDerecha = posicionAnteriorX >= bloque.x + bloque.ancho;
    const estabaArriba = posicionAnteriorY + jugador.alto <= bloque.y;
    const estabaAbajo = posicionAnteriorY >= bloque.y + bloque.alto;

    if (cruzoDesdeIzquierda || (!cruzoDesdeDerecha && estabaALaIzquierda)) {
        jugador.x = bloque.x - jugador.ancho;
        jugador.velocidadX = 0;
    } else if (cruzoDesdeDerecha || (!cruzoDesdeIzquierda && estabaALaDerecha)) {
        jugador.x = bloque.x + bloque.ancho;
        jugador.velocidadX = 0;
    } else if (cruzoDesdeArriba || (!golpeDesdeAbajo && estabaArriba)) {
        jugador.y = bloque.y - jugador.alto;
        jugador.velocidadY = 0;
        jugador.enSuelo = true;
    } else if (estabaAbajo) {
        jugador.y = bloque.y + bloque.alto;
        jugador.velocidadY = 0;
    } else if (Math.abs(jugador.velocidadX) >= Math.abs(jugador.velocidadY)) {
        jugador.x = jugador.x + jugador.ancho / 2 < bloque.x + bloque.ancho / 2
            ? bloque.x - jugador.ancho
            : bloque.x + bloque.ancho;
        jugador.velocidadX = 0;
    } else if (jugador.velocidadY >= 0) {
        jugador.y = bloque.y - jugador.alto;
        jugador.velocidadY = 0;
        jugador.enSuelo = true;
    } else {
        jugador.y = bloque.y + bloque.alto;
        jugador.velocidadY = 0;
    }

    return false;
}

function jugadorCayoEnPozo(jugador, pozos = []) {
    return pozos.some((pozo) => {
        const estaCompletamenteSobreElPozo = jugador.x >= pozo.x &&
            jugador.x + jugador.ancho <= pozo.x + pozo.ancho;
        return estaCompletamenteSobreElPozo && jugador.y > pozo.y;
    });
}

function jugadorGolpeoObstaculo(jugador, obstaculos = []) {
    return obstaculos.some((obstaculo) =>
        jugador.x < obstaculo.x + obstaculo.ancho &&
        jugador.x + jugador.ancho > obstaculo.x &&
        jugador.y < obstaculo.y + obstaculo.alto &&
        jugador.y + jugador.alto > obstaculo.y
    );
}
