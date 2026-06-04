import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { signToken, getAuthFromRequest } from '@/lib/auth';
import doclevelCourses from '@/lib/doclevelCourses.json';
import { allowedCourseCategories } from '@/lib/courseCategories';
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
  const courses = db.collection('courses');

  const courseCount = await courses.countDocuments();
  if (courseCount === 0) {
    const now = Date.now();
    const seed = doclevelCourses.map((course, index) => ({
      ...course,
      id: uuidv4(),
      created_at: new Date(now - index * 1000),
    }));

    await courses.insertMany(seed);
  }

  return { seeded: true };
}

export async function GET(request, { params }) {
  try {
    const path = params.path || [];
    const [a, b] = path;

    if (!a) return json({ name: 'DocLevel API', ok: true });
    if (a === 'health') return json({ status: 'ok' });

    if (a === 'categories') {
      const db = await getDb();
      const cats = await db.collection('courses').distinct('category', {
        category: { $in: allowedCourseCategories },
      });
      return json({ categories: cats.sort() });
    }

    if (a === 'auth' && b === 'me') {
      const auth = getAuthFromRequest(request);
      if (!auth) return err('No autenticado', 401);
      return json({ user: auth });
    }

    if (a === 'courses') {
      const db = await getDb();
      if (b) {
        const course = await db.collection('courses').findOne({ id: b }, { projection: { _id: 0 } });
        if (!course) return err('Curso no encontrado', 404);
        return json({ course });
      }

      const { searchParams } = new URL(request.url);
      const q = (searchParams.get('search') || '').trim();
      const cat = (searchParams.get('category') || '').trim();
      const filter = { category: { $in: allowedCourseCategories } };

      if (cat && cat !== 'all') {
        if (!allowedCourseCategories.includes(cat)) return json({ courses: [] });
        filter.category = cat;
      }
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

    if (a === 'seed') {
      if (process.env.NODE_ENV === 'production') {
        const setupToken = process.env.SETUP_TOKEN;
        const providedToken = request.headers.get('x-setup-token');
        if (!setupToken || providedToken !== setupToken) {
          return err('No autorizado', 401);
        }
      }

      const result = await seedIfEmpty();
      return json(result);
    }

    if (a === 'auth' && b === 'login') {
      const db = await getDb();
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
      const db = await getDb();
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
      const db = await getDb();

      const body = await request.json();
      const { title, description, category, banner_url, content } = body || {};
      if (!title || !description || !category || !banner_url) {
        return err('Faltan campos requeridos', 400);
      }
      if (!allowedCourseCategories.includes(category)) {
        return err('Especialidad no permitida', 400);
      }

      const doc = {
        id: uuidv4(),
        title,
        description,
        category,
        video_url: body.video_url || '',
        landing_url: body.landing_url || '',
        banner_url,
        content: content || '',
        status: body.status || 'available',
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

    if (a === 'courses' && b) {
      const auth = await requireAdmin(request);
      if (!auth) return err('No autorizado', 401);
      const db = await getDb();

      const body = await request.json();
      const allowed = ['title', 'description', 'category', 'video_url', 'landing_url', 'banner_url', 'content', 'featured', 'status', 'expert', 'duration', 'price'];
      const update = {};

      for (const k of allowed) {
        if (k in body) update[k] = body[k];
      }
      if (update.category && !allowedCourseCategories.includes(update.category)) {
        return err('Especialidad no permitida', 400);
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

    if (a === 'courses' && b) {
      const auth = await requireAdmin(request);
      if (!auth) return err('No autorizado', 401);
      const db = await getDb();

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
