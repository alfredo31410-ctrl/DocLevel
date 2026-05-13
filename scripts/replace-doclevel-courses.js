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

const now = Date.now();

const courses = [
  {
    title: 'Odontología restauradora: diagnóstico y plan de tratamiento',
    description: 'Curso práctico para ordenar la evaluación clínica, comunicar hallazgos y estructurar tratamientos odontológicos con criterio profesional.',
    category: 'Odontología',
    video_url: 'https://www.youtube.com/watch?v=QOzH1D4vIfc',
    banner_url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye diagnóstico inicial, fotografía clínica, criterios de restauración, comunicación con el paciente y seguimiento.',
    status: 'available',
    featured: true,
  },
  {
    title: 'Pediatría esencial: signos de alarma y manejo inicial',
    description: 'Aprende a reconocer escenarios pediátricos que requieren atención inmediata, seguimiento estrecho o referencia oportuna.',
    category: 'Pediatría',
    video_url: 'https://www.youtube.com/watch?v=hqvqOYh5p5g',
    banner_url: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye fiebre, dificultad respiratoria, hidratación, dolor abdominal y comunicación clara con madres, padres y cuidadores.',
    status: 'available',
    featured: false,
  },
  {
    title: 'Cardiología clínica: ECG básico y valoración inicial',
    description: 'Fortalece la lectura inicial del electrocardiograma y la toma de decisiones ante síntomas cardiovasculares frecuentes.',
    category: 'Cardiología',
    video_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    banner_url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1600&q=80',
    content: 'Incluye ritmo, frecuencia, intervalos, datos de alarma, dolor torácico, palpitaciones y criterios de referencia.',
    status: 'available',
    featured: false,
  },
  {
    title: 'Urgencias en consultorio: decisiones clínicas que no pueden esperar',
    description: 'Especialidad en preparación. Este programa estará enfocado en la atención inicial de urgencias frecuentes en consulta.',
    category: 'Urgencias',
    video_url: '',
    banner_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1600&q=80',
    content: 'Próximamente: abordaje inicial, señales de alarma, estabilización y referencia.',
    status: 'coming_soon',
    featured: false,
  },
  {
    title: 'Medicina interna: laboratorio, diagnóstico y seguimiento clínico',
    description: 'Especialidad en preparación. El curso reunirá criterios prácticos para integrar datos clínicos y estudios de laboratorio.',
    category: 'Medicina Interna',
    video_url: '',
    banner_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    content: 'Próximamente: interpretación de laboratorio, seguimiento metabólico y toma de decisiones clínicas.',
    status: 'coming_soon',
    featured: false,
  },
  {
    title: 'Ginecología práctica: consulta, prevención y referencia',
    description: 'Especialidad en preparación. Este programa abordará motivos frecuentes de consulta ginecológica con enfoque claro y aplicable.',
    category: 'Ginecología',
    video_url: '',
    banner_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
    content: 'Próximamente: prevención, tamizaje, síntomas frecuentes y referencia oportuna.',
    status: 'coming_soon',
    featured: false,
  },
  {
    title: 'Dermatología clínica: lesiones frecuentes y banderas rojas',
    description: 'Especialidad en preparación. El curso ayudará a reconocer lesiones comunes, datos de alarma y criterios de referencia.',
    category: 'Dermatología',
    video_url: '',
    banner_url: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1600&q=80',
    content: 'Próximamente: reconocimiento visual, diagnóstico diferencial y manejo inicial responsable.',
    status: 'coming_soon',
    featured: false,
  },
  {
    title: 'Nutrición clínica: intervención práctica en consulta médica',
    description: 'Especialidad en preparación. Este curso se enfocará en criterios clínicos para orientar cambios nutricionales realistas.',
    category: 'Nutrición Clínica',
    video_url: '',
    banner_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80',
    content: 'Próximamente: evaluación inicial, adherencia, educación del paciente y seguimiento.',
    status: 'coming_soon',
    featured: false,
  },
].map((course, index) => ({
  ...course,
  id: randomUUID(),
  created_at: new Date(now - index * 1000),
}));

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  await db.collection('courses').deleteMany({});
  await db.collection('courses').insertMany(courses);

  await client.close();
  console.log(`Replaced courses in ${dbName}.courses with ${courses.length} DocLevel courses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
