// Este archivo muestra y revisa las respuestas.
// FUNCIONES DE PREGUNTAS
// =========================================
function mostrarPregunta() {
    estadoJuego.juegoPausado = true;

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

    const titulo = document.querySelector('.pregunta-titulo');
    titulo.textContent = '¿PREGUNTA?';

    mostrarPantalla('pantalla-pregunta');
    ajustarTextoAlMarco(textoPregunta);
}

function ajustarTextoAlMarco(textoPregunta) {
    textoPregunta.style.fontSize = '';

    requestAnimationFrame(() => {
        const tamanoMaximo = 18;
        const tamanoMinimo = 12;
        let tamano = tamanoMaximo;

        textoPregunta.style.fontSize = `${tamano}px`;
        while (textoPregunta.scrollWidth > textoPregunta.clientWidth && tamano > tamanoMinimo) {
            tamano -= 0.5;
            textoPregunta.style.fontSize = `${tamano}px`;
        }
    });
}

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta, explicacion, opciones) {
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
        document.querySelector('.pregunta-contenedor').style.borderColor = '#4caf50';
    } else {
        resultadoDiv.classList.add('incorrecta');
        resultadoTexto.innerHTML = 'INCORRECTO<br>' + explicacion + '<br><small>Respuesta correcta: ' + opciones[respuestaCorrecta] + '</small>';
        document.querySelector('.pregunta-contenedor').style.borderColor = '#f44336';
    }

    estadoJuego.preguntasRespondidas++;

    setTimeout(() => {
        document.querySelector('.pregunta-contenedor').style.borderColor = '#ffd700';
        mostrarPantalla('pantalla-juego');
        estadoJuego.juegoPausado = false;
        bucleDelJuego();
    }, 3500);
}

// =========================================

