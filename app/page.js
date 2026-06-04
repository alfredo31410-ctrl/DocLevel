import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { CourseRow } from '@/components/CourseCard';
import { getDb } from '@/lib/mongodb';
import { allowedCourseCategories } from '@/lib/courseCategories';

export const dynamic = 'force-dynamic';

async function fetchCourses() {
  try {
    const db = await getDb();
    return await db
      .collection('courses')
      .find({ category: { $in: allowedCourseCategories } }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
  } catch (e) {
    console.error('Home fetchCourses error', e);
    return [];
  }
}

export default async function HomePage() {
  const courses = await fetchCourses();
  const featured = courses.find((c) => c.featured) || courses[0];

  const byCategory = courses.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});

  const categoryOrder = allowedCourseCategories;
  const orderedCats = [
    ...categoryOrder.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {featured && (
        <section className="relative min-h-[620px] w-full overflow-hidden md:h-[88vh]">
          <img
            src={featured.banner_url}
            alt={featured.title}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="relative z-10 flex h-full items-end pb-20 md:items-center md:pb-0">
            <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-block rounded-sm border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-400 md:text-sm">
                  Curso destacado · {featured.category}
                </div>
                <h1 className="mb-4 text-4xl font-black leading-[0.95] text-white drop-shadow-2xl md:text-6xl">
                  {featured.title}
                </h1>
                <p className="mb-4 max-w-2xl text-base leading-relaxed text-zinc-200 drop-shadow-lg md:text-lg">
                  {featured.description}
                </p>
                <p className="mb-8 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                  DocLevel reúne cursos médicos impartidos por doctores especialistas para que
                  profesionales de la salud aprendan con criterio clínico, estructura y aplicación real.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${featured.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3 font-semibold text-black shadow-lg transition hover:bg-zinc-200"
                  >
                    <Play className="h-5 w-5 fill-black" /> Ver curso
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-md bg-zinc-700/80 px-7 py-3 font-semibold text-white backdrop-blur transition hover:bg-zinc-600/80"
                  >
                    <Info className="h-5 w-5" /> Explorar catálogo
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-300">
                  <span>Formación médica especializada</span>
                  <span>Doctores con experiencia clínica</span>
                  <span>Aprendizaje práctico y actualizado</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-20 -mt-6 px-4 pb-6 md:-mt-16 md:px-8">
        <div className="mx-auto max-w-[1600px] rounded-lg border border-white/10 bg-zinc-950/70 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.25em] text-teal-400">Propósito</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-bold text-white md:text-3xl">
            Educación médica digital creada por especialistas, para especialistas.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            DocLevel está diseñado para conectar a médicos que quieren aprender con doctores que
            tienen experiencia, claridad y criterio para enseñar lo que viven todos los días en la práctica clínica.
          </p>
        </div>
      </section>

      <div className="relative z-20">
        {orderedCats.map((cat) => (
          <CourseRow key={cat} title={cat} courses={byCategory[cat]} />
        ))}
      </div>

      <footer className="border-t border-zinc-800 px-4 py-10 text-sm text-zinc-500 md:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 md:flex-row">
          <div>© {new Date().getFullYear()} DocLevel · Cursos médicos impartidos por doctores especialistas.</div>
          <div className="flex gap-6">
            <Link href="/courses" className="hover:text-white">Cursos</Link>
            <Link href="/contact" className="hover:text-white">Contacto</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
