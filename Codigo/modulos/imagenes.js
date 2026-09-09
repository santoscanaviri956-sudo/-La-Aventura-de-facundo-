// Este archivo carga las imagenes.
// Catálogo de imágenes cargadas y utilidades para resolver sus rutas.
const IMAGENES = {};
let imagenesCargadas = 0;
let totalImagenes = 0;

function cargarImagen(nombre, src) {
    return new Promise((resolve) => {
        const imagen = new Image();
        imagen.onload = () => {
            IMAGENES[nombre] = imagen;
            imagenesCargadas++;
            resolve(imagen);
        };
        imagen.onerror = () => {
            console.warn('No se pudo cargar: ' + src);
            imagenesCargadas++;
            resolve(null);
        };
        const ruta = src.startsWith('Recursos Graficos/')
            ? '../' + src
            : src;
        imagen.src = ruta;
        totalImagenes++;
    });
}

async function cargarTodasLasImagenes() {
    await cargarImagen('personaje', 'Recursos Graficos/personajes/personaje principal.png');

    await cargarImagen('fondo1', 'Recursos Graficos/fondos/fondo de nivel 1.png');
    await cargarImagen('fondo2', 'Recursos Graficos/fondos/fondo de nivel 2.png');
    await cargarImagen('fondo3', 'Recursos Graficos/fondos/fondo de nivel 3.png');
    await cargarImagen('fondo4', 'Recursos Graficos/fondos/fondo de nivel 4.png');
    await cargarImagen('fondo5', 'Recursos Graficos/fondos/fondo de nivel 5.png');
    await cargarImagen('fondoMenu', 'Recursos Graficos/fondos/fondo de prototipo.png');

    await cargarImagen('arbol', 'Recursos Graficos/arbol.png');
    await cargarImagen('arbusto', 'Recursos Graficos/arbusto del video juego.png');
    await cargarImagen('nubes', 'Recursos Graficos/elementos/nubes del video juego.png');
    await cargarImagen('cuboPreguntas', 'Recursos Graficos/elementos/cubo de preguntas.png');
    await cargarImagen('cuboPreguntas2', 'Recursos Graficos/elementos/cubodepregunta.png');

    await cargarImagen('botonSistemaPregunta', 'Recursos Graficos/botones/boton de sistema de pregunta.png');

    await cargarImagen('resultadoFinal', 'Recursos Graficos/interfaz/pantalla de resultado final.png');
    await cargarImagen('informacion', 'Recursos Graficos/interfaz/informacion.png');

    console.log('Imagenes cargadas: ' + imagenesCargadas + '/' + totalImagenes);
}
