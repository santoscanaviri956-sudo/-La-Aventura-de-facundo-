// Este archivo muestra y revisa las respuestas.
// FUNCIONES DE PREGUNTAS
// =========================================
let accionDespuesDePregunta = null;
let preguntaActualEsDeCubo = false;
let preguntaActualRespondida = false;
let temporizadorPregunta = null;
let tiempoRestantePregunta = 30;
let preguntaPendienteDeOrientacion = null;

function detenerTemporizadorPregunta() {
    if (temporizadorPregunta !== null) {
        clearInterval(temporizadorPregunta);
        temporizadorPregunta = null;
    }
}

function mostrarPregunta(accionAlCompletar = null, esPreguntaDeCubo = false) {
    detenerTemporizadorPregunta();
    estadoJuego.juegoPausado = true;
    accionDespuesDePregunta = accionAlCompletar;
    preguntaActualEsDeCubo = esPreguntaDeCubo;
    preguntaActualRespondida = false;

    let preguntaIndex;
    do {
        preguntaIndex = Math.floor(Math.random() * PREGUNTAS.length);
    } while (estadoJuego.ultimasPreguntas.includes(preguntaIndex) && PREGUNTAS.length > 3);

    estadoJuego.ultimasPreguntas.push(preguntaIndex);
    if (estadoJuego.ultimasPreguntas.length > 2) {
        estadoJuego.ultimasPreguntas.shift();
    }

    const pregunta = PREGUNTAS[preguntaIndex];

    const textoPregunta = document.getElementById('pregunta-texto');
    const contenedorPregunta = document.querySelector('.pregunta-contenedor');
    const pantallaPregunta = document.getElementById('pantalla-pregunta');
    textoPregunta.textContent = pregunta.pregunta;
    const orientacion = document.getElementById('pregunta-orientacion');
    const orientacionTexto = document.getElementById('orientacion-texto');
    const preguntaContenido = document.getElementById('pregunta-contenido');
    const mostrarOrientacion = esPreguntaDeCubo && Boolean(pregunta.orientacion);
    preguntaPendienteDeOrientacion = mostrarOrientacion ? pregunta : null;
    contenedorPregunta.classList.toggle('orientacion-activa', mostrarOrientacion);
    orientacion.classList.toggle('oculto', !mostrarOrientacion);
    preguntaContenido.classList.toggle('oculto', mostrarOrientacion);
    orientacionTexto.textContent = mostrarOrientacion ? pregunta.orientacion : '';
    const nivel = Math.min(Math.max(Number(estadoJuego.nivelActual) || 1, 1), 5);
    const largoPregunta = pregunta.pregunta.length;

    contenedorPregunta.classList.remove('marco-corto', 'marco-medio', 'marco-largo');
    textoPregunta.classList.remove('marco-corto', 'marco-medio', 'marco-largo');
    pantallaPregunta.classList.remove('nivel-1', 'nivel-2', 'nivel-3', 'nivel-4', 'nivel-5');
    pantallaPregunta.classList.add(`nivel-${nivel}`);

    const tamanoMarco = largoPregunta > 105 ? 'marco-largo' : largoPregunta > 65 ? 'marco-medio' : 'marco-corto';
    contenedorPregunta.classList.add(tamanoMarco);
    textoPregunta.classList.add(tamanoMarco);

    const opcionesContainer = document.getElementById('pregunta-opciones');
    opcionesContainer.innerHTML = '';

    pregunta.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcion';
        btn.style.animationDelay = (index * 0.1) + 's';

        const textoOpcion = document.createElement('span');
        textoOpcion.className = 'texto-opcion';
        textoOpcion.textContent = opcion;
        btn.appendChild(textoOpcion);

        btn.onclick = () => verificarRespuesta(index, pregunta.correcta, pregunta.explicacion, pregunta.opciones);
        opcionesContainer.appendChild(btn);
    });

    document.getElementById('pregunta-resultado').classList.add('oculto');

    const titulo = document.querySelector('#pregunta-contenido .pregunta-titulo');
    titulo.textContent = '¿PREGUNTA?';

    mostrarPantalla('pantalla-pregunta');
    if (mostrarOrientacion) {
        const temporizadorTexto = document.getElementById('pregunta-temporizador');
        if (temporizadorTexto) temporizadorTexto.remove();
        return;
    }

    iniciarTemporizadorPregunta(pregunta);
    ajustarTextoAlMarco(textoPregunta);
}

function continuarDesdeOrientacion() {
    if (!preguntaPendienteDeOrientacion) return;

    document.querySelector('.pregunta-contenedor').classList.remove('orientacion-activa');
    document.getElementById('pregunta-orientacion').classList.add('oculto');
    document.getElementById('pregunta-contenido').classList.remove('oculto');
    ajustarTextoAlMarco(document.getElementById('pregunta-texto'));
    iniciarTemporizadorPregunta(preguntaPendienteDeOrientacion);
    preguntaPendienteDeOrientacion = null;
}

function iniciarTemporizadorPregunta(pregunta) {
    let temporizadorTexto = document.getElementById('pregunta-temporizador');
    if (!temporizadorTexto) {
        temporizadorTexto = document.createElement('div');
        temporizadorTexto.id = 'pregunta-temporizador';
        temporizadorTexto.className = 'pregunta-temporizador';
        temporizadorTexto.setAttribute('role', 'timer');
        temporizadorTexto.setAttribute('aria-live', 'off');
        document.body.appendChild(temporizadorTexto);
    }
    tiempoRestantePregunta = 30;
    temporizadorTexto.textContent = 'TIEMPO: 30';
    temporizadorTexto.classList.remove('pregunta-temporizador-urgente');

    temporizadorPregunta = setInterval(() => {
        tiempoRestantePregunta--;
        temporizadorTexto.textContent = `TIEMPO: ${tiempoRestantePregunta}`;
        if (tiempoRestantePregunta <= 10) {
            temporizadorTexto.classList.add('pregunta-temporizador-urgente');
        }
        if (tiempoRestantePregunta <= 0) {
            detenerTemporizadorPregunta();
            verificarRespuesta(-1, pregunta.correcta, pregunta.explicacion, pregunta.opciones, true);
        }
    }, 1000);
}

function ajustarTextoAlMarco(textoPregunta) {
    textoPregunta.style.fontSize = '';

    requestAnimationFrame(() => {
        const tamanoMaximo = 12;
        const tamanoMinimo = 7;
        let tamano = tamanoMaximo;

        textoPregunta.style.fontSize = `${tamano}px`;
        while (
            (textoPregunta.scrollWidth > textoPregunta.clientWidth ||
                textoPregunta.scrollHeight > textoPregunta.clientHeight) &&
            tamano > tamanoMinimo
        ) {
            tamano -= 0.5;
            textoPregunta.style.fontSize = `${tamano}px`;
        }
    });
}

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta, explicacion, opciones, tiempoAgotado = false) {
    if (preguntaActualRespondida) return;
    preguntaActualRespondida = true;
    detenerTemporizadorPregunta();

    const esPreguntaDeCubo = preguntaActualEsDeCubo;
    const botones = document.querySelectorAll('.btn-opcion');
    const resultadoDiv = document.getElementById('pregunta-resultado');
    const resultadoTexto = document.getElementById('resultado-texto');

    botones.forEach((btn, index) => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';

        if (index === respuestaCorrecta) {
            btn.classList.add('correcta');
        }
        if (index === respuestaSeleccionada && respuestaSeleccionada !== respuestaCorrecta) {
            btn.classList.add('incorrecta');
        }
    });

    resultadoDiv.classList.remove('oculto');
    resultadoDiv.className = 'pregunta-resultado';

    if (respuestaSeleccionada === respuestaCorrecta) {
        resultadoDiv.classList.add('correcta');
        resultadoTexto.innerHTML = '¡CORRECTO! +' + CONFIG.PUNTOS_PREGUNTA + ' puntos<br><small>' + explicacion + '</small>';
        estadoJuego.puntaje += CONFIG.PUNTOS_PREGUNTA;
        estadoJuego.preguntasCorrectas++;
        if (esPreguntaDeCubo) estadoJuego.preguntasCubosCorrectasNivel++;
        document.querySelector('.pregunta-contenedor').style.borderColor = '#4caf50';
    } else {
        resultadoDiv.classList.add('incorrecta');
        const mensaje = tiempoAgotado ? '¡SE ACABÓ EL TIEMPO!' : 'INCORRECTO';
        resultadoTexto.innerHTML = mensaje + '<br>' + explicacion + '<br><small>Respuesta correcta: ' + opciones[respuestaCorrecta] + '</small>';
        document.querySelector('.pregunta-contenedor').style.borderColor = '#f44336';
    }

    estadoJuego.preguntasRespondidas++;
    if (esPreguntaDeCubo) estadoJuego.preguntasCubosRespondidasNivel++;

    setTimeout(() => {
        const temporizadorTexto = document.getElementById('pregunta-temporizador');
        if (temporizadorTexto) temporizadorTexto.remove();
        document.querySelector('.pregunta-contenedor').style.borderColor = '#ffd700';
        preguntaActualEsDeCubo = false;
        const totalCubosDelNivel = NIVELES[estadoJuego.nivelActual]?.bloquesMisteriosos.length || 0;
        const respondioTodosLosCubos = esPreguntaDeCubo &&
            estadoJuego.preguntasCubosRespondidasNivel >= totalCubosDelNivel;
        const falloTodasLasPreguntasDeCubos = respondioTodosLosCubos &&
            estadoJuego.preguntasCubosCorrectasNivel === 0;

        if (falloTodasLasPreguntasDeCubos) {
            accionDespuesDePregunta = null;
            estadoJuego.juegoPausado = false;
            estadoJuego.vidas--;
            actualizarVidasHUD();

            if (estadoJuego.vidas <= 0) {
                mostrarGameOver();
                return;
            }

            const nivelActual = estadoJuego.nivelActual;
            mostrarMensajeProgreso('Fallaste todas las preguntas. Pierdes una vida y repites el nivel.');
            cargarNivel(nivelActual, true);
            return;
        }

        if (accionDespuesDePregunta) {
            const accion = accionDespuesDePregunta;
            accionDespuesDePregunta = null;
            estadoJuego.juegoPausado = false;
            accion();
            return;
        }

        mostrarPantalla('pantalla-juego');
        estadoJuego.juegoPausado = false;
        bucleDelJuego();
    }, 3500);
}

// =========================================
