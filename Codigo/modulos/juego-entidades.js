// Este archivo crea al jugador y los objetos.
// CLASE JUGADOR
// =========================================
class Jugador {
    constructor(x, y) {
        this.x = x;
        this.y = y;
            this.ancho = CONFIG.TAMANO_PERSONAJE;
            this.alto = CONFIG.TAMANO_PERSONAJE;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.enSuelo = false;
        this.direccion = 1;
        this.estado = 'idle';
        this.frameAnimacion = 0;
        this.tiempoAnimacion = 0;
        this.inmunidad = 0;
    }

    actualizar(teclas, plataformas, sueloY, anchoNivel = CONFIG.ANCHO_CANVAS, pozos = []) {
        this.xAnterior = this.x;
        this.yAnterior = this.y;

        if (teclas['ArrowLeft'] || teclas['a'] || teclas['A']) {
            this.velocidadX = -CONFIG.VELOCIDAD_JUGADOR;
            this.direccion = -1;
            this.estado = 'walk';
        } else if (teclas['ArrowRight'] || teclas['d'] || teclas['D']) {
            this.velocidadX = CONFIG.VELOCIDAD_JUGADOR;
            this.direccion = 1;
            this.estado = 'walk';
        } else {
            this.velocidadX = 0;
            if (this.enSuelo) this.estado = 'idle';
        }

        if ((teclas['ArrowUp'] || teclas['w'] || teclas['W'] || teclas[' ']) && this.enSuelo) {
            this.velocidadY = CONFIG.FUERZA_SALTO;
            this.enSuelo = false;
            this.estado = 'jump';
        }

        this.velocidadY += CONFIG.GRAVEDAD;

        this.x += this.velocidadX;

        for (let plataforma of plataformas) {
            if (this.colisionaCon(plataforma)) {
                if (this.velocidadX > 0) {
                    this.x = plataforma.x - this.ancho;
                } else if (this.velocidadX < 0) {
                    this.x = plataforma.x + plataforma.ancho;
                }
                this.velocidadX = 0;
            }
        }

        this.y += this.velocidadY;
        this.enSuelo = false;

        const estaCompletamenteSobreUnPozo = pozos.some((pozo) =>
            this.x >= pozo.x &&
            this.x + this.ancho <= pozo.x + pozo.ancho
        );

        if (!estaCompletamenteSobreUnPozo && this.y + this.alto >= sueloY) {
            this.y = sueloY - this.alto;
            this.enSuelo = true;
            if (this.estado === 'jump' || this.velocidadY > 0) {
                this.estado = 'idle';
            }
            this.velocidadY = 0;
        }
        for (let plataforma of plataformas) {
            if (this.colisionaCon(plataforma)) {
                if (this.velocidadY >= 0) {
                    this.y = plataforma.y - this.alto;
                    this.enSuelo = true;
                    this.estado = 'idle';
                }
                this.velocidadY = 0;
            }
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.ancho > anchoNivel) {
            this.x = anchoNivel - this.ancho;
        }

        if (this.y > CONFIG.ALTO_CANVAS + 50) {
            return true;
        }

        if (this.inmunidad > 0) this.inmunidad--;

        this.tiempoAnimacion++;
        if (this.tiempoAnimacion >= 8) {
            this.tiempoAnimacion = 0;
            this.frameAnimacion = (this.frameAnimacion + 1) % 4;
        }

        return false;
    }

    colisionaCon(objeto) {
        return this.x < objeto.x + objeto.ancho &&
               this.x + this.ancho > objeto.x &&
               this.y < objeto.y + objeto.alto &&
               this.y + this.alto > objeto.y;
    }

    dibujar(ctx) {
        if (this.inmunidad > 0 && Math.floor(this.inmunidad / 4) % 2 === 0) {
            return;
        }

        ctx.save();

        const imagenPersonaje = IMAGENES['personaje'];
        if (imagenPersonaje) {
            if (this.direccion === -1) {
                ctx.translate(this.x + this.ancho, this.y);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(this.x, this.y);
            }

            if (!dibujarImagenSegura(ctx, imagenPersonaje, 0, 0, this.ancho, this.alto)) {
                this.dibujarPersonajeRespaldo(ctx);
            }
        } else {
            this.dibujarPersonajeRespaldo(ctx);
        }

        ctx.restore();
    }

    dibujarPersonajeRespaldo(ctx) {
        ctx.save();
        if (this.direccion === -1) {
            ctx.translate(this.x + this.ancho, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x, this.y);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(24, 48, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        const piernaOffset = this.estado === 'walk' ? Math.sin(this.frameAnimacion * Math.PI / 2) * 4 : 0;
        ctx.fillStyle = '#00008B';
        ctx.fillRect(14, 28 + piernaOffset, 7, 14);
        ctx.fillRect(27, 28 - piernaOffset, 7, 14);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(13, 36 + piernaOffset, 8, 5);
        ctx.fillRect(26, 36 - piernaOffset, 8, 5);

        ctx.fillStyle = '#fff';
        ctx.fillRect(12, 6, 24, 24);

        ctx.fillStyle = '#ffdab9';
        ctx.fillRect(14, -16, 20, 20);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, -20, 24, 8);
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(10, -22, 28, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(18, -10, 4, 4);
        ctx.fillRect(28, -10, 4, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(19, -10, 2, 2);
        ctx.fillRect(29, -10, 2, 2);

        ctx.fillStyle = '#8B4513';
        if (this.estado === 'jump') {
            ctx.fillRect(22, -2, 6, 3);
        } else {
            ctx.fillRect(20, -2, 8, 2);
        }

        ctx.restore();
    }
}

// =========================================
// CLASE ENEMIGO
// =========================================
class Enemigo {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.ancho = 44;
        this.alto = 48;
        this.tipo = tipo;
        this.velocidadX = CONFIG.VELOCIDAD_ENEMIGO * (Math.random() > 0.5 ? 1 : -1);
        this.direccion = this.velocidadX > 0 ? 1 : -1;
        this.vivo = true;
        this.tiempoAnimacion = 0;
    }

    actualizar(plataformas, sueloY, anchoNivel = CONFIG.ANCHO_CANVAS, pozos = []) {
        if (!this.vivo) return;

        const proximaX = this.x + this.velocidadX;
        const seAcercaAlPozo = pozos.some((pozo) =>
            proximaX + this.ancho > pozo.x &&
            proximaX < pozo.x + pozo.ancho
        );

        if (seAcercaAlPozo) {
            this.velocidadX *= -1;
            this.direccion *= -1;
        }
        this.x += this.velocidadX;

        if (this.x <= 10 || this.x + this.ancho >= anchoNivel - 10) {
            this.velocidadX *= -1;
            this.direccion *= -1;
        }

        this.tiempoAnimacion++;
    }

    dibujar(ctx) {
        if (!this.vivo) return;

        ctx.save();

        if (this.direccion === -1) {
            ctx.translate(this.x + this.ancho, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x, this.y);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(22, 48, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        switch(this.tipo) {
            case 'soldado':
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(10, 4, 24, 28);
                ctx.fillStyle = '#ffdab9';
                ctx.fillRect(14, -14, 16, 18);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(12, -16, 20, 6);
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(18, -18, 8, 4);
                ctx.fillStyle = '#000';
                ctx.fillRect(17, -8, 3, 3);
                ctx.fillRect(24, -8, 3, 3);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(18, -2, 8, 2);
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(12, 32, 8, 14);
                ctx.fillRect(24, 32, 8, 14);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(11, 40, 9, 5);
                ctx.fillRect(23, 40, 9, 5);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(34, 8, 6, 26);
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(34, 4, 6, 6);
                break;

            case 'caudillo':
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(10, 4, 24, 28);
                ctx.fillStyle = '#ffdab9';
                ctx.fillRect(14, -12, 16, 16);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(8, -18, 24, 8);
                ctx.fillRect(14, -26, 12, 10);
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(14, -18, 12, 3);
                ctx.fillStyle = '#fff';
                ctx.fillRect(18, 4, 12, 4);
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(22, 4, 4, 8);
                ctx.fillStyle = '#000';
                ctx.fillRect(18, -6, 3, 3);
                ctx.fillRect(25, -6, 3, 3);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(17, 2, 10, 3);
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(12, 32, 8, 14);
                ctx.fillRect(24, 32, 8, 14);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(11, 40, 9, 5);
                ctx.fillRect(23, 40, 9, 5);
                break;

            case 'gauche':
                ctx.fillStyle = '#d2691e';
                ctx.fillRect(10, 4, 24, 28);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(16, 6, 6, 24);
                ctx.fillRect(24, 6, 6, 24);
                ctx.fillStyle = '#ffdab9';
                ctx.fillRect(14, -12, 16, 16);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(10, -16, 24, 8);
                ctx.fillStyle = '#654321';
                ctx.fillRect(14, -18, 16, 4);
                ctx.fillStyle = '#000';
                ctx.fillRect(18, -6, 3, 3);
                ctx.fillRect(25, -6, 3, 3);
                ctx.fillStyle = '#654321';
                ctx.fillRect(17, 2, 10, 5);
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(12, 32, 8, 14);
                ctx.fillRect(24, 32, 8, 14);
                ctx.fillStyle = '#654321';
                ctx.fillRect(11, 38, 9, 7);
                ctx.fillRect(23, 38, 9, 7);
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(-2, 14, 10, 4);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(0, 18, 6, 8);
                break;

            case 'montonero':
                ctx.fillStyle = '#d2691e';
                ctx.fillRect(8, 2, 28, 30);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(14, 4, 16, 26);
                ctx.fillStyle = '#ffdab9';
                ctx.fillRect(14, -12, 16, 14);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(8, -18, 28, 8);
                ctx.fillRect(14, -22, 16, 6);
                ctx.fillStyle = '#000';
                ctx.fillRect(18, -6, 3, 3);
                ctx.fillRect(25, -6, 3, 3);
                ctx.fillStyle = '#654321';
                ctx.fillRect(19, 2, 8, 3);
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(12, 32, 8, 14);
                ctx.fillRect(24, 32, 8, 14);
                ctx.fillStyle = '#654321';
                ctx.fillRect(11, 40, 9, 5);
                ctx.fillRect(23, 40, 9, 5);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(36, -14, 5, 42);
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(38, -18);
                ctx.lineTo(34, -14);
                ctx.lineTo(42, -14);
                ctx.closePath();
                ctx.fill();
                break;
        }

        if (this.tipo === 'caudillo' || this.tipo === 'montonero') {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(22, 14, 26, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    colisionaCon(objeto) {
        return this.x < objeto.x + objeto.ancho &&
               this.x + this.ancho > objeto.x &&
               this.y < objeto.y + objeto.alto &&
               this.y + this.alto > objeto.y;
    }

    morir() {
        this.vivo = false;
    }
}

// =========================================
// CLASE BLOQUE MISTERIOSO
// =========================================
class BloqueMisterioso {
    constructor(x, y) {
        this.x = x;
        this.y = y - 65;
        this.yOriginal = y - 65;
        this.ancho = 52;
        this.alto = 52;
        this.activo = true;
        this.tiempoBrillo = 0;
    }

    actualizar() {
        if (!this.activo) return;
        this.tiempoBrillo++;
        if (this.tiempoBrillo >= 60) this.tiempoBrillo = 0;
        this.y = this.yOriginal + Math.sin(this.tiempoBrillo * 0.08) * 4;
    }

    dibujar(ctx) {
        if (!this.activo) return;

        const imagenCubo = IMAGENES['cuboPreguntas'] || IMAGENES['cuboPreguntas2'];
        if (imagenCubo) {
            ctx.save();
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            ctx.shadowBlur = 8 + Math.sin(this.tiempoBrillo * 0.15) * 3;
            dibujarImagenSegura(ctx, imagenCubo, this.x, this.y, this.ancho, this.alto);
            ctx.restore();
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(this.x + 4, this.y + 4, this.ancho, this.alto);

            const brillo = Math.sin(this.tiempoBrillo * 0.15) * 30 + 225;
            ctx.fillStyle = `rgb(${brillo}, ${brillo * 0.85}, 50)`;
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);

            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 26px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', this.x + this.ancho/2, this.y + this.alto/2);
        }
    }

    colisionaCon(objeto) {
        return this.x < objeto.x + objeto.ancho &&
               this.x + this.ancho > objeto.x &&
               this.y < objeto.y + objeto.alto &&
               this.y + this.alto > objeto.y;
    }

    desactivar() {
        this.activo = false;
    }
}

// =========================================
// CLASE META
// =========================================
class Meta {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ancho = 50;
        this.alto = 60;
        this.tiempoAnimacion = 0;
    }

    actualizar() {
        this.tiempoAnimacion++;
    }

    dibujar(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + this.alto + 5, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 22, this.y, 6, this.alto);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x + 23, this.y, 2, this.alto);

        const ondeo = Math.sin(this.tiempoAnimacion * 0.08) * 6;

        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.moveTo(this.x + 28, this.y + 2);
        ctx.quadraticCurveTo(this.x + 48 + ondeo/2, this.y + 10, this.x + 65 + ondeo, this.y + 18);
        ctx.quadraticCurveTo(this.x + 48 + ondeo/2, this.y + 26, this.x + 28, this.y + 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x + 28, this.y + 12);
        ctx.quadraticCurveTo(this.x + 48 + ondeo/2, this.y + 16, this.x + 65 + ondeo, this.y + 18);
        ctx.quadraticCurveTo(this.x + 48 + ondeo/2, this.y + 20, this.x + 28, this.y + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + 46 + ondeo/3, this.y + 17, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('META', this.x + 25, this.y - 8);
    }

    colisionaCon(objeto) {
        return this.x < objeto.x + objeto.ancho &&
               this.x + this.ancho > objeto.x &&
               this.y < objeto.y + objeto.alto &&
               this.y + this.alto > objeto.y;
    }
}

// =========================================

