// Este archivo controla el parkour.
// PARKOUR
// =========================================
let enemigosParkour = [];

function iniciarNivelParkour() {
    solicitarModoHorizontal();
    estadoJuego.enParkour = true;
    estadoJuego.parkourIntentado = true;
    estadoJuego.vidas = 1;

    canvasParkour = document.getElementById('canvas-parkour');
    ctxParkour = canvasParkour.getContext('2d');
    canvasParkour.width = CONFIG.ANCHO_CANVAS;
    canvasParkour.height = CONFIG.ALTO_CANVAS;

    const nivel = NIVELES[estadoJuego.nivelActual];
    jugador = new Jugador(50, 430);

    const plataformasParkour = [
        { x: 0, y: 480, ancho: 190, alto: 60 },
        { x: 215, y: 430, ancho: 125, alto: 25 },
        { x: 355, y: 365, ancho: 125, alto: 25 },
        { x: 495, y: 300, ancho: 125, alto: 25 },
        { x: 635, y: 235, ancho: 140, alto: 25 }
    ];

    meta = new Meta(675, 175);
    enemigosParkour = [
        new Enemigo(235, 382, 'soldado', plataformasParkour[1].x, plataformasParkour[1].x + plataformasParkour[1].ancho),
        new Enemigo(375, 317, 'gauche', plataformasParkour[2].x, plataformasParkour[2].x + plataformasParkour[2].ancho),
        new Enemigo(515, 252, 'caudillo', plataformasParkour[3].x, plataformasParkour[3].x + plataformasParkour[3].ancho)
    ];

    estadoJuego.tiempoRestante = CONFIG.TIEMPO_PARKOUR;
    estadoJuego.juegoActivo = true;
    estadoJuego.juegoPausado = true;
    document.getElementById('hud-tiempo-parkour').textContent =
        formatearTiempo(estadoJuego.tiempoRestante);

    mostrarPantalla('pantalla-parkour');
    actualizarReproduccionMusica();

    if (animacionParkour) cancelAnimationFrame(animacionParkour);
    dibujarParkour(plataformasParkour);
    iniciarCuentaRegresiva(
        document.querySelector('#pantalla-parkour .juego-contenedor'),
        () => {
            if (!estadoJuego.juegoActivo || !estadoJuego.enParkour ||
                estadoJuego.pantallaActual !== 'pantalla-parkour') return;
            estadoJuego.juegoPausado = false;
            bucleDelParkour(plataformasParkour);
        }
    );
}

function bucleDelParkour(plataformas) {
    if (!estadoJuego.juegoActivo) return;

    estadoJuego.tiempoRestante -= 1/60;
    if (estadoJuego.tiempoRestante <= 0) {
        estadoJuego.tiempoRestante = 0;
        mostrarGameOver();
        return;
    }

    if (jugador.actualizar(teclas, plataformas, CONFIG.ALTO_CANVAS + 100, 760)) {
        mostrarGameOver();
        return;
    }

    enemigosParkour.forEach((enemigo) => {
        enemigo.actualizar(plataformas, CONFIG.ALTO_CANVAS + 100, 760, [], true);
        const hitboxEnemigo = obtenerHitboxEnemigo(enemigo);
        if (enemigo.vivo && jugador.colisionaCon(hitboxEnemigo)) {
            if (jugador.velocidadY > 0 && jugador.y + jugador.alto - 10 < enemigo.y + enemigo.alto / 2) {
                enemigo.morir();
                estadoJuego.puntaje += CONFIG.PUNTOS_ENEMIGO;
                jugador.velocidadY = CONFIG.FUERZA_SALTO / 2;
            } else if (jugador.inmunidad === 0) {
                mostrarGameOver();
            }
        }
    });

    if (!estadoJuego.juegoActivo) return;

    if (jugador.colisionaCon(meta)) {
        estadoJuego.juegoActivo = false;
        estadoJuego.parkourCompletado = true;
        mostrarPregunta(() => {
            estadoJuego.vidas = 1;
            estadoJuego.puntaje += 200;
            cargarNivel(estadoJuego.nivelActual);
        });
        return;
    }

    dibujarParkour(plataformas);

    actualizarVidasHUD();
    document.getElementById('hud-puntaje-parkour').textContent = estadoJuego.puntaje;
    document.getElementById('hud-tiempo-parkour').textContent = formatearTiempo(estadoJuego.tiempoRestante);

    animacionParkour = requestAnimationFrame(() => bucleDelParkour(plataformas));
}

function dibujarParkour(plataformas) {
    ctxParkour.clearRect(0, 0, CONFIG.ANCHO_CANVAS, CONFIG.ALTO_CANVAS);

    const imagenFondoParkour = IMAGENES['fondo5'];
    if (imagenFondoParkour) {
        ctxParkour.globalAlpha = 0.4;
        dibujarImagenSegura(ctxParkour, imagenFondoParkour, 0, 0, CONFIG.ANCHO_CANVAS, CONFIG.ALTO_CANVAS);
        ctxParkour.globalAlpha = 1;
    }

    const gradiente = ctxParkour.createLinearGradient(0, 0, 0, CONFIG.ALTO_CANVAS);
    gradiente.addColorStop(0, 'rgba(74, 0, 0, 0.5)');
    gradiente.addColorStop(1, 'rgba(139, 0, 0, 0.3)');
    ctxParkour.fillStyle = gradiente;
    ctxParkour.fillRect(0, 0, CONFIG.ANCHO_CANVAS, CONFIG.ALTO_CANVAS);

    const tiempo = Date.now() * 0.003;
    ctxParkour.fillStyle = '#FF4500';
    for (let x = 0; x < CONFIG.ANCHO_CANVAS; x += 25) {
        const h = 25 + Math.sin(x * 0.05 + tiempo) * 8;
        ctxParkour.fillRect(x, CONFIG.ALTO_CANVAS - h, 25, h);
    }

    plataformas.forEach(plataforma => {
        ctxParkour.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctxParkour.fillRect(plataforma.x + 3, plataforma.y + 3, plataforma.ancho, plataforma.alto);

        ctxParkour.fillStyle = '#4a4a4a';
        ctxParkour.fillRect(plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);
        ctxParkour.fillStyle = '#666';
        ctxParkour.fillRect(plataforma.x, plataforma.y, plataforma.ancho, 5);
        ctxParkour.fillStyle = '#333';
        ctxParkour.fillRect(plataforma.x, plataforma.y + plataforma.alto - 3, plataforma.ancho, 3);
    });

    meta.dibujar(ctxParkour);
    enemigosParkour.forEach((enemigo) => enemigo.dibujar(ctxParkour));
    jugador.dibujar(ctxParkour);

    ctxParkour.fillStyle = 'rgba(139, 0, 0, 0.85)';
    ctxParkour.fillRect(CONFIG.ANCHO_CANVAS/2 - 100, 48, 200, 35);
    ctxParkour.strokeStyle = '#FFD700';
    ctxParkour.lineWidth = 2;
    ctxParkour.strokeRect(CONFIG.ANCHO_CANVAS/2 - 100, 48, 200, 35);
    ctxParkour.fillStyle = '#FFD700';
    ctxParkour.font = '7px "Press Start 2P", monospace';
    ctxParkour.textAlign = 'center';
    ctxParkour.textBaseline = 'middle';
    ctxParkour.fillText('¡PARKOUR - RECUPERA UNA VIDA!', CONFIG.ANCHO_CANVAS/2, 66);
}

// =========================================
