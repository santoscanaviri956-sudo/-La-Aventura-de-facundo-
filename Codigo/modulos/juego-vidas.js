// Este archivo controla las vidas y el game over.
// FUNCIONES DE VIDAS Y GAME OVER
// =========================================
function perderVida() {
    estadoJuego.vidas--;
    jugador.inmunidad = 120;
    actualizarVidasHUD();

    const pantallaJuego = document.getElementById('pantalla-juego');
    pantallaJuego.style.filter = 'brightness(0.5) saturate(2)';
    setTimeout(() => {
        pantallaJuego.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            pantallaJuego.style.filter = 'brightness(1)';
        }, 100);
    }, 100);

    if (estadoJuego.vidas <= 0) {
        mostrarGameOver();
    }
}

function dibujarSuelo(nivel) {
    const estilos = {
        fondo1: { base: '#46505a', borde: '#cbd5e1', detalle: '#77838f', tipo: 'piedra' },
        fondo2: { base: '#86552e', borde: '#79a83b', detalle: '#c5894b', tipo: 'tierra' },
        fondo3: { base: '#3d5c25', borde: '#a3d65c', detalle: '#6e9f3b', tipo: 'pasto' },
        fondo4: { base: '#632f37', borde: '#d18b45', detalle: '#93464b', tipo: 'ladrillo' },
        fondo5: { base: '#26343b', borde: '#a9c0c7', detalle: '#526b73', tipo: 'roca' }
    };
    const estilo = estilos[nivel.fondo] || estilos.fondo2;
    const y = nivel.sueloY;
    const anchoNivel = nivel.ancho || CONFIG.ANCHO_CANVAS;

    ctx.fillStyle = estilo.base;
    ctx.fillRect(0, y, anchoNivel, CONFIG.ALTO_CANVAS - y);
    ctx.fillStyle = estilo.borde;
    ctx.fillRect(0, y, anchoNivel, 7);

    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = estilo.detalle;
    ctx.fillStyle = estilo.detalle;
    ctx.lineWidth = 2;

    for (let x = 12; x < anchoNivel; x += 46) {
        const profundidad = y + 22 + ((x * 7) % 34);
        if (estilo.tipo === 'pasto') {
            ctx.beginPath();
            ctx.moveTo(x, y + 6);
            ctx.lineTo(x + 4, y - 2);
            ctx.moveTo(x + 8, y + 7);
            ctx.lineTo(x + 12, y - 1);
            ctx.stroke();
        } else if (estilo.tipo === 'ladrillo') {
            ctx.strokeRect(x, profundidad, 30, 12);
        } else if (estilo.tipo === 'piedra' || estilo.tipo === 'roca') {
            ctx.beginPath();
            ctx.moveTo(x, profundidad);
            ctx.lineTo(x + 14, profundidad - 5);
            ctx.lineTo(x + 28, profundidad + 3);
            ctx.lineTo(x + 20, profundidad + 12);
            ctx.lineTo(x + 4, profundidad + 10);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(x, profundidad, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 18, profundidad + 12);
            ctx.lineTo(x + 30, profundidad + 7);
            ctx.stroke();
        }
    }
    ctx.restore();
}

function mostrarGameOver() {
    estadoJuego.juegoActivo = false;
    document.getElementById('gameover-puntaje').textContent = estadoJuego.puntaje;

    const opcionesParkour = document.getElementById('gameover-opciones-especiales');
    if (!estadoJuego.parkourCompletado) {
        opcionesParkour.classList.remove('oculto');
    } else {
        opcionesParkour.classList.add('oculto');
    }

    mostrarPantalla('pantalla-gameover');
}

function reiniciarNivel() {
    estadoJuego.vidas = CONFIG.VIDAS_INICIALES;
    estadoJuego.puntaje = 0;
    cargarNivel(estadoJuego.nivelActual);
}

// =========================================

