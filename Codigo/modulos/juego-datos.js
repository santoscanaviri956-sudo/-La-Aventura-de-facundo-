// Este archivo guarda las preguntas.
// PREGUNTAS SOBRE FACUNDO DE SARMIENTO
// =========================================
const PREGUNTAS = [
    {
        pregunta: "¿Quién es el autor del libro 'Facundo'?",
        opciones: ["Domingo F. Sarmiento", "Juan B. Justo", "Bartolomé Mitre", "Julio A. Roca"],
        correcta: 0,
        explicacion: "Domingo Faustino Sarmiento escribió 'Facundo' en 1845."
    },
    {
        pregunta: "¿Cuál es el tema central de 'Facundo'?",
        opciones: ["La gastronomía argentina", "La civilización y la barbarie", "La independencia de Chile", "La guerra del Paraguay"],
        correcta: 1,
        explicacion: "El enfrentamiento entre civilización y barbarie es el eje central."
    },
    {
        pregunta: "¿Quién es Juan Facundo Quiroga?",
        opciones: ["Un presidente", "Un caudillo de la provincia de La Rioja", "Un escritor", "Un general unitario"],
        correcta: 1,
        explicacion: "Facundo Quiroga fue un caudillo riojano, protagonista del libro."
    },
    {
        pregunta: "¿Qué representaba la 'civilización' según Sarmiento?",
        opciones: ["La vida en el campo", "La ciudad, el progreso y la educación", "Los gauchos", "Las montoneras"],
        correcta: 1,
        explicacion: "La civilización representaba la ciudad europea, el progreso y la educación."
    },
    {
        pregunta: "¿Qué representaba la 'barbarie' según Sarmiento?",
        opciones: ["Las bibliotecas", "La campaña, el atraso y la violencia", "Los ferrocarriles", "El comercio exterior"],
        correcta: 1,
        explicacion: "La barbarie representaba la vida en la campaña y el atraso."
    },
    {
        pregunta: "¿En qué año se publicó 'Facundo'?",
        opciones: ["1810", "1853", "1845", "1880"],
        correcta: 2,
        explicacion: "Sarmiento publicó 'Facundo' en 1845 en Chile."
    },
    {
        pregunta: "¿Qué era una 'montonera'?",
        opciones: ["Un tipo de comida", "Un grupo de gauchos que seguía a un caudillo", "Un instrumento musical", "Un animal de la pampa"],
        correcta: 1,
        explicacion: "Las montoneras eran grupos armados que seguían a los caudillos."
    },
    {
        pregunta: "¿Quién fue Juan Manuel de Rosas?",
        opciones: ["Un poeta", "Un gobernador de Buenos Aires y caudillo", "Un general unitario", "Un presidente"],
        correcta: 1,
        explicacion: "Rosas fue gobernador de Buenos Aires y principal representante de la barbarie."
    },
    {
        pregunta: "¿Qué era la 'Generación del 37'?",
        opciones: ["Un grupo de militares", "Un grupo de intelectuales que buscaba la civilización", "Un grupo de gauchos", "Un ejército"],
        correcta: 1,
        explicacion: "Era un grupo de jóvenes intelectuales que se reunían en la Sociedad Literaria."
    },
    {
        pregunta: "¿Dónde se desarrolla principalmente 'Facundo'?",
        opciones: ["En Europa", "En la Argentina colonial", "En la Argentina de las guerras civiles", "En Chile moderno"],
        correcta: 2,
        explicacion: "El libro se desarrolla en la Argentina de principios del siglo XIX."
    },
    {
        pregunta: "¿Qué es el 'matadero' en el contexto de 'Facundo'?",
        opciones: ["Una escuela", "Un lugar donde se faenan vacunos, símbolo de la barbarie", "Una iglesia", "Un hospital"],
        correcta: 1,
        explicacion: "El matadero representaba la violencia y la barbarie de la epoca."
    },
    {
        pregunta: "¿Qué influencia tuvo Sarmiento en la educación argentina?",
        opciones: ["Ninguna", "Creó las escuelas públicas y promovió la educación", "Cerró todas las escuelas", "Solo escribió poesía"],
        correcta: 1,
        explicacion: "Sarmiento fue impulsor de la educación pública y fundó escuelas."
    },
    {
        pregunta: "¿Qué significa 'gobernar es educar' de Sarmiento?",
        opciones: ["Que los gobernantes deben ser profesores", "Que la educación es la base del progreso nacional", "Que solo los educados pueden gobernar", "Que las escuelas deben ser gubernamentales"],
        correcta: 1,
        explicacion: "Sarmiento creía que la educación era la clave para el desarrollo del país."
    },
    {
        pregunta: "¿Quién fue Domingo Faustino Sarmiento?",
        opciones: ["Un gaucho", "Un político, escritor y presidente argentino", "Un militar", "Un sacerdote"],
        correcta: 1,
        explicacion: "Sarmiento fue presidente de Argentina (1868-1874) y gran escritor."
    },
    {
        pregunta: "¿Qué conflicto armado menciona Sarmiento en 'Facundo'?",
        opciones: ["La Guerra de los Diez Días", "La Guerra Civil Argentina entre unitarios y federales", "La Guerra de Secesión", "La Primera Guerra Mundial"],
        correcta: 1,
        explicacion: "Las guerras civiles entre unitarios y federales son el contexto bélico."
    },
    {
        pregunta: "¿Qué son los 'gauchos' en el libro?",
        opciones: ["Políticos", "Hombres del campo, jinetes expertos", "Comerciantes", "Sacerdotes"],
        correcta: 1,
        explicacion: "Los gauchos eran hombres libres de la pampa, expertos jinetes."
    },
    {
        pregunta: "¿Qué es el 'pago' en la época de Facundo?",
        opciones: ["Un impuesto", "El territorio o zona rural", "Un tipo de caballo", "Una moneda"],
        correcta: 1,
        explicacion: "El 'pago' se refiere al territorio o zona de campo."
    },
    {
        pregunta: "¿Qué papel juega la naturaleza en 'Facundo'?",
        opciones: ["Ninguno", "Representa la fuerza de la barbarie y la pampa", "Es solo un escenario decorativo", "Representa la civilización"],
        correcta: 1,
        explicacion: "La pampa y su naturaleza representan la fuerza indomable de la barbarie."
    },
    {
        pregunta: "¿Qué es la 'Sociedad Literaria' de Sarmiento?",
        opciones: ["Una biblioteca", "Un grupo de jóvenes intelectuales que discutían ideas", "Una imprenta", "Un periódico"],
        correcta: 1,
        explicacion: "Era un grupo donde Sarmiento y otros jóvenes discutían sobre civilización."
    },
    {
        pregunta: "¿Cuál es el mensaje principal de Sarmiento?",
        opciones: ["Que la barbarie es mejor", "Que Argentina debe elegir la civilización y el progreso", "Que los caudillos son héroes", "Que la pampa es perfecta"],
        correcta: 1,
        explicacion: "Sarmiento defiende que Argentina debe caminar hacia la civilización."
    }
];

// =========================================

