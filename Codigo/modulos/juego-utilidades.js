// Este archivo contiene funciones pequenas que se reutilizan.
// UTILIDADES
// =========================================
function dibujarImagenSegura(contexto, imagen, ...argumentos) {
    if (!imagen || !imagen.complete || !imagen.naturalWidth) return false;
    try {
        contexto.drawImage(imagen, ...argumentos);
        return true;
    } catch (error) {
        return false;
    }
}

function formatearTiempo(segundos) {
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

function actualizarHUD() {
    actualizarVidasHUD();
    document.getElementById('hud-puntaje-texto').textContent = estadoJuego.puntaje;
    document.getElementById('hud-tiempo-texto').textContent = formatearTiempo(estadoJuego.tiempoRestante);
}

function actualizarVidasHUD() {
    document.querySelectorAll('.corazones-vida').forEach((contenedor) => {
        contenedor.querySelectorAll('.corazon').forEach((corazon, indice) => {
            corazon.classList.toggle('perdido', indice >= estadoJuego.vidas);
        });
    });
}

function crearEfectoEliminacion(x, y) {
    const particulas = [];
    for (let i = 0; i < 10; i++) {
        particulas.push({
            x: x,
            y: y,
            velocidadX: (Math.random() - 0.5) * 12,
            velocidadY: (Math.random() - 0.5) * 12,
            vida: 30,
            color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#fff'][Math.floor(Math.random() * 4)]
        });
    }

    function animar() {
        particulas.forEach((p, index) => {
            p.x += p.velocidadX;
            p.y += p.velocidadY;
            p.vida--;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.vida / 30;
            ctx.fillRect(p.x, p.y, 5, 5);
            ctx.globalAlpha = 1;
            if (p.vida <= 0) particulas.splice(index, 1);
        });
        if (particulas.length > 0) requestAnimationFrame(animar);
    }
    animar();
}

function dibujarObstaculo(contexto, obstaculo) {
    const { x, y, ancho, alto, tipo } = obstaculo;
    contexto.save();

    if (tipo === 'pinchos') {
        contexto.fillStyle = '#dbeafe';
        contexto.strokeStyle = '#1e3a8a';
        contexto.lineWidth = 2;
        for (let posicion = x; posicion < x + ancho; posicion += 12) {
            contexto.beginPath();
            contexto.moveTo(posicion, y + alto);
            contexto.lineTo(posicion + 6, y + 8);
            contexto.lineTo(posicion + 12, y + alto);
            contexto.closePath();
            contexto.fill();
            contexto.stroke();
        }
    } else if (tipo === 'piedras') {
        contexto.fillStyle = '#64748b';
        contexto.strokeStyle = '#1e293b';
        contexto.lineWidth = 3;
        contexto.beginPath();
        contexto.moveTo(x, y + alto);
        contexto.lineTo(x + 12, y + 8);
        contexto.lineTo(x + ancho - 16, y);
        contexto.lineTo(x + ancho, y + alto);
        contexto.closePath();
        contexto.fill();
        contexto.stroke();
    } else if (tipo === 'tronco') {
        contexto.fillStyle = '#92400e';
        contexto.fillRect(x + 8, y, ancho - 16, alto);
        contexto.strokeStyle = '#451a03';
        contexto.lineWidth = 4;
        contexto.strokeRect(x + 8, y, ancho - 16, alto);
        contexto.fillStyle = '#f59e0b';
        contexto.beginPath();
        contexto.arc(x + ancho / 2, y + 8, 8, 0, Math.PI * 2);
        contexto.fill();
    } else if (tipo === 'fuego') {
        contexto.fillStyle = '#f97316';
        contexto.fillRect(x, y + alto - 8, ancho, 8);
        contexto.fillStyle = '#facc15';
        for (let posicion = x + 8; posicion < x + ancho; posicion += 18) {
            contexto.beginPath();
            contexto.moveTo(posicion - 8, y + alto - 8);
            contexto.lineTo(posicion, y + 8);
            contexto.lineTo(posicion + 8, y + alto - 8);
            contexto.closePath();
            contexto.fill();
        }
    } else {
        contexto.fillStyle = '#475569';
        contexto.fillRect(x, y, ancho, alto);
    }

    contexto.restore();
}


