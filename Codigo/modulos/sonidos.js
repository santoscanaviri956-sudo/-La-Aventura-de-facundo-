// Efecto corto para los botones, generado con Web Audio para no depender de otro archivo.
let contextoSonidos;
let tipoAudioNoDisponibleNotificado = false;

function configurarSonidos() {
    document.addEventListener('pointerover', (evento) => {
        if (evento.pointerType !== 'mouse') return;

        const objetivo = evento.target;
        if (!(objetivo instanceof Element)) return;

        const boton = objetivo.closest('button');
        if (!boton || boton.disabled || boton.contains(evento.relatedTarget)) return;

        reproducirSonidoBoton();
    });

    document.addEventListener('click', (evento) => {
        const objetivo = evento.target;
        if (!(objetivo instanceof Element)) return;

        const boton = objetivo.closest('button');
        if (!boton || boton.disabled) return;

        reproducirSonidoBoton();
    }, true);
}

function reproducirSonidoBoton() {
    if (!estadoJuego.sonidoActivo || estadoJuego.volumen <= 0) return;

    const ConstructorAudio = window.AudioContext || window.webkitAudioContext;
    if (!ConstructorAudio) {
        if (!tipoAudioNoDisponibleNotificado) {
            console.error('Este navegador no admite efectos de sonido Web Audio.');
            tipoAudioNoDisponibleNotificado = true;
        }
        return;
    }

    contextoSonidos = contextoSonidos || new ConstructorAudio();
    const contexto = contextoSonidos;
    const reproducirTono = () => {
        const ahora = contexto.currentTime;
        const oscilador = contexto.createOscillator();
        const volumen = contexto.createGain();

        oscilador.type = 'sine';
        oscilador.frequency.setValueAtTime(880, ahora);
        oscilador.frequency.exponentialRampToValueAtTime(520, ahora + 0.045);
        volumen.gain.setValueAtTime(0.0001, ahora);
        volumen.gain.exponentialRampToValueAtTime((estadoJuego.volumen / 100) * 0.12, ahora + 0.006);
        volumen.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.055);

        oscilador.connect(volumen);
        volumen.connect(contexto.destination);
        oscilador.start(ahora);
        oscilador.stop(ahora + 0.06);
    };

    if (contexto.state === 'suspended') {
        contexto.resume().then(reproducirTono).catch((error) => {
            if (error.name !== 'NotAllowedError') {
                console.error('No se pudo habilitar el efecto de sonido.', error);
            }
        });
        return;
    }

    reproducirTono();
}
