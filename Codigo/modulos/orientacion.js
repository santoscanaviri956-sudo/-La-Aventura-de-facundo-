// Solicita orientación horizontal en móviles y deja que el navegador la aplique tras un gesto.
let modoHorizontalSolicitado = false;
let avisoOrientacionNotificado = false;

function configurarOrientacionMovil() {
    const esDispositivoTactil = navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
    if (!esDispositivoTactil) return;

    document.body.classList.add('dispositivo-movil');
    document.addEventListener('pointerdown', solicitarModoHorizontal, true);
    document.addEventListener('keydown', solicitarModoHorizontal, true);
    solicitarModoHorizontal();
}

async function solicitarModoHorizontal() {
    if (modoHorizontalSolicitado) return;

    const apiOrientacion = screen.orientation;
    if (!apiOrientacion?.lock) {
        notificarOrientacionNoDisponible();
        return;
    }

    const pantallaCompleta = document.fullscreenElement
        ? Promise.resolve()
        : document.documentElement.requestFullscreen
            ? document.documentElement.requestFullscreen().catch((error) => {
                if (error.name !== 'NotAllowedError' && error.name !== 'TypeError') {
                    console.error('No se pudo activar la pantalla completa.', error);
                }
            })
            : Promise.resolve();

    try {
        await pantallaCompleta;
        await apiOrientacion.lock('landscape');
        modoHorizontalSolicitado = true;
    } catch (error) {
        if (error.name === 'NotAllowedError' || error.name === 'SecurityError' || error.name === 'TypeError') {
            notificarOrientacionNoDisponible();
        } else {
            console.error('No se pudo cambiar la orientación del dispositivo.', error);
        }
    }
}

function notificarOrientacionNoDisponible() {
    if (avisoOrientacionNotificado) return;
    avisoOrientacionNotificado = true;
    console.warn('El navegador no permite cambiar automáticamente la orientación; gira el dispositivo para continuar.');
}
