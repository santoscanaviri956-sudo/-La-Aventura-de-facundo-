// Este archivo inicia el juego.
// Arranca los controles, espera las vistas y muestra el menú inicial.
document.addEventListener('DOMContentLoaded', async () => {
    configurarControles(teclas, {
        estaActivo: () => estadoJuego.juegoActivo,
        estaPausado: () => estadoJuego.juegoPausado,
        pausar: pausarJuego,
        reanudar: reanudarJuego
    });
    await vistasListas;
    mostrarPantalla('pantalla-menu');
    await cargarTodasLasImagenes();
});
