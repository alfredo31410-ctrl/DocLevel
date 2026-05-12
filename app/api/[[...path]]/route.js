import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { signToken, getAuthFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const json = (data, status = 200) => NextResponse.json(data, { status });
const err = (message, status = 400) => NextResponse.json({ error: message }, { status });

async function requireAdmin(request) {
  const auth = getAuthFromRequest(request);
  if (!auth || auth.role !== 'admin') return null;
  return auth;
}

async function seedIfEmpty() {
  const db = await getDb();
  const admins = db.collection('admins');
  const courses = db.collection('courses');

  const adminCount = await admins.countDocuments();
  if (adminCount === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await admins.insertOne({
      id: uuidv4(),
      email: 'admin@doclevel.com',
      password: hash,
      created_at: new Date(),
    });
  }

  const courseCount = await courses.countDocuments();
  if (courseCount === 0) {
    const now = new Date();
    const seed = [
      {
        title: 'Convierte tu conocimiento médico en un programa educativo premium',
        description: 'Aprende a estructurar tu experiencia clínica en una oferta formativa clara, valiosa y lista para escalar.',
        category: 'Programas Educativos',
        video_url: 'https://www.youtube.com/watch?v=QOzH1D4vIfc',
        banner_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
        content: 'Incluye la estructura base de un programa, transformación de temas clínicos en módulos y criterios para validar una promesa educativa sólida.',
        featured: true,
      },
      {
        title: 'De consulta a curso: diseña una oferta educativa para médicos',
        description: 'Descubre cómo pasar del conocimiento individual a un sistema enseñable que no dependa solo de tu consulta uno a uno.',
        category: 'Programas Educativos',
        video_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        banner_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
        content: 'Trabajamos propuesta, transformación de experiencia clínica en metodología y diseño de una experiencia de aprendizaje profesional.',
      },
      {
        title: 'Posicionamiento médico: conviértete en referente en tu especialidad',
        description: 'Construye autoridad y percepción de valor para que tu conocimiento sea reconocido, buscado y recomendado.',
        category: 'Posicionamiento',
        video_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
        banner_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80',
        content: 'Incluye narrativa de autoridad, diferenciación profesional y mensajes clave para que tu especialidad se convierta en una marca educativa.',
      },
      {
        title: 'Monetiza tu experiencia médica sin improvisar',
        description: 'Aprende a transformar años de práctica en una oferta educativa rentable, ética y replicable.',
        category: 'Monetización',
        video_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        banner_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80',
        content: 'Verás modelos de monetización, estructuración de oferta y cómo fijar una propuesta de valor sin competir por precio.',
      },
      {
        title: 'Escala tu conocimiento médico más allá de la práctica individual',
        description: 'Crea sistemas que te permitan enseñar a más personas con estructura, impacto y consistencia.',
        category: 'Escalamiento',
        video_url: 'https://www.youtube.com/watch?v=hqvqOYh5p5g',
        banner_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
        content: 'Aprenderás a pensar en cohortes, clases, recursos y procesos para dejar de vender solo tiempo y empezar a vender conocimiento.',
      },
      {
        title: 'Diseña una metodología propia para enseñar medicina',
        description: 'Ordena tu expertise en un método claro que facilite el aprendizaje, la confianza y los resultados de tus alumnos.',
        category: 'Autoridad Médica',
        video_url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
        banner_url: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1600&q=80',
        content: 'Incluye marcos para documentar tu enfoque, organizar procesos y crear una experiencia de enseñanza diferenciada.',
      },
      {
        title: 'Estrategia de contenidos para médicos que quieren enseñar',
        description: 'Desarrolla una comunicación que eduque, posicione y prepare a tu audiencia para comprar tu programa.',
        category: 'Estrategia',
        video_url: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
        banner_url: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1600&q=80',
        content: 'Definimos mensajes, piezas de contenido y una ruta para que tu conocimiento se convierta en visibilidad y demanda.',
      },
      {
        title: 'Crea un negocio educativo replicable a partir de tu especialidad',
        description: 'Integra posicionamiento, oferta, estructura y ejecución para construir una línea educativa estable y escalable.',
        category: 'Monetización',
        video_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        banner_url: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=1600&q=80',
        content: 'Unificamos visión de negocio, programa, adquisición y entrega para que tu conocimiento funcione como una unidad replicable.',
      },
    ].map((c) => ({ ...c, id: uuidv4(), created_at: now }));

    await courses.insertMany(seed);
  }

  return { seeded: true };
}

export async function GET(request, { params }) {
  try {
    const path = params.path || [];
    const [a, b] = path;
    const db = await getDb();

    if (!a) return json({ name: 'DocLevel API', ok: true });
    if (a === 'health') return json({ status: 'ok' });

    if (a === 'categories') {
      const cats = await db.collection('courses').distinct('category');
      return json({ categories: cats.sort() });
    }

    if (a === 'auth' && b === 'me') {
      const auth = getAuthFromRequest(request);
      if (!auth) return err('No autenticado', 401);
      return json({ user: auth });
    }

    if (a === 'courses') {
      if (b) {
        const course = await db.collection('courses').findOne({ id: b }, { projection: { _id: 0 } });
        if (!course) return err('Curso no encontrado', 404);
        return json({ course });
      }

      const { searchParams } = new URL(request.url);
      const q = (searchParams.get('search') || '').trim();
      const cat = (searchParams.get('category') || '').trim();
      const filter = {};

      if (cat && cat !== 'all') filter.category = cat;
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ];
      }

      const list = await db
        .collection('courses')
        .find(filter, { projection: { _id: 0 } })
        .sort({ created_at: -1 })
        .toArray();

      return json({ courses: list });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('GET error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path || [];
    const [a, b] = path;
    const db = await getDb();

    if (a === 'seed') {
      const result = await seedIfEmpty();
      return json(result);
    }

    if (a === 'auth' && b === 'login') {
      const body = await request.json();
      const { email, password } = body || {};
      if (!email || !password) return err('Email y contraseña requeridos', 400);

      const admin = await db.collection('admins').findOne({ email: email.toLowerCase().trim() });
      if (!admin) return err('Credenciales inválidas', 401);

      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return err('Credenciales inválidas', 401);

      const token = signToken({ id: admin.id, email: admin.email, role: 'admin' });
      return json({ token, user: { id: admin.id, email: admin.email, role: 'admin' } });
    }

    if (a === 'contact') {
      const body = await request.json();
      const { name, email, message } = body || {};
      if (!name || !email || !message) return err('Todos los campos son obligatorios', 400);

      const doc = { id: uuidv4(), name, email, message, created_at: new Date() };
      await db.collection('contacts').insertOne(doc);
      return json({ success: true, id: doc.id });
    }

    if (a === 'courses') {
      const auth = await requireAdmin(request);
      if (!auth) return err('No autorizado', 401);

      const body = await request.json();
      const { title, description, category, video_url, banner_url, content } = body || {};
      if (!title || !description || !category || !video_url || !banner_url) {
        return err('Faltan campos requeridos', 400);
      }

      const doc = {
        id: uuidv4(),
        title,
        description,
        category,
        video_url,
        banner_url,
        content: content || '',
        featured: !!body.featured,
        created_at: new Date(),
      };

      await db.collection('courses').insertOne(doc);
      return json({ course: doc }, 201);
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('POST error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const path = params.path || [];
    const [a, b] = path;
    const db = await getDb();

    if (a === 'courses' && b) {
      const auth = await requireAdmin(request);
      if (!auth) return err('No autorizado', 401);

      const body = await request.json();
      const allowed = ['title', 'description', 'category', 'video_url', 'banner_url', 'content', 'featured'];
      const update = {};

      for (const k of allowed) {
        if (k in body) update[k] = body[k];
      }

      if (Object.keys(update).length === 0) return err('Sin cambios', 400);

      const r = await db.collection('courses').findOneAndUpdate(
        { id: b },
        { $set: update },
        { returnDocument: 'after', projection: { _id: 0 } }
      );

      const updated = r?.value || r;
      if (!updated) return err('Curso no encontrado', 404);

      return json({ course: updated });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('PUT error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path || [];
    const [a, b] = path;
    const db = await getDb();

    if (a === 'courses' && b) {
      const auth = await requireAdmin(request);
      if (!auth) return err('No autorizado', 401);

      const r = await db.collection('courses').deleteOne({ id: b });
      if (r.deletedCount === 0) return err('Curso no encontrado', 404);

      return json({ success: true });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('DELETE error', e);
    return err(e.message || 'Server error', 500);
  }
}
