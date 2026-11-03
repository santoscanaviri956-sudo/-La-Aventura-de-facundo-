// Este archivo inicia el juego.
// Arranca los controles, espera las vistas y muestra el menú inicial.
document.addEventListener('DOMContentLoaded', async () => {
    configurarOrientacionMovil();
    await vistasListas;
    configurarControles(teclas, {
        estaActivo: () => estadoJuego.juegoActivo,
        estaPausado: () => estadoJuego.juegoPausado,
        pausar: pausarJuego,
        reanudar: reanudarJuego
    });
    configurarMusica();
    configurarSonidos();
    mostrarPantalla(obtenerUsuarioActual() ? 'pantalla-menu' : 'pantalla-acceso');
    await cargarTodasLasImagenes();
});
