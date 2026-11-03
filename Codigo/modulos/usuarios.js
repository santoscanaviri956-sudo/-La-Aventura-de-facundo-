// Usuarios locales y sesion activa del jugador.
const CLAVE_USUARIOS = 'aventuraFacundoUsuarios';
const CLAVE_SESION = 'aventuraFacundoSesion';

function leerUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || '{}');
        return usuarios && typeof usuarios === 'object' ? usuarios : {};
    } catch (error) {
        return {};
    }
}

function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        return true;
    } catch (error) {
        return false;
    }
}

function normalizarNombreUsuario(nombre) {
    return String(nombre || '').trim().toLowerCase();
}

function obtenerUsuarioActual() {
    const nombre = normalizarNombreUsuario(localStorage.getItem(CLAVE_SESION));
    if (!nombre) return null;
    return leerUsuarios()[nombre] || null;
}

function obtenerClaveUsuarioActual() {
    return normalizarNombreUsuario(localStorage.getItem(CLAVE_SESION));
}

function registrarUsuario(nombre, clave) {
    const usuario = normalizarNombreUsuario(nombre);
    const usuarios = leerUsuarios();
    if (usuario.length < 3) return { ok: false, mensaje: 'El usuario debe tener al menos 3 caracteres.' };
    if (clave.length < 4) return { ok: false, mensaje: 'La clave debe tener al menos 4 caracteres.' };
    if (usuarios[usuario]) return { ok: false, mensaje: 'Ese usuario ya existe.' };

    usuarios[usuario] = {
        nombre: usuario,
        clave,
        partidas: {},
        nivelDesbloqueado: 1,
        creadoEn: new Date().toISOString()
    };
    if (!guardarUsuarios(usuarios)) {
        return { ok: false, mensaje: 'No se pudo guardar el usuario en este navegador.' };
    }
    try {
        localStorage.setItem(CLAVE_SESION, usuario);
    } catch (error) {
        return { ok: false, mensaje: 'No se pudo iniciar la sesion en este navegador.' };
    }
    return { ok: true };
}

function iniciarSesion(nombre, clave) {
    const usuario = normalizarNombreUsuario(nombre);
    const datos = leerUsuarios()[usuario];
    if (!datos || datos.clave !== clave) {
        return { ok: false, mensaje: 'Usuario o clave incorrectos.' };
    }
    try {
        localStorage.setItem(CLAVE_SESION, usuario);
    } catch (error) {
        return { ok: false, mensaje: 'No se pudo iniciar la sesion en este navegador.' };
    }
    return { ok: true };
}

function cerrarSesion() {
    estadoJuego.juegoActivo = false;
    localStorage.removeItem(CLAVE_SESION);
    mostrarPantalla('pantalla-acceso');
}

function procesarAcceso(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const accion = formulario.dataset.accion || evento.submitter?.value || 'entrar';
    const resultado = accion === 'registrar'
        ? registrarUsuario(formulario.elements.usuario.value, formulario.elements.clave.value)
        : iniciarSesion(formulario.elements.usuario.value, formulario.elements.clave.value);
    const mensaje = document.getElementById('mensaje-acceso');

    if (!resultado.ok) {
        mensaje.textContent = resultado.mensaje;
        return;
    }

    formulario.reset();
    mensaje.textContent = '';
    mostrarPantalla('pantalla-menu');
}
