// Este archivo carga las pantallas del juego.
// Ajusta las rutas de imágenes que proceden de las vistas HTML externas.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[src^="Recursos Graficos/"]').forEach((imagen) => {
        const src = imagen.getAttribute('src');
        if (src && !src.startsWith('../')) {
            imagen.src = '../' + src;
        }
    });
});

// Copia local de las vistas para que index.html también funcione con file://.
const vistasEmbebidas = {
    'menu.html': `<div id="pantalla-menu" class="pantalla activa">
    <div class="pantalla-contenido">
        <img src="../Recursos Graficos/interfaz/logo la aventura de facundo.png" alt="Logo" class="logo-principal">
        <div class="menu-botones">
            <button type="button" class="btn-menu" onclick="mostrarPantalla('pantalla-niveles')"><img src="../Recursos Graficos/botones/boton jugar.png" alt="Jugar"></button>
            <button type="button" class="btn-menu" onclick="mostrarPantalla('pantalla-opciones')"><img src="../Recursos Graficos/botones/boton opciones.png" alt="Opciones"></button>
            <button type="button" class="btn-menu" onclick="mostrarPantalla('pantalla-creditos')"><img src="../Recursos Graficos/botones/boton creditos.png" alt="Creditos"></button>
        </div>
    </div>
</div>`,
    'opciones.html': `<div id="pantalla-opciones" class="pantalla"><div class="pantalla-contenido"><h2 class="titulo-pantalla">OPCIONES</h2><div class="opciones-contenedor"><div class="opcion-fila"><span class="opcion-label">Sonido</span><button id="btn-sonido" class="btn-toggle" onclick="toggleSonido()">ON</button></div><div class="opcion-fila"><span class="opcion-label">Musica</span><button id="btn-musica" class="btn-toggle" onclick="toggleMusica()">ON</button></div><div class="opcion-fila"><span class="opcion-label">Volumen</span><input type="range" id="volumen" min="0" max="100" value="70" class="slider-volumen"></div></div><button class="btn-volver" onclick="mostrarPantalla('pantalla-menu')"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Volver"></button></div></div>`,
    'creditos.html': `<div id="pantalla-creditos" class="pantalla"><div class="creditos-efectos" aria-hidden="true"><span class="destello-marco destello-marco-1"></span><span class="destello-marco destello-marco-2"></span><span class="destello-marco destello-marco-3"></span><span class="destello-marco destello-marco-4"></span><span class="brillo-lampara"></span><span class="brillo-pluma"></span><span class="brillo-titulo"></span><div id="particulas-creditos"></div></div><button class="btn-volver" onclick="mostrarPantalla('pantalla-menu')"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Volver"></button></div>`,
    'niveles.html': `<div id="pantalla-niveles" class="pantalla"><div class="pantalla-contenido"><h2 class="titulo-pantalla">SELECCIONA UN NIVEL</h2><div class="niveles-grid"><button type="button" class="btn-nivel" data-nivel="1" onclick="seleccionarNivel(1)"><img class="nivel-imagen" src="../Recursos Graficos/botones/boton de nivel 1.png" alt="Nivel 1: La Ciudad"></button><button type="button" class="btn-nivel" data-nivel="2" onclick="seleccionarNivel(2)"><img class="nivel-imagen" src="../Recursos Graficos/botones/boton de nivel 2.png" alt="Nivel 2: El Camino"></button><button type="button" class="btn-nivel" data-nivel="3" onclick="seleccionarNivel(3)"><img class="nivel-imagen" src="../Recursos Graficos/botones/boton del nivel 3.png" alt="Nivel 3: La Manga"></button><button type="button" class="btn-nivel" data-nivel="4" onclick="seleccionarNivel(4)"><img class="nivel-imagen" src="../Recursos Graficos/botones/boton de nivel 4.png" alt="Nivel 4: El Mondonguero"></button><button type="button" class="btn-nivel" data-nivel="5" onclick="seleccionarNivel(5)"><img class="nivel-imagen" src="../Recursos Graficos/botones/boton de nivel 5.png" alt="Nivel 5: El Desenlace"></button></div><button type="button" class="btn-volver" onclick="volverDesdeNiveles()"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Volver"></button></div></div>`,
    'juego.html': `<div id="pantalla-juego" class="pantalla"><div class="juego-contenedor"><div class="hud"><div class="hud-izquierda"><div class="hud-vida"><span class="corazones-vida" id="hud-corazones"><span class="corazon">&#9829;</span><span class="corazon">&#9829;</span><span class="corazon">&#9829;</span></span></div><div class="hud-puntaje"><span class="hud-icono-generado icono-puntaje">&#9733;</span><span id="hud-puntaje-texto">0</span></div></div><div class="hud-derecha"><div class="hud-tiempo"><span class="hud-icono-generado icono-tiempo">&#9201;</span><span id="hud-tiempo-texto">03:00</span></div><button class="btn-pausa" onclick="pausarJuego()">||</button></div></div><canvas id="canvas-juego"></canvas><div class="controles-moviles"><div class="controles-moviles-izquierda"><button class="btn-control" id="btn-izquierda" data-direccion="izquierda"></button><button class="btn-control" id="btn-derecha" data-direccion="derecha"></button></div><div class="controles-moviles-derecha"><button class="btn-control btn-saltar" id="btn-saltar"></button></div></div></div></div>`,
    'pregunta.html': `<div id="pantalla-pregunta" class="pantalla"><div class="pantalla-contenido"><div class="pregunta-contenedor"><h2 class="pregunta-titulo">BLOQUE MISTERIOSO!</h2><p id="pregunta-texto" class="pregunta-texto"></p><div id="pregunta-opciones" class="pregunta-opciones"></div><div id="pregunta-resultado" class="pregunta-resultado oculto"><p id="resultado-texto"></p></div></div></div></div>`,
    'pausa.html': `<div id="pantalla-pausa" class="pantalla"><div class="pantalla-contenido"><h2 class="titulo-pantalla">PAUSA</h2><div class="menu-botones"><button class="btn-menu" onclick="reanudarJuego()"><img src="../Recursos Graficos/botones/boton jugar.png" alt="Reanudar"></button><button class="btn-menu" onclick="volverAlMenu()"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Menu"></button></div></div></div>`,
    'gameover.html': `<div id="pantalla-gameover" class="pantalla"><div class="pantalla-contenido"><h2 class="titulo-pantalla gameover-titulo">GAME OVER</h2><div class="gameover-contenido"><p class="gameover-texto">Se han acabado las vidas!</p><p class="gameover-puntaje">Puntaje final: <span id="gameover-puntaje">0</span></p><div id="gameover-opciones-especiales" class="gameover-opciones oculto"><p class="gameover-texto">Tienes una oportunidad especial</p><button class="btn-menu" onclick="iniciarNivelParkour()"><img src="../Recursos Graficos/botones/boton jugar.png" alt="Parkour"></button></div></div><div class="menu-botones"><button class="btn-menu" onclick="reiniciarNivel()"><img src="../Recursos Graficos/botones/boton jugar.png" alt="Reintentar"></button><button class="btn-menu" onclick="volverAlMenu()"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Menu"></button></div></div></div>`,
    'victoria.html': `<div id="pantalla-victoria" class="pantalla"><div class="fondo-animado-victoria" aria-hidden="true"><span class="efecto-llama"></span><span class="efecto-paginas"></span><span class="efecto-pluma"></span><span class="luz-escritorio"></span><div id="particulas-polvo"></div><div id="destellos-magicos"></div></div><div class="pantalla-contenido"><div class="victoria-contenido"><div class="victoria-estadisticas"><div class="estadistica"><span class="estadistica-label">Puntaje</span><span id="victoria-puntaje" class="estadistica-valor">0</span></div><div class="estadistica"><span class="estadistica-label">Tiempo</span><span id="victoria-tiempo" class="estadistica-valor">00:00</span></div><div class="estadistica"><span class="estadistica-label">Preguntas</span><span id="victoria-preguntas" class="estadistica-valor">0/3</span></div></div></div><div class="menu-botones"><button class="btn-menu" onclick="siguienteNivel()"><img src="../Recursos Graficos/botones/boton jugar.png" alt="Siguiente"></button><button id="btn-creditos-victoria" class="btn-menu" onclick="mostrarPantalla('pantalla-creditos')"><img src="../Recursos Graficos/botones/boton creditos.png" alt="Creditos"></button><button class="btn-menu" onclick="volverAlMenu()"><img src="../Recursos Graficos/botones/boton de volver.png" alt="Menu"></button></div></div></div>`,
    'parkour.html': `<div id="pantalla-parkour" class="pantalla"><div class="juego-contenedor"><div class="hud"><div class="hud-izquierda"><div class="hud-vida"><span class="corazones-vida" id="hud-corazones-parkour"><span class="corazon">&#9829;</span><span class="corazon">&#9829;</span><span class="corazon">&#9829;</span></span></div><div class="hud-puntaje"><span class="hud-icono-generado icono-puntaje">&#9733;</span><span id="hud-puntaje-parkour">0</span></div></div><div class="hud-derecha"><div class="hud-tiempo"><span class="hud-icono-generado icono-tiempo">&#9201;</span><span id="hud-tiempo-parkour">01:00</span></div></div></div><canvas id="canvas-parkour"></canvas><div class="controles-moviles"><div class="controles-moviles-izquierda"><button class="btn-control" id="btn-izquierda-parkour" data-direccion="izquierda"></button><button class="btn-control" id="btn-derecha-parkour" data-direccion="derecha"></button></div><div class="controles-moviles-derecha"><button class="btn-control btn-saltar" id="btn-saltar-parkour"></button></div></div></div></div>`
};

const vistasListas = cargarVistasHTML();

async function cargarVistasHTML() {
    // En un servidor se leen los fragmentos; en Edge local se usa el respaldo.
    const app = document.getElementById('app');
    const archivos = [
        'menu.html',
        'opciones.html',
        'creditos.html',
        'niveles.html',
        'juego.html',
        'pregunta.html',
        'pausa.html',
        'gameover.html',
        'victoria.html',
        'parkour.html'
    ];

    const vistas = location.protocol === 'file:'
        ? archivos.map((archivo) => vistasEmbebidas[archivo])
        : await Promise.all(archivos.map(async (archivo) => {
            const respuesta = await fetch(`html/${archivo}`);
            if (!respuesta.ok) throw new Error(`No se pudo cargar html/${archivo}`);
            return respuesta.text();
        }));

    app.insertAdjacentHTML('afterbegin', vistas.join(''));
}

function seleccionarNivel(numeroNivel) {
    const pantallaNiveles = document.getElementById('pantalla-niveles');
    const pantallaJuego = document.getElementById('pantalla-juego');

    if (pantallaNiveles) {
        pantallaNiveles.classList.remove('activa');
    }

    if (pantallaJuego) {
        pantallaJuego.classList.add('activa');
    }

    if (typeof cargarNivel === 'function') {
        cargarNivel(numeroNivel);
    }
}

function volverDesdeNiveles() {
    const pantallaNiveles = document.getElementById('pantalla-niveles');
    const pantallaMenu = document.getElementById('pantalla-menu');

    if (pantallaNiveles) {
        pantallaNiveles.classList.remove('activa');
    }

    if (pantallaMenu) {
        pantallaMenu.classList.add('activa');
    }
}

