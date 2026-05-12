const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { MongoClient } = require('mongodb');

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadLocalEnv();

const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'DocLevel';

if (!uri) {
  console.error('Missing MONGO_URL or MONGODB_URI.');
  process.exit(1);
}

const now = new Date();

const courses = [
  {
    title: 'Urgencias en consultorio: decisiones clínicas que no pueden esperar',
    description: 'Aprende a identificar, priorizar y actuar ante escenarios frecuentes de urgencia en la práctica médica diaria.',
    category: 'Urgencias',
    video_url: 'https://www.youtube.com/watch?v=QOzH1D4vIfc',
    banner_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye abordaje inicial, criterios de referencia, señales de alarma y toma de decisiones en los primeros minutos.',
    featured: true,
  },
  {
    title: 'Interpretación básica de laboratorio para médicos de primer contacto',
    description: 'Refuerza la lectura clínica de biometría hemática, química sanguínea y marcadores comunes en consulta.',
    category: 'Medicina Interna',
    video_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    banner_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    content: 'Curso enfocado en correlación clínica, patrones frecuentes y errores comunes al interpretar resultados.',
    featured: false,
  },
  {
    title: 'Actualización en diabetes tipo 2 para la práctica clínica',
    description: 'Revisa criterios actuales, abordaje terapéutico y seguimiento práctico del paciente con diabetes tipo 2.',
    category: 'Medicina Interna',
    video_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    banner_url: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye metas de control, tratamiento inicial, intensificación terapéutica y educación del paciente.',
    featured: false,
  },
  {
    title: 'Ginecología práctica: consulta, prevención y criterios de referencia',
    description: 'Fortalece el abordaje de motivos frecuentes de consulta ginecológica con una visión clara y aplicable.',
    category: 'Ginecología',
    video_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    banner_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
    content: 'Temas clave: prevención, tamizaje, síntomas frecuentes, comunicación con paciente y referencia oportuna.',
    featured: false,
  },
  {
    title: 'Pediatría esencial: signos de alarma y manejo inicial',
    description: 'Aprende a reconocer escenarios pediátricos que requieren atención inmediata o seguimiento estrecho.',
    category: 'Pediatría',
    video_url: 'https://www.youtube.com/watch?v=hqvqOYh5p5g',
    banner_url: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye fiebre, dificultad respiratoria, hidratación, dolor abdominal y comunicación con cuidadores.',
    featured: false,
  },
  {
    title: 'Dermatología para consulta general: lesiones frecuentes y banderas rojas',
    description: 'Distingue lesiones comunes, criterios de alarma y decisiones de tratamiento o referencia dermatológica.',
    category: 'Dermatología',
    video_url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
    banner_url: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1600&q=80',
    content: 'Curso orientado a reconocimiento visual, diagnóstico diferencial y manejo inicial responsable.',
    featured: false,
  },
  {
    title: 'Comunicación clínica: cómo explicar diagnósticos con claridad y confianza',
    description: 'Mejora la forma en que comunicas hallazgos, planes de tratamiento y riesgos al paciente.',
    category: 'Comunicación Médica',
    video_url: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
    banner_url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye estructura de explicación, manejo de objeciones, adherencia terapéutica y conversación empática.',
    featured: false,
  },
  {
    title: 'Crea tu primer curso médico digital con DocLevel',
    description: 'Una guía para doctores especialistas que quieren transformar su experiencia clínica en formación médica digital.',
    category: 'Educación Médica',
    video_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    banner_url: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye estructura del temario, promesa educativa, formato de grabación y ruta para convertir conocimiento en un programa claro.',
    featured: false,
  },
].map((course) => ({ ...course, id: randomUUID(), created_at: now }));

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  await db.collection('courses').deleteMany({});
  await db.collection('courses').insertMany(courses);

  await client.close();
  console.log(`Replaced courses in ${dbName}.courses with ${courses.length} DocLevel medical courses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
