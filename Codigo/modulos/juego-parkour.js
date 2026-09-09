// Este archivo controla el parkour.
// PARKOUR
// =========================================
function iniciarNivelParkour() {
    estadoJuego.enParkour = true;
    estadoJuego.vidas = CONFIG.VIDAS_INICIALES;

    canvasParkour = document.getElementById('canvas-parkour');
    ctxParkour = canvasParkour.getContext('2d');
    canvasParkour.width = CONFIG.ANCHO_CANVAS;
    canvasParkour.height = CONFIG.ALTO_CANVAS;

    const nivel = NIVELES[estadoJuego.nivelActual];
    jugador = new Jugador(50, 430);

    const plataformasParkour = [
        { x: 0, y: 480, ancho: 200, alto: 60 },
        { x: 260, y: 430, ancho: 90, alto: 25 },
        { x: 380, y: 380, ancho: 90, alto: 25 },
        { x: 500, y: 330, ancho: 90, alto: 25 },
        { x: 620, y: 280, ancho: 90, alto: 25 },
        { x: 740, y: 230, ancho: 90, alto: 25 },
        { x: 850, y: 170, ancho: 110, alto: 25 }
    ];

    meta = new Meta(875, 110);

    estadoJuego.tiempoRestante = CONFIG.TIEMPO_PARKOUR;
    estadoJuego.juegoActivo = true;

    mostrarPantalla('pantalla-parkour');

    if (animacionParkour) cancelAnimationFrame(animacionParkour);
    bucleDelParkour(plataformasParkour);
}

function bucleDelParkour(plataformas) {
    if (!estadoJuego.juegoActivo) return;

    estadoJuego.tiempoRestante -= 1/60;
    if (estadoJuego.tiempoRestante <= 0) {
        estadoJuego.tiempoRestante = 0;
        mostrarGameOver();
        return;
    }

    if (jugador.actualizar(teclas, plataformas, 480)) {
        mostrarGameOver();
        return;
    }

    if (jugador.colisionaCon(meta)) {
        estadoJuego.parkourCompletado = true;
        estadoJuego.vidas = CONFIG.VIDAS_INICIALES;
        estadoJuego.puntaje += 200;
        mostrarVictoria();
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
    jugador.dibujar(ctxParkour);

    ctxParkour.fillStyle = 'rgba(139, 0, 0, 0.85)';
    ctxParkour.fillRect(CONFIG.ANCHO_CANVAS/2 - 100, 48, 200, 35);
    ctxParkour.strokeStyle = '#FFD700';
    ctxParkour.lineWidth = 2;
    ctxParkour.strokeRect(CONFIG.ANCHO_CANVAS/2 - 100, 48, 200, 35);
    ctxParkour.fillStyle = '#FFD700';
    ctxParkour.font = 'bold 15px Arial';
    ctxParkour.textAlign = 'center';
    ctxParkour.textBaseline = 'middle';
    ctxParkour.fillText('¡PARKOUR - RECUPERA UNA VIDA!', CONFIG.ANCHO_CANVAS/2, 66);
}

// =========================================

