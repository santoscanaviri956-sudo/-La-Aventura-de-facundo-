// Este archivo controla el teclado y los botones.
// Conecta teclado, botones táctiles y ratón con el estado de las teclas.
function configurarControles(teclas, acciones) {
    document.addEventListener('keydown', (evento) => {
        teclas[evento.key] = true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(evento.key)) {
            evento.preventDefault();
        }
        if (evento.key === 'Escape' && acciones.estaActivo()) {
            if (acciones.estaPausado()) {
                acciones.reanudar();
            } else {
                acciones.pausar();
            }
        }
    });

    document.addEventListener('keyup', (evento) => {
        teclas[evento.key] = false;
    });

    function configurarBotonControl(id, tecla) {
        const boton = document.getElementById(id);
        if (!boton) return;

        const activar = (evento) => {
            evento.preventDefault();
            teclas[tecla] = true;
        };
        const desactivar = (evento) => {
            evento.preventDefault();
            teclas[tecla] = false;
        };

        boton.addEventListener('touchstart', activar, { passive: false });
        boton.addEventListener('touchend', desactivar, { passive: false });
        boton.addEventListener('touchcancel', desactivar, { passive: false });
        boton.addEventListener('mousedown', activar);
        boton.addEventListener('mouseup', desactivar);
        boton.addEventListener('mouseleave', () => {
            teclas[tecla] = false;
        });
    }

    configurarBotonControl('btn-izquierda', 'ArrowLeft');
    configurarBotonControl('btn-derecha', 'ArrowRight');
    configurarBotonControl('btn-saltar', ' ');
    configurarBotonControl('btn-izquierda-parkour', 'ArrowLeft');
    configurarBotonControl('btn-derecha-parkour', 'ArrowRight');
    configurarBotonControl('btn-saltar-parkour', ' ');
}
