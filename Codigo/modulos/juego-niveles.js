// Este archivo define los escenarios.
// ELEMENTOS DEL NIVEL
// =========================================
const NIVELES = {
    1: {
        nombre: "La Ciudad",
        fondo: 'fondo1',
        ancho: 1200,
        sueloY: 480,
        plataformas: [
            { x: 150, y: 375, ancho: 140, alto: 25 },
            { x: 350, y: 300, ancho: 140, alto: 25 },
            { x: 550, y: 350, ancho: 140, alto: 25 },
            { x: 750, y: 270, ancho: 140, alto: 25 },
            { x: 960, y: 350, ancho: 130, alto: 25 },
            { x: 1110, y: 285, ancho: 90, alto: 25 }
        ],
        arboles: [],
        arbustos: [],
        enemigos: [
            { x: 300, y: 432, tipo: 'soldado' },
            { x: 500, y: 432, tipo: 'gauche' },
            { x: 700, y: 432, tipo: 'caudillo' },
            { x: 980, y: 432, tipo: 'soldado' },
            { x: 1130, y: 432, tipo: 'gauche' }
        ],
        bloquesMisteriosos: [
            { x: 197, y: 325 },
            { x: 397, y: 250 },
            { x: 797, y: 220 },
            { x: 1007, y: 300 },
            { x: 1137, y: 235 }
        ],
        meta: { x: 1150, y: 420 }
    },
    2: {
        nombre: "El Camino Rural",
        fondo: 'fondo2',
        ancho: 1450,
        sueloY: 480,
        plataformas: [
            { x: 120, y: 390, ancho: 130, alto: 25 },
            { x: 320, y: 330, ancho: 130, alto: 25 },
            { x: 520, y: 370, ancho: 130, alto: 25 },
            { x: 720, y: 300, ancho: 130, alto: 25 },
            { x: 250, y: 360, ancho: 100, alto: 25 },
            { x: 600, y: 270, ancho: 100, alto: 25 },
            { x: 900, y: 360, ancho: 120, alto: 25 },
            { x: 1080, y: 290, ancho: 110, alto: 25 },
            { x: 1260, y: 350, ancho: 130, alto: 25 }
        ],
        arboles: [],
        arbustos: [],
        enemigos: [
            { x: 200, y: 432, tipo: 'gauche' },
            { x: 550, y: 432, tipo: 'montonero' },
            { x: 700, y: 432, tipo: 'gauche' },
            { x: 860, y: 432, tipo: 'soldado' },
            { x: 1020, y: 432, tipo: 'gauche' },
            { x: 1180, y: 432, tipo: 'montonero' },
            { x: 1360, y: 432, tipo: 'soldado' }
        ],
        bloquesMisteriosos: [
            { x: 162, y: 340 },
            { x: 562, y: 320 },
            { x: 762, y: 250 },
            { x: 942, y: 310 },
            { x: 1122, y: 240 },
            { x: 1302, y: 300 }
        ],
        meta: { x: 1400, y: 420 }
    },
    3: {
        nombre: "La Manga",
        fondo: 'fondo3',
        ancho: 1700,
        sueloY: 480,
        plataformas: [
            { x: 100, y: 410, ancho: 110, alto: 25 },
            { x: 270, y: 330, ancho: 110, alto: 25 },
            { x: 440, y: 380, ancho: 110, alto: 25 },
            { x: 610, y: 300, ancho: 110, alto: 25 },
            { x: 780, y: 350, ancho: 110, alto: 25 },
            { x: 960, y: 280, ancho: 100, alto: 25 },
            { x: 1130, y: 370, ancho: 100, alto: 25 },
            { x: 1300, y: 300, ancho: 100, alto: 25 },
            { x: 1480, y: 350, ancho: 120, alto: 25 }
        ],
        arboles: [],
        arbustos: [],
        enemigos: [
            { x: 150, y: 432, tipo: 'soldado' },
            { x: 350, y: 432, tipo: 'soldado' },
            { x: 520, y: 432, tipo: 'gauche' },
            { x: 650, y: 432, tipo: 'caudillo' },
            { x: 780, y: 432, tipo: 'montonero' },
            { x: 880, y: 432, tipo: 'caudillo' },
            { x: 1040, y: 432, tipo: 'soldado' },
            { x: 1200, y: 432, tipo: 'gauche' },
            { x: 1380, y: 432, tipo: 'montonero' },
            { x: 1560, y: 432, tipo: 'caudillo' }
        ],
        bloquesMisteriosos: [
            { x: 132, y: 360 },
            { x: 472, y: 330 },
            { x: 812, y: 300 },
            { x: 992, y: 230 },
            { x: 1162, y: 320 },
            { x: 1332, y: 250 },
            { x: 1522, y: 300 }
        ],
        meta: { x: 1650, y: 420 }
    },
    4: {
        nombre: "El Mondonguero",
        fondo: 'fondo4',
        ancho: 2000,
        sueloY: 480,
        plataformas: [
            { x: 80, y: 420, ancho: 100, alto: 25 },
            { x: 220, y: 340, ancho: 100, alto: 25 },
            { x: 360, y: 390, ancho: 100, alto: 25 },
            { x: 500, y: 310, ancho: 100, alto: 25 },
            { x: 640, y: 370, ancho: 100, alto: 25 },
            { x: 780, y: 285, ancho: 100, alto: 25 },
            { x: 940, y: 360, ancho: 100, alto: 25 },
            { x: 1100, y: 280, ancho: 100, alto: 25 },
            { x: 1260, y: 390, ancho: 100, alto: 25 },
            { x: 1420, y: 300, ancho: 100, alto: 25 },
            { x: 1580, y: 370, ancho: 100, alto: 25 },
            { x: 1760, y: 270, ancho: 120, alto: 25 }
        ],
        arboles: [],
        arbustos: [],
        enemigos: [
            { x: 120, y: 432, tipo: 'gauche' },
            { x: 280, y: 432, tipo: 'gauche' },
            { x: 360, y: 432, tipo: 'soldado' },
            { x: 450, y: 432, tipo: 'soldado' },
            { x: 620, y: 432, tipo: 'montonero' },
            { x: 740, y: 432, tipo: 'gauche' },
            { x: 820, y: 432, tipo: 'caudillo' },
            { x: 980, y: 432, tipo: 'soldado' },
            { x: 1140, y: 432, tipo: 'montonero' },
            { x: 1300, y: 432, tipo: 'gauche' },
            { x: 1460, y: 432, tipo: 'soldado' },
            { x: 1620, y: 432, tipo: 'caudillo' },
            { x: 1800, y: 432, tipo: 'montonero' },
            { x: 1900, y: 432, tipo: 'soldado' }
        ],
        bloquesMisteriosos: [
            { x: 107, y: 370 },
            { x: 387, y: 340 },
            { x: 807, y: 235 },
            { x: 967, y: 310 },
            { x: 1127, y: 230 },
            { x: 1287, y: 340 },
            { x: 1447, y: 250 },
            { x: 1627, y: 320 },
            { x: 1807, y: 220 }
        ],
        meta: { x: 1940, y: 420 }
    },
    5: {
        nombre: "El Desenlace",
        fondo: 'fondo5',
        ancho: 2300,
        sueloY: 480,
        plataformas: [
            { x: 70, y: 425, ancho: 90, alto: 25 },
            { x: 200, y: 350, ancho: 90, alto: 25 },
            { x: 330, y: 405, ancho: 90, alto: 25 },
            { x: 460, y: 325, ancho: 90, alto: 25 },
            { x: 590, y: 380, ancho: 90, alto: 25 },
            { x: 720, y: 300, ancho: 90, alto: 25 },
            { x: 860, y: 390, ancho: 90, alto: 25 },
            { x: 1000, y: 310, ancho: 90, alto: 25 },
            { x: 1140, y: 370, ancho: 90, alto: 25 },
            { x: 1280, y: 280, ancho: 90, alto: 25 },
            { x: 1420, y: 350, ancho: 90, alto: 25 },
            { x: 1560, y: 260, ancho: 90, alto: 25 },
            { x: 1700, y: 330, ancho: 90, alto: 25 },
            { x: 1840, y: 250, ancho: 90, alto: 25 },
            { x: 1980, y: 350, ancho: 100, alto: 25 },
            { x: 2140, y: 290, ancho: 100, alto: 25 }
        ],
        arboles: [],
        arbustos: [],
        enemigos: [
            { x: 100, y: 432, tipo: 'soldado' },
            { x: 230, y: 432, tipo: 'soldado' },
            { x: 360, y: 432, tipo: 'caudillo' },
            { x: 490, y: 432, tipo: 'montonero' },
            { x: 620, y: 432, tipo: 'gauche' },
            { x: 750, y: 432, tipo: 'caudillo' },
            { x: 850, y: 432, tipo: 'montonero' },
            { x: 880, y: 432, tipo: 'soldado' },
            { x: 1020, y: 432, tipo: 'soldado' },
            { x: 1160, y: 432, tipo: 'gauche' },
            { x: 1300, y: 432, tipo: 'montonero' },
            { x: 1440, y: 432, tipo: 'caudillo' },
            { x: 1580, y: 432, tipo: 'soldado' },
            { x: 1720, y: 432, tipo: 'gauche' },
            { x: 1860, y: 432, tipo: 'montonero' },
            { x: 2000, y: 432, tipo: 'caudillo' },
            { x: 2160, y: 432, tipo: 'soldado' }
        ],
        bloquesMisteriosos: [
            { x: 92, y: 375 },
            { x: 352, y: 355 },
            { x: 742, y: 250 },
            { x: 882, y: 315 },
            { x: 1022, y: 235 },
            { x: 1162, y: 295 },
            { x: 1302, y: 205 },
            { x: 1442, y: 275 },
            { x: 1582, y: 195 },
            { x: 1722, y: 265 },
            { x: 1862, y: 185 },
            { x: 2002, y: 285 },
            { x: 2162, y: 225 }
        ],
        meta: { x: 2240, y: 420 }
    }
};

Object.entries(NIVELES).forEach(([numeroNivel, nivel]) => {
    const inicioTramoExtra = nivel.ancho;

    nivel.ancho += 360;
    nivel.plataformas.push(
        { x: inicioTramoExtra + 40, y: 390, ancho: 110, alto: 25 },
        { x: inicioTramoExtra + 180, y: 315, ancho: 110, alto: 25 },
        { x: inicioTramoExtra + 300, y: 400, ancho: 60, alto: 25 },
        { x: inicioTramoExtra + 80, y: 250, ancho: 90, alto: 25 },
        { x: inicioTramoExtra + 230, y: 190, ancho: 90, alto: 25 },
        { x: inicioTramoExtra + 330, y: 130, ancho: 30, alto: 25 }
    );
    nivel.enemigos.push(
        { x: inicioTramoExtra + 90, y: 432, tipo: 'soldado' },
        { x: inicioTramoExtra + 220, y: 432, tipo: 'gauche' },
        { x: inicioTramoExtra + 315, y: 432, tipo: 'montonero' }
    );
    nivel.bloquesMisteriosos.push(
        { x: inicioTramoExtra + 72, y: 340 },
        { x: inicioTramoExtra + 212, y: 240 },
        { x: inicioTramoExtra + 112, y: 175 },
        { x: inicioTramoExtra + 262, y: 115 }
    );
    const posicionesCubos = [
        0,
        Math.floor((nivel.bloquesMisteriosos.length - 1) / 2),
        nivel.bloquesMisteriosos.length - 1
    ];
    nivel.bloquesMisteriosos = posicionesCubos.map((indice) => nivel.bloquesMisteriosos[indice]);
    nivel.bloquesMisteriosos = nivel.bloquesMisteriosos.map((bloque, indice) => ({
        ...bloque,
        x: bloque.x + 18 + indice * 12,
        y: bloque.y - 20 - indice * 8
    }));
    nivel.pozos = [
        { x: Math.floor(nivel.ancho / 2) - 90, y: nivel.sueloY, ancho: 180, alto: 120 }
    ];
    const pozo = nivel.pozos[0];
    const invadeElPozo = (obstaculo) =>
        obstaculo.x < pozo.x + pozo.ancho &&
        obstaculo.x + obstaculo.ancho > pozo.x;

    nivel.plataformas = nivel.plataformas.filter((plataforma) => !invadeElPozo(plataforma));
    nivel.enemigos = nivel.enemigos.filter((enemigo) => !invadeElPozo(enemigo));
    nivel.bloquesMisteriosos = nivel.bloquesMisteriosos.map((bloque) => {
        if (!invadeElPozo(bloque)) return bloque;
        return { ...bloque, x: pozo.x - bloque.ancho - 20 };
    });

    const obstaculosPorNivel = {
        1: [
            { x: 260, y: 448, ancho: 54, alto: 32, tipo: 'piedras' },
            { x: 1040, y: 420, ancho: 30, alto: 60, tipo: 'barrera' }
        ],
        2: [
            { x: 460, y: 442, ancho: 70, alto: 38, tipo: 'pinchos' },
            { x: 1180, y: 425, ancho: 44, alto: 55, tipo: 'tronco' },
            { x: inicioTramoExtra + 270, y: 442, ancho: 70, alto: 38, tipo: 'pinchos' }
        ],
        3: [
            { x: 620, y: 400, ancho: 44, alto: 80, tipo: 'barrera' },
            { x: 1080, y: 442, ancho: 88, alto: 38, tipo: 'piedras' },
            { x: inicioTramoExtra + 40, y: 442, ancho: 70, alto: 38, tipo: 'fuego' }
        ],
        4: [
            { x: 540, y: 442, ancho: 70, alto: 38, tipo: 'fuego' },
            { x: 980, y: 430, ancho: 44, alto: 50, tipo: 'tronco' },
            { x: 1540, y: 400, ancho: 44, alto: 80, tipo: 'barrera' },
            { x: inicioTramoExtra + 270, y: 442, ancho: 70, alto: 38, tipo: 'pinchos' }
        ],
        5: [
            { x: 430, y: 442, ancho: 70, alto: 38, tipo: 'pinchos' },
            { x: 760, y: 442, ancho: 88, alto: 38, tipo: 'piedras' },
            { x: 1180, y: 420, ancho: 44, alto: 60, tipo: 'tronco' },
            { x: 1680, y: 442, ancho: 70, alto: 38, tipo: 'fuego' },
            { x: inicioTramoExtra + 250, y: 400, ancho: 44, alto: 80, tipo: 'barrera' }
        ]
    };
    nivel.obstaculos = obstaculosPorNivel[numeroNivel].filter((obstaculo) => !invadeElPozo(obstaculo));
    nivel.obstaculos = nivel.obstaculos.map((obstaculo) => {
        if (obstaculo.tipo === 'barrera') {
            const altoNuevo = 35;
            return {
                ...obstaculo,
                ancho: 30,
                y: nivel.sueloY - altoNuevo,
                alto: altoNuevo
            };
        }
        if (obstaculo.tipo !== 'pinchos') return obstaculo;
        const altoNuevo = Math.round(obstaculo.alto * 0.7);
        return {
            ...obstaculo,
            ancho: Math.round(obstaculo.ancho * 0.75),
            y: obstaculo.y + obstaculo.alto - altoNuevo,
            alto: altoNuevo
        };
    });
    nivel.obstaculos = nivel.obstaculos.filter((obstaculo) => {
        const seSuperponeConPlataforma = nivel.plataformas.some((plataforma) =>
            obstaculo.x < plataforma.x + plataforma.ancho &&
            obstaculo.x + obstaculo.ancho > plataforma.x &&
            obstaculo.y < plataforma.y + plataforma.alto &&
            obstaculo.y + obstaculo.alto > plataforma.y
        );
        return !seSuperponeConPlataforma;
    });
    nivel.obstaculos = nivel.obstaculos.filter((obstaculo) => obstaculo.tipo !== 'barrera');

    const dificultad = Number(numeroNivel) - 1;
    nivel.bloquesMisteriosos = nivel.bloquesMisteriosos.map((bloque, indice) => ({
        ...bloque,
        x: bloque.x + dificultad * (indice % 2 === 0 ? 18 : -14),
        y: Math.max(75, bloque.y - dificultad * 8)
    }));
    nivel.meta.x = nivel.ancho - 50;
    const inicioZonaMeta = nivel.meta.x - 140;
    nivel.obstaculos = nivel.obstaculos.filter((obstaculo) =>
        obstaculo.x + obstaculo.ancho <= inicioZonaMeta || obstaculo.x >= nivel.meta.x + 50
    );
    nivel.enemigos = nivel.enemigos.filter((enemigo) =>
        enemigo.x + enemigo.ancho <= inicioZonaMeta || enemigo.x >= nivel.meta.x + 50
    );
});

// =========================================

