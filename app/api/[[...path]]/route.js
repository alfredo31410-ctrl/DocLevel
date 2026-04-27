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

// Seed data (idempotent)
async function seedIfEmpty() {
  const db = await getDb();
  const admins = db.collection('admins');
  const courses = db.collection('courses');

  const adminCount = await admins.countDocuments();
  if (adminCount === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await admins.insertOne({ id: uuidv4(), email: 'admin@doclevel.com', password: hash, created_at: new Date() });
  }

  const courseCount = await courses.countDocuments();
  if (courseCount === 0) {
    const now = new Date();
    const seed = [
      {
        title: 'Fundamentos de Contabilidad para Emprendedores',
        description: 'Aprende los principios básicos de la contabilidad y cómo aplicarlos en tu negocio desde el primer día.',
        category: 'Contabilidad',
        video_url: 'https://www.youtube.com/watch?v=QOzH1D4vIfc',
        banner_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
        content: 'Incluye hojas de cálculo, plantillas descargables y casos prácticos reales.',
        featured: true,
      },
      {
        title: 'Impuestos y Régimen Fiscal 2025',
        description: 'Guía completa sobre las obligaciones fiscales actuales y las últimas reformas tributarias.',
        category: 'Fiscal',
        video_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        banner_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80',
        content: 'Analizamos IVA, ISR, y cumplimiento fiscal paso a paso.',
      },
      {
        title: 'Innovación Disruptiva en la Era Digital',
        description: 'Descubre cómo las empresas líderes aplican modelos de innovación para crecer exponencialmente.',
        category: 'Innovación',
        video_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
        banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
        content: 'Casos de estudio: Tesla, Netflix, Airbnb.',
      },
      {
        title: 'Marketing Digital: Estrategia Completa',
        description: 'Domina SEO, redes sociales, contenidos y publicidad pagada para escalar tu marca online.',
        category: 'Marketing',
        video_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        banner_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
        content: 'Plantillas de campañas y checklist de SEO incluidos.',
      },
      {
        title: 'Programación con Inteligencia Artificial',
        description: 'Cómo usar LLMs y herramientas de IA para multiplicar tu productividad como desarrollador.',
        category: 'Tecnología',
        video_url: 'https://www.youtube.com/watch?v=hqvqOYh5p5g',
        banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
        content: 'Integra GPT, Claude y Gemini en tus proyectos.',
      },
      {
        title: 'Estados Financieros Paso a Paso',
        description: 'Aprende a leer y construir balance general, estado de resultados y flujo de efectivo.',
        category: 'Contabilidad',
        video_url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
        banner_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
        content: 'Ejercicios prácticos con Excel.',
      },
      {
        title: 'Cultura de Innovación en Equipos',
        description: 'Metodologías ágiles y design thinking para transformar la cultura de tu empresa.',
        category: 'Innovación',
        video_url: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
        banner_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
        content: 'Ejercicios y dinámicas para aplicar con tu equipo.',
      },
      {
        title: 'Deducciones Fiscales: Guía Práctica',
        description: 'Identifica las deducciones que aplican a tu actividad y optimiza tu carga tributaria legalmente.',
        category: 'Fiscal',
        video_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        banner_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
        content: 'Cubre personas físicas con actividad empresarial y pequeñas empresas.',
      },
      {
        title: 'Ciberseguridad para Pequeñas Empresas',
        description: 'Protege tu información y la de tus clientes con prácticas de seguridad modernas.',
        category: 'Tecnología',
        video_url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
        banner_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80',
        content: 'Incluye lista de herramientas recomendadas.',
      },
      {
        title: 'Branding y Posicionamiento',
        description: 'Construye una marca memorable y diferénciate de la competencia en un mercado saturado.',
        category: 'Marketing',
        video_url: 'https://www.youtube.com/watch?v=iG9CE55wbtY',
        banner_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
        content: 'Framework completo para auditar tu marca.',
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
      const list = await db.collection('courses').find(filter, { projection: { _id: 0 } }).sort({ created_at: -1 }).toArray();
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
        title, description, category, video_url, banner_url,
        content: content || '',
        featured: !!body.featured,
        created_at: new Date(),
      };
      await db.collection('courses').insertOne(doc);
      const { _id, ...clean } = doc;
      return json({ course: clean }, 201);
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
      for (const k of allowed) if (k in body) update[k] = body[k];
      if (Object.keys(update).length === 0) return err('Sin cambios', 400);
      const r = await db.collection('courses').findOneAndUpdate(
        { id: b }, { $set: update }, { returnDocument: 'after', projection: { _id: 0 } }
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
