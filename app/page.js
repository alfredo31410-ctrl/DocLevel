import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Info, Play } from 'lucide-react';
import { CourseRow } from '@/components/CourseCard';
import { getDb } from '@/lib/mongodb';
import { allowedCourseCategories } from '@/lib/courseCategories';
import { fallbackCourses } from '@/lib/courseCatalog';
import SiteFooter from '@/components/SiteFooter';

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
    return fallbackCourses;
  }
}

export default async function HomePage() {
  const courses = await fetchCourses();
  const featured = courses.find((c) => c.featured) || courses[0];

  const byCategory = courses.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});

  const orderedCats = [
    ...allowedCourseCategories.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !allowedCourseCategories.includes(c)),
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#02070d_0%,#000_46%,#030912_100%)]">
      <Navbar />

      {featured && (
        <section className="relative w-full overflow-hidden md:min-h-[620px] md:h-[88vh]">
          <div className="md:hidden px-4 pt-28">
            <img
              src={featured.banner_url}
              alt={featured.title}
              className="w-full rounded-lg border border-[#119ff3]/20 bg-black object-contain shadow-2xl shadow-[#119ff3]/10"
            />
          </div>

          <img
            src={featured.banner_url}
            alt={featured.title}
            className="absolute inset-0 hidden h-full w-full scale-105 object-cover md:block"
          />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/70 to-black/35 md:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black via-[#031c31]/70 to-transparent md:block" />
          <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-[#02070d] to-transparent md:block" />

          <div className="relative z-10 flex px-4 pb-14 pt-8 md:h-full md:items-center md:px-8 md:pb-0 md:pt-0">
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="max-w-3xl">
                <div className="mb-4 inline-block rounded-sm border border-[#119ff3]/40 bg-[#119ff3]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#4dbdff] md:text-sm">
                  Curso destacado · {featured.category}
                </div>
                <h1 className="mb-4 text-[2.45rem] font-black leading-[0.98] text-white drop-shadow-2xl sm:text-5xl md:text-6xl">
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
                    className="inline-flex items-center gap-2 rounded-md bg-[#119ff3] px-7 py-3 font-semibold text-white shadow-lg shadow-[#119ff3]/20 transition hover:bg-[#38b6ff]"
                  >
                    <Play className="h-5 w-5 fill-white" /> Ver detalles
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-md border border-[#119ff3]/25 bg-[#07111d]/85 px-7 py-3 font-semibold text-white backdrop-blur transition hover:border-[#119ff3]/60 hover:bg-[#0a1d31]"
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

      <section className="relative z-20 px-4 pb-6 md:-mt-16 md:px-8">
        <div className="mx-auto max-w-[1600px] rounded-lg border border-[#119ff3]/20 bg-[#04101c]/80 p-6 shadow-2xl shadow-[#119ff3]/5 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.25em] text-[#4dbdff]">Propósito</p>
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

      <SiteFooter />
    </div>
  );
}
