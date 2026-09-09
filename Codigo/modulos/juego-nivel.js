// Este archivo prepara y ejecuta los niveles.
// FUNCIONES DEL JUEGO
// =========================================
function cargarNivel(numeroNivel) {
    estadoJuego.nivelActual = numeroNivel;
    estadoJuego.enParkour = false;

    const nivel = NIVELES[numeroNivel];
    if (!nivel) return;

    canvas = document.getElementById('canvas-juego');
    ctx = canvas.getContext('2d');
    canvas.width = CONFIG.ANCHO_CANVAS;
    canvas.height = CONFIG.ALTO_CANVAS;

        jugador = new Jugador(50, nivel.sueloY - CONFIG.TAMANO_PERSONAJE);
    enemigos = nivel.enemigos.map(e => new Enemigo(e.x, e.y, e.tipo));
    bloquesMisteriosos = nivel.bloquesMisteriosos.map(b => new BloqueMisterioso(b.x, b.y));
    meta = new Meta(nivel.meta.x, nivel.meta.y);

    estadoJuego.tiempoRestante = CONFIG.TIEMPO_NIVEL;
    estadoJuego.preguntasRespondidas = 0;
    estadoJuego.preguntasCorrectas = 0;
    estadoJuego.juegoActivo = true;
    estadoJuego.juegoPausado = false;

    actualizarHUD();
    mostrarPantalla('pantalla-juego');
    dibujarNivel(nivel);

    if (animacionJuego) cancelAnimationFrame(animacionJuego);
    bucleDelJuego();
}

function bucleDelJuego() {
    if (!estadoJuego.juegoActivo || estadoJuego.juegoPausado) return;

    estadoJuego.tiempoRestante -= 1/60;
    if (estadoJuego.tiempoRestante <= 0) {
        estadoJuego.tiempoRestante = 0;
        mostrarGameOver();
        return;
    }

    const nivel = NIVELES[estadoJuego.nivelActual];

    if (jugador.actualizar(teclas, nivel.plataformas, nivel.sueloY, nivel.ancho, nivel.pozos)) {
        perderVida();
        return;
    }

    if (jugador.inmunidad === 0 && jugadorCayoEnPozo(jugador, nivel.pozos)) {
        perderVida();
        jugador.x = 50;
        jugador.y = nivel.sueloY - jugador.alto;
        jugador.velocidadX = 0;
        jugador.velocidadY = 0;
        if (!estadoJuego.juegoActivo || estadoJuego.juegoPausado) return;
    }

    if (jugador.inmunidad === 0 && jugadorGolpeoObstaculo(jugador, nivel.obstaculos)) {
        perderVida();
        jugador.x = 50;
        jugador.y = nivel.sueloY - jugador.alto;
        jugador.velocidadX = 0;
        jugador.velocidadY = 0;
        if (!estadoJuego.juegoActivo || estadoJuego.juegoPausado) return;
    }

    enemigos.forEach(enemigo => {
        enemigo.actualizar(nivel.plataformas, nivel.sueloY, nivel.ancho, nivel.pozos);
    });

    bloquesMisteriosos.forEach(bloque => {
        bloque.actualizar();
    });

    meta.actualizar();

    enemigos.forEach(enemigo => {
        if (enemigo.vivo && jugador.colisionaCon(enemigo)) {
            if (jugador.velocidadY > 0 && jugador.y + jugador.alto - 10 < enemigo.y + enemigo.alto/2) {
                enemigo.morir();
                estadoJuego.puntaje += CONFIG.PUNTOS_ENEMIGO;
                jugador.velocidadY = CONFIG.FUERZA_SALTO / 2;
                crearEfectoEliminacion(enemigo.x + enemigo.ancho/2, enemigo.y);
            } else if (jugador.inmunidad === 0) {
                perderVida();
            }
        }
    });

    bloquesMisteriosos.forEach(bloque => {
        resolverColisionBloque(jugador, bloque);
    });

    if (jugador.colisionaCon(meta)) {
        completarNivel();
        return;
    }

    dibujarNivel(nivel);
    actualizarHUD();

    animacionJuego = requestAnimationFrame(bucleDelJuego);
}

function dibujarNivel(nivel) {
    const anchoNivel = nivel.ancho || CONFIG.ANCHO_CANVAS;
    desplazamientoCamara = Math.max(
        0,
        Math.min(jugador.x - CONFIG.ANCHO_CANVAS / 2, anchoNivel - CONFIG.ANCHO_CANVAS)
    );
    ctx.clearRect(0, 0, CONFIG.ANCHO_CANVAS, CONFIG.ALTO_CANVAS);
    const gradienteBase = ctx.createLinearGradient(0, 0, 0, CONFIG.ALTO_CANVAS);
    gradienteBase.addColorStop(0, '#87CEEB');
    gradienteBase.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradienteBase;
    ctx.fillRect(0, 0, CONFIG.ANCHO_CANVAS, CONFIG.ALTO_CANVAS);

    ctx.save();
    ctx.translate(-desplazamientoCamara, 0);

    const imagenFondo = IMAGENES[nivel.fondo];
    if (imagenFondo) {
        const recortesSuperiores = {
            fondo1: 75,
            fondo2: 245
        };
        const recorteSuperior = recortesSuperiores[nivel.fondo] || 0;
        dibujarImagenSegura(
            ctx,
            imagenFondo,
            0,
            recorteSuperior,
            imagenFondo.width,
            imagenFondo.height - recorteSuperior,
            0,
            0,
            anchoNivel,
            CONFIG.ALTO_CANVAS
        );
    } else {
        const gradiente = ctx.createLinearGradient(0, 0, 0, CONFIG.ALTO_CANVAS);
        gradiente.addColorStop(0, '#87CEEB');
        gradiente.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, anchoNivel, CONFIG.ALTO_CANVAS);
    }

    const imagenNubes = IMAGENES['nubes'];
    if (imagenNubes) {
        const tiempo = Date.now() * 0.0005;
        for (let i = 0; i < 3; i++) {
            const x = (i * 350 + tiempo * 30) % (anchoNivel + 200) - 100;
            ctx.globalAlpha = 0.7;
            dibujarImagenSegura(ctx, imagenNubes, x, 30 + i * 40, 180, 60);
            ctx.globalAlpha = 1;
        }
    }

    nivel.arboles.forEach(arbol => {
        const imagenArbol = IMAGENES['arbol'];
        if (imagenArbol) {
            dibujarImagenSegura(ctx, imagenArbol, arbol.x, arbol.y, 50, 70);
        } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(arbol.x + 18, arbol.y + 30, 14, 40);
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(arbol.x + 25, arbol.y + 15, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#006400';
            ctx.beginPath();
            ctx.arc(arbol.x + 25, arbol.y + 22, 25, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    nivel.arbustos.forEach(arbusto => {
        const imagenArbusto = IMAGENES['arbusto'];
        if (imagenArbusto) {
            dibujarImagenSegura(ctx, imagenArbusto, arbusto.x, arbusto.y, 40, 35);
        } else {
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(arbusto.x + 20, arbusto.y + 18, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#006400';
            ctx.beginPath();
            ctx.arc(arbusto.x + 20, arbusto.y + 22, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    dibujarSuelo(nivel);

    (nivel.pozos || []).forEach((pozo) => {
        ctx.fillStyle = '#111827';
        ctx.fillRect(pozo.x, pozo.y, pozo.ancho, pozo.alto);
        ctx.fillStyle = '#020617';
        ctx.fillRect(pozo.x + 8, pozo.y + 7, pozo.ancho - 16, pozo.alto);
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 3;
        ctx.strokeRect(pozo.x, pozo.y, pozo.ancho, 8);
    });

    (nivel.obstaculos || []).forEach((obstaculo) => {
        dibujarObstaculo(ctx, obstaculo);
    });

    nivel.plataformas.forEach(plataforma => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(plataforma.x + 3, plataforma.y + 3, plataforma.ancho, plataforma.alto);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, 5);
        ctx.fillStyle = '#654321';
        ctx.fillRect(plataforma.x, plataforma.y + plataforma.alto - 3, plataforma.ancho, 3);

        for (let i = 20; i < plataforma.ancho; i += 40) {
            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.arc(plataforma.x + i, plataforma.y + 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    bloquesMisteriosos.forEach(bloque => {
        bloque.dibujar(ctx);
    });

    meta.dibujar(ctx);

    enemigos.forEach(enemigo => {
        enemigo.dibujar(ctx);
    });

    jugador.dibujar(ctx);

    if (jugador.estado === 'walk' && jugador.enSuelo) {
        ctx.fillStyle = 'rgba(139, 69, 19, 0.35)';
        for (let i = 0; i < 5; i++) {
            const x = jugador.x + jugador.ancho/2 + (Math.random() - 0.5) * 20;
            const y = jugador.y + jugador.alto - 2;
            const tamano = Math.random() * 4 + 1;
            ctx.beginPath();
            ctx.arc(x, y, tamano, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(CONFIG.ANCHO_CANVAS/2 - 65, 8, 130, 32);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(CONFIG.ANCHO_CANVAS/2 - 65, 8, 130, 32);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NIVEL ' + estadoJuego.nivelActual + ' - ' + NIVELES[estadoJuego.nivelActual].nombre.toUpperCase(), CONFIG.ANCHO_CANVAS/2, 24);
}

// =========================================

