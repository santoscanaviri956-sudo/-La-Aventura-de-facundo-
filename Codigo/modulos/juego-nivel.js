// Este archivo prepara y ejecuta los niveles.
// FUNCIONES DEL JUEGO
// =========================================
function obtenerHitboxEnemigo(enemigo) {
    const margenLateral = 6;
    return {
        x: enemigo.x + margenLateral,
        y: enemigo.y,
        ancho: enemigo.ancho - margenLateral * 2,
        alto: enemigo.alto
    };
}

let avisoMetaBloqueadaActivo = false;

function cargarNivel(numeroNivel, conservarEstadisticas = false) {
    solicitarModoHorizontal();
    estadoJuego.nivelActual = numeroNivel;
    estadoJuego.enParkour = false;
    avisoMetaBloqueadaActivo = false;

    const nivel = NIVELES[numeroNivel];
    if (!nivel) return;

    canvas = document.getElementById('canvas-juego');
    ctx = canvas.getContext('2d');
    canvas.width = CONFIG.ANCHO_CANVAS;
    canvas.height = CONFIG.ALTO_CANVAS;

        jugador = new Jugador(0, nivel.sueloY - CONFIG.TAMANO_PERSONAJE);
    enemigos = nivel.enemigos.map(e =>
        new Enemigo(e.x, e.y, e.tipo, e.limiteIzquierdo, e.limiteDerecho)
    );
    bloquesMisteriosos = nivel.bloquesMisteriosos.map(b => new BloqueMisterioso(b.x, b.y));
    meta = new Meta(nivel.meta.x, nivel.meta.y);
    llaveSecreta = nivel.llaveSecreta
        ? new LlaveSecreta(nivel.llaveSecreta.x, nivel.llaveSecreta.y)
        : null;
    puertaSecreta = nivel.puertaSecreta
        ? new PuertaSecreta(nivel.puertaSecreta.x, nivel.puertaSecreta.y)
        : null;
    estadoJuego.tieneLlaveSecreta = false;

    estadoJuego.tiempoRestante = CONFIG.TIEMPO_NIVEL;
    estadoJuego.preguntasCubosRespondidasNivel = 0;
    estadoJuego.preguntasCubosCorrectasNivel = 0;
    if (!conservarEstadisticas) {
        estadoJuego.preguntasRespondidas = 0;
        estadoJuego.preguntasCorrectas = 0;
    }
    estadoJuego.juegoActivo = true;
    estadoJuego.juegoPausado = true;

    const pantallaJuego = document.getElementById('pantalla-juego');
    if (pantallaJuego) {
        pantallaJuego.classList.toggle('tutorial-activo', numeroNivel === 0);
    }

    const ayudaTutorial = document.getElementById('tutorial-ayuda');
    if (ayudaTutorial) {
        ayudaTutorial.textContent = numeroNivel === 0
            ? 'Muévete con A/D o las flechas. Salta con W, ↑ o espacio. Golpea el cubo desde abajo saltando para abrir una pregunta; responde y recoge todos los cubos antes de llegar a la meta.'
            : 'Muévete con A/D o las flechas. Salta con W, ↑ o espacio para cruzar el pozo. Recoge la llave y pulsa Z junto a la puerta para abrirla; luego llega a la meta.';
        ayudaTutorial.classList.toggle('oculto', numeroNivel !== 0);
    }

    actualizarHUD();
    mostrarPantalla('pantalla-juego');
    actualizarReproduccionMusica();
    dibujarNivel(nivel);

    if (animacionJuego) cancelAnimationFrame(animacionJuego);
    iniciarCuentaRegresiva(
        document.querySelector('#pantalla-juego .juego-contenedor'),
        () => {
            if (!estadoJuego.juegoActivo || estadoJuego.enParkour ||
                estadoJuego.pantallaActual !== 'pantalla-juego') return;
            estadoJuego.juegoPausado = false;
            bucleDelJuego();
        }
    );
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

    if (puertaSecreta) {
        const estaEnLaPuerta = jugador.colisionaCon(puertaSecreta);
        if (!puertaSecreta.abierta && estadoJuego.tieneLlaveSecreta && estaEnLaPuerta && (teclas.z || teclas.Z)) {
            puertaSecreta.abierta = true;
        }

        if (!puertaSecreta.abierta && estaEnLaPuerta) {
            jugador.x = jugador.xAnterior;
            jugador.velocidadX = 0;
        }
    }

    if (llaveSecreta) llaveSecreta.actualizar();
    if (puertaSecreta) puertaSecreta.actualizar();
    if (llaveSecreta && llaveSecreta.activa && jugador.colisionaCon(llaveSecreta)) {
        llaveSecreta.recoger();
        estadoJuego.tieneLlaveSecreta = true;
    }

    if (jugador.inmunidad === 0 && jugadorCayoEnPozo(jugador, nivel.pozos)) {
        perderVida();
        jugador.x = 0;
        jugador.y = nivel.sueloY - jugador.alto;
        jugador.velocidadX = 0;
        jugador.velocidadY = 0;
        if (!estadoJuego.juegoActivo || estadoJuego.juegoPausado) return;
    }

    if (jugador.inmunidad === 0 && jugadorGolpeoObstaculo(jugador, nivel.obstaculos)) {
        perderVida();
        jugador.x = 0;
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
        const hitboxEnemigo = obtenerHitboxEnemigo(enemigo);

        if (enemigo.vivo && jugador.colisionaCon(hitboxEnemigo)) {
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

    if (estadoJuego.juegoPausado) return;

    if (jugador.colisionaCon(meta) && bloquesMisteriosos.some((bloque) => bloque.activo)) {
        jugador.x = jugador.xAnterior;
        jugador.velocidadX = 0;
        if (!avisoMetaBloqueadaActivo) {
            avisoMetaBloqueadaActivo = true;
            mostrarMensajeProgreso('¡No agarraste todos los cubos de preguntas de este nivel! Recoge los que faltan antes de llegar a la meta.');
            setTimeout(() => {
                avisoMetaBloqueadaActivo = false;
            }, 2200);
        }
    } else if (jugador.colisionaCon(meta)) {
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
        const altoFondo = CONFIG.ALTO_CANVAS;
        const anchoFondo = Math.max(1, Math.round(
            (imagenFondo.width / Math.max(1, imagenFondo.height - recorteSuperior)) * altoFondo
        ));

        for (let x = 0; x < anchoNivel; x += anchoFondo) {
            dibujarImagenSegura(
                ctx,
                imagenFondo,
                0,
                recorteSuperior,
                imagenFondo.width,
                imagenFondo.height - recorteSuperior,
                x,
                0,
                anchoFondo,
                altoFondo
            );
        }
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

    if (llaveSecreta) llaveSecreta.dibujar(ctx);
    if (puertaSecreta) puertaSecreta.dibujar(ctx);

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

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textoNivel = 'NIVEL ' + estadoJuego.nivelActual + ' - ' + NIVELES[estadoJuego.nivelActual].nombre.toUpperCase();
    const anchoCaja = Math.min(CONFIG.ANCHO_CANVAS - 16, Math.max(130, ctx.measureText(textoNivel).width + 24));
    const xCaja = (CONFIG.ANCHO_CANVAS - anchoCaja) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(xCaja, 8, anchoCaja, 32);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(xCaja, 8, anchoCaja, 32);
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText(textoNivel, CONFIG.ANCHO_CANVAS / 2, 24, anchoCaja - 16);
}

// =========================================
