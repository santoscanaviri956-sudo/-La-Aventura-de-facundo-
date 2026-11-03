// Este archivo controla el teclado y los botones.
// Conecta teclado, botones táctiles y ratón con el estado de las teclas.
function configurarControles(teclas, acciones) {
    document.addEventListener('keydown', (evento) => {
        if (estadoJuego.enCuentaRegresiva) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(evento.key)) {
                evento.preventDefault();
            }
            return;
        }
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

    function configurarBotonControl(id, tecla, etiqueta) {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.setAttribute('aria-label', etiqueta);
        const punterosActivos = new Set();
        const activar = (evento) => {
            evento.preventDefault();
            if (estadoJuego.enCuentaRegresiva) return;
            punterosActivos.add(evento.pointerId);
            teclas[tecla] = true;
            if (evento.isTrusted && boton.setPointerCapture) {
                boton.setPointerCapture(evento.pointerId);
            }
        };
        const desactivar = (evento) => {
            evento.preventDefault();
            if (!punterosActivos.delete(evento.pointerId)) return;
            teclas[tecla] = punterosActivos.size > 0;
        };

        boton.addEventListener('pointerdown', activar);
        boton.addEventListener('pointerup', desactivar);
        boton.addEventListener('pointercancel', desactivar);
        boton.addEventListener('lostpointercapture', desactivar);
    }

    configurarBotonControl('btn-izquierda', 'ArrowLeft', 'Mover a la izquierda');
    configurarBotonControl('btn-derecha', 'ArrowRight', 'Mover a la derecha');
    configurarBotonControl('btn-saltar', ' ', 'Saltar');
    configurarBotonControl('btn-izquierda-parkour', 'ArrowLeft', 'Mover a la izquierda');
    configurarBotonControl('btn-derecha-parkour', 'ArrowRight', 'Mover a la derecha');
    configurarBotonControl('btn-saltar-parkour', ' ', 'Saltar');

    window.addEventListener('blur', () => {
        teclas.ArrowLeft = false;
        teclas.ArrowRight = false;
        teclas[' '] = false;
    });
}
