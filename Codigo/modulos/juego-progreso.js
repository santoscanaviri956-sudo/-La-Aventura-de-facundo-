// Este archivo muestra el avance y la victoria.
// FUNCIONES DE VICTORIA
// =========================================
function mostrarProgreso() {
    mostrarPantalla('pantalla-progreso');
    mostrarPartidasUsuario();
}

function continuarProgreso() {
    const partidas = obtenerPartidasUsuario();
    if (partidas[0]) continuarPartida(partidas[0].id);
}

function obtenerPartidasUsuario() {
    const claveUsuario = obtenerClaveUsuarioActual();
    const usuarios = leerUsuarios();
    const usuario = usuarios[claveUsuario];
    if (!usuario) return [];
    usuario.partidas = usuario.partidas && typeof usuario.partidas === 'object' ? usuario.partidas : {};
    return Object.values(usuario.partidas).sort((a, b) => b.guardadoEn.localeCompare(a.guardadoEn));
}

function mostrarPartidasUsuario() {
    const contenedor = document.getElementById('progreso-partidas');
    if (!contenedor) return;
    const partidas = obtenerPartidasUsuario();
    if (partidas.length === 0) {
        contenedor.innerHTML = '<p class="progreso-vacio">NO HAY PARTIDAS GUARDADAS</p>';
        return;
    }
    contenedor.innerHTML = partidas.map((partida, indice) => `
        <article class="tarjeta-partida">
            <h3>${escaparTextoHTML(partida.nombre || 'Sin nombre')}</h3>
            <p>Nivel ${partida.nivelActual}</p>
            <p>Progreso ${partida.progresoPorcentaje}%</p>
            <p>Puntos: ${partida.puntaje}</p>
            <p>Guardado: ${formatearFechaGuardado(partida.guardadoEn)}</p>
            <div class="partida-acciones">
                <button type="button" class="btn-partida" onclick="continuarPartida('${partida.id}')">CONTINUAR</button>
                <button type="button" class="btn-partida btn-partida-eliminar" onclick="eliminarPartida('${partida.id}')">ELIMINAR</button>
            </div>
        </article>
    `).join('');
}

function escaparTextoHTML(texto) {
    return String(texto).replace(/[&<>'"]/g, (caracter) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[caracter]));
}

function guardarPartida() {
    return guardarPartidaConNombre(null);
}

function guardarPartidaConNombre(nombreGuardado) {
    try {
        const claveUsuario = obtenerClaveUsuarioActual();
        const usuarios = leerUsuarios();
        const usuario = usuarios[claveUsuario];
        if (!usuario) return 'usuario';
        usuario.partidas = usuario.partidas && typeof usuario.partidas === 'object' ? usuario.partidas : {};
        const esNuevaPartida = !estadoJuego.partidaActualId;
        if (esNuevaPartida && Object.keys(usuario.partidas).length >= 5) return 'limite';

        const nivel = NIVELES[estadoJuego.nivelActual] || {};
        const nombre = nombreGuardado || '';
        if (!nombre) return 'nombre-requerido';
        const metaActual = typeof meta !== 'undefined' && meta ? meta : null;
        const jugadorActual = typeof jugador !== 'undefined' && jugador ? jugador : null;
        const puntoFinal = metaActual?.x || nivel.ancho || CONFIG.ANCHO_CANVAS;
        const posicionJugador = jugadorActual?.x || 0;
        const id = estadoJuego.partidaActualId || `partida-${Date.now()}`;
        usuario.partidas[id] = {
            id,
            nombre,
            nivelActual: Number(estadoJuego.nivelActual),
            preguntasRespondidas: Number(estadoJuego.preguntasRespondidas) || 0,
            preguntasCorrectas: Number(estadoJuego.preguntasCorrectas) || 0,
            puntaje: Number(estadoJuego.puntaje) || 0,
            vidas: Number(estadoJuego.vidas) || 0,
            tiempoRestante: Number(estadoJuego.tiempoRestante) || 0,
            posicionJugador,
            posicionJugadorY: jugadorActual?.y || 0,
            velocidadX: jugadorActual?.velocidadX || 0,
            velocidadY: jugadorActual?.velocidadY || 0,
            progresoPorcentaje: Math.round(Math.min(100, Math.max(0, (posicionJugador / Math.max(1, puntoFinal)) * 100))),
            estado: estadoJuego.juegoPausado ? 'pausada' : 'guardada',
            guardadoEn: new Date().toISOString()
        };
        usuario.nivelDesbloqueado = Math.max(Number(usuario.nivelDesbloqueado) || 1, 1);
        if (!guardarUsuarios(usuarios)) return 'almacenamiento';
        const usuariosGuardados = leerUsuarios();
        if (!usuariosGuardados[claveUsuario]?.partidas?.[id]) return 'verificacion';
        estadoJuego.partidaActualId = id;
        return true;
    } catch (error) {
        console.error('Error al guardar la partida:', error);
        return `error:${error.message || 'desconocido'}`;
    }
}

function pedirNombrePartida() {
    if (document.getElementById('dialogo-nombre-partida')) return;

    const dialogo = document.createElement('div');
    dialogo.id = 'dialogo-nombre-partida';
    dialogo.className = 'dialogo-nombre-partida';
    dialogo.innerHTML = '<div class="dialogo-nombre-contenido"><h2>GUARDAR PARTIDA</h2><label for="nombre-partida">Nombre de la partida</label><input id="nombre-partida" type="text" maxlength="30" autocomplete="off"><p id="error-nombre-partida" class="error-nombre-partida"></p><div class="dialogo-nombre-acciones"><button type="button" id="confirmar-nombre-partida" class="btn-partida">GUARDAR</button><button type="button" id="cancelar-nombre-partida" class="btn-partida btn-partida-eliminar">CANCELAR</button></div></div>';
    document.body.appendChild(dialogo);

    const entrada = document.getElementById('nombre-partida');
    const error = document.getElementById('error-nombre-partida');
    const cerrar = () => dialogo.remove();
    document.getElementById('cancelar-nombre-partida').onclick = cerrar;
    document.getElementById('confirmar-nombre-partida').onclick = () => {
        const nombre = entrada.value.trim();
        if (!nombre) {
            error.textContent = 'Escribe un nombre para continuar.';
            entrada.focus();
            return;
        }
        cerrar();
        const resultado = guardarPartidaConNombre(nombre.slice(0, 30));
        if (resultado === true) mostrarMensajeProgreso('PARTIDA GUARDADA');
        else if (resultado === 'limite') mostrarMensajeProgreso('LIMITE DE 5 PARTIDAS ALCANZADO');
        else if (resultado === 'usuario') mostrarMensajeProgreso('INICIA SESION PARA GUARDAR');
        else mostrarMensajeProgreso('NO SE PUDO GUARDAR LA PARTIDA');
    };
    entrada.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') document.getElementById('confirmar-nombre-partida').click();
        if (evento.key === 'Escape') cerrar();
    });
    entrada.focus();
}

function cargarPartida(id) {
    return obtenerPartidasUsuario().find((partida) => partida.id === id) || null;
}

function continuarPartida(id) {
    const partida = cargarPartida(id);
    if (!partida) return;
    estadoJuego.partidaActualId = partida.id;
    cargarNivel(partida.nivelActual);
    estadoJuego.puntaje = Number(partida.puntaje) || 0;
    estadoJuego.vidas = Math.min(Math.max(Number(partida.vidas) || 1, 1), CONFIG.VIDAS_INICIALES);
    estadoJuego.preguntasRespondidas = Number(partida.preguntasRespondidas) || 0;
    estadoJuego.preguntasCorrectas = Number(partida.preguntasCorrectas) || 0;
    estadoJuego.tiempoRestante = Math.max(0, Number(partida.tiempoRestante) || CONFIG.TIEMPO_NIVEL);
    if (jugador) {
        jugador.x = Math.max(0, Number(partida.posicionJugador) || 50);
        jugador.y = Number(partida.posicionJugadorY) || NIVELES[estadoJuego.nivelActual].sueloY - jugador.alto;
        jugador.velocidadX = Number(partida.velocidadX) || 0;
        jugador.velocidadY = Number(partida.velocidadY) || 0;
    }
    actualizarHUD();
}

function eliminarPartida(id) {
    const claveUsuario = obtenerClaveUsuarioActual();
    const usuarios = leerUsuarios();
    if (!usuarios[claveUsuario]?.partidas?.[id]) return;
    delete usuarios[claveUsuario].partidas[id];
    guardarUsuarios(usuarios);
    if (estadoJuego.partidaActualId === id) estadoJuego.partidaActualId = null;
    mostrarPartidasUsuario();
}

function formatearFechaGuardado(fecha) {
    const fechaValida = new Date(fecha);
    return Number.isNaN(fechaValida.getTime()) ? 'Sin fecha' : fechaValida.toLocaleString('es-ES');
}

function completarNivel() {
    estadoJuego.juegoActivo = false;
    desbloquearSiguienteNivel(estadoJuego.nivelActual);
    estadoJuego.puntaje += CONFIG.PUNTOS_NIVEL;

    const bonusTiempo = Math.floor(estadoJuego.tiempoRestante * 10);
    estadoJuego.puntaje += bonusTiempo;
    const bonusVidas = estadoJuego.vidas * 50;
    estadoJuego.puntaje += bonusVidas;

    document.getElementById('victoria-puntaje').textContent = estadoJuego.puntaje;
    document.getElementById('victoria-tiempo').textContent = formatearTiempo(CONFIG.TIEMPO_NIVEL - estadoJuego.tiempoRestante);
    document.getElementById('victoria-preguntas').textContent =
        estadoJuego.preguntasCorrectas + '/' + estadoJuego.preguntasRespondidas;

    const pantallaVictoria = document.getElementById('pantalla-victoria');
    const botonCreditos = document.getElementById('btn-creditos-victoria');
    asegurarBotonGuardar();
    const esUltimoNivel = Number(estadoJuego.nivelActual) === 5;
    botonCreditos.classList.toggle('oculto', !esUltimoNivel);
    if (esUltimoNivel) {
        pantallaVictoria.classList.add('juego-finalizado');
        pantallaVictoria.classList.remove('fondo-nivel');
    } else {
        pantallaVictoria.classList.remove('juego-finalizado');
        pantallaVictoria.classList.add('fondo-nivel');
        prepararAnimacionFondoVictoria();
    }

    if (Number(estadoJuego.nivelActual) === 0) {
        mostrarPantalla('pantalla-victoria');
        return;
    }

    mostrarPregunta(() => {
        document.getElementById('victoria-preguntas').textContent =
            estadoJuego.preguntasCorrectas + '/' + estadoJuego.preguntasRespondidas;
        mostrarPantalla('pantalla-victoria');
    });
}

function asegurarBotonGuardar() {
    const menu = document.querySelector('#pantalla-victoria .menu-botones');
    if (!menu || document.getElementById('btn-guardar-victoria')) return;

    const boton = document.createElement('button');
    boton.id = 'btn-guardar-victoria';
    boton.className = 'btn-menu';
    boton.type = 'button';
    boton.onclick = guardarProgreso;
    boton.innerHTML = '<img src="../Recursos Graficos/botones/boton de guardar.png" alt="Guardar progreso">';
    menu.insertBefore(boton, menu.children[1] || null);
}

function guardarProgreso() {
    desbloquearSiguienteNivel(estadoJuego.nivelActual);
    pedirNombrePartida();
}

function mostrarMensajeProgreso(texto) {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-progreso';
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.remove(), 2200);
}

function prepararAnimacionFondoVictoria() {
    const polvo = document.getElementById('particulas-polvo');
    const destellos = document.getElementById('destellos-magicos');

    if (!polvo || !destellos || polvo.childElementCount > 0) return;

    for (let indice = 0; indice < 18; indice++) {
        const particula = document.createElement('span');
        particula.className = 'particula-polvo';
        particula.style.setProperty('--polvo-x', `${12 + Math.random() * 76}%`);
        particula.style.setProperty('--polvo-y', `${20 + Math.random() * 55}%`);
        particula.style.setProperty('--polvo-tamano', `${1 + Math.random() * 2}px`);
        particula.style.setProperty('--polvo-duracion', `${7 + Math.random() * 6}s`);
        particula.style.setProperty('--polvo-retraso', `${-Math.random() * 10}s`);
        polvo.appendChild(particula);
    }

    for (let indice = 0; indice < 4; indice++) {
        const destello = document.createElement('span');
        destello.className = 'destello-magico';
        destello.style.setProperty('--destello-x', `${20 + Math.random() * 65}%`);
        destello.style.setProperty('--destello-y', `${18 + Math.random() * 48}%`);
        destello.style.setProperty('--destello-duracion', `${6 + Math.random() * 5}s`);
        destello.style.setProperty('--destello-retraso', `${-Math.random() * 9}s`);
        destellos.appendChild(destello);
    }
}

function mostrarVictoria() {
    estadoJuego.juegoActivo = false;
    const pantallaVictoria = document.getElementById('pantalla-victoria');
    document.getElementById('btn-creditos-victoria').classList.add('oculto');
    pantallaVictoria.classList.remove('juego-finalizado', 'fondo-nivel');
    document.getElementById('victoria-puntaje').textContent = estadoJuego.puntaje;
    document.getElementById('victoria-tiempo').textContent = '01:00';
    document.getElementById('victoria-preguntas').textContent = '¡Parkour Completado!';
    mostrarPantalla('pantalla-victoria');
}

function siguienteNivel() {
    const siguienteNivelNum = estadoJuego.nivelActual + 1;
    if (siguienteNivelNum <= 5) {
        estadoJuego.vidas = Math.min(estadoJuego.vidas + 1, CONFIG.VIDAS_INICIALES);
        estadoJuego.partidaActualId = null;
        cargarNivel(siguienteNivelNum);
    } else {
        alert('¡Felicitaciones! Has completado todos los niveles de La Aventura de Facundo');
        volverAlMenu();
    }
}

// =========================================
