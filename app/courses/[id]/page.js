import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck, Clock, HeartPulse, ShieldCheck, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { fallbackCourses } from '@/lib/courseCatalog';

async function getCourse(id) {
  try {
    const db = await getDb();
    return await db.collection('courses').findOne({ id }, { projection: { _id: 0 } });
  } catch (error) {
    console.error('Course getCourse error', error);
    return fallbackCourses.find((course) => course.id === id) || null;
  }
}

async function getRelated(category, excludeId) {
  try {
    const db = await getDb();
    return await db
      .collection('courses')
      .find({ category, id: { $ne: excludeId } }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(6)
      .toArray();
  } catch (error) {
    console.error('Course getRelated error', error);
    return fallbackCourses
      .filter((course) => course.category === category && course.id !== excludeId)
      .slice(0, 6);
  }
}

export default async function CoursePage({ params }) {
  const course = await getCourse(params.id);

  if (!course) {
    return notFound();
  }

  const related = await getRelated(course.category, course.id);
  const isComingSoon = course.status === 'coming_soon' || course.coming_soon;
  const registrationUrl = course.landing_url || '/papa-primerizo';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#02070d_0%,#000_45%,#030912_100%)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8">
        <Link href="/courses" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver a cursos
        </Link>

        <section className="overflow-hidden rounded-lg border border-[#119ff3]/20 bg-[#06111d] shadow-2xl shadow-[#119ff3]/5">
          <div className="relative md:min-h-[460px]">
            <div className="md:hidden">
              <img src={course.banner_url} alt={course.title} className="w-full bg-black object-contain" />
            </div>
            <img src={course.banner_url} alt={course.title} className="absolute inset-0 hidden h-full w-full object-cover opacity-70 md:block" />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/70 to-black/20 md:block" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black via-[#031c31]/70 to-transparent md:block" />
            <div className="relative z-10 flex p-6 md:min-h-[460px] md:items-end md:p-10">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded bg-[#119ff3] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  {isComingSoon ? <Clock className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}
                  {isComingSoon ? 'Próximamente' : course.category}
                </div>
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">{course.title}</h1>
                {course.description && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-200 md:text-lg">{course.description}</p>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  {isComingSoon ? (
                    <>
                      <Link href="/courses" className="rounded-md bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200">
                        Ver cursos disponibles
                      </Link>
                      <Link href="/contact" className="rounded-md border border-[#119ff3]/25 bg-[#07111d]/85 px-6 py-3 font-semibold text-white transition hover:border-[#119ff3]/60 hover:bg-[#0a1d31]">
                        Avisarme cuando abra
                      </Link>
                    </>
                  ) : (
                    <Link href={registrationUrl} className="rounded-md bg-[#119ff3] px-7 py-3 font-semibold text-white shadow-lg shadow-[#119ff3]/20 transition hover:bg-[#38b6ff]">
                      Registrarme
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            {!isComingSoon && (
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile icon={<UserRound className="h-5 w-5" />} label="Experto" value={course.expert || 'Especialista DocLevel'} />
                <InfoTile icon={<CalendarCheck className="h-5 w-5" />} label="Duración" value={course.duration || 'Acceso digital'} />
                <InfoTile icon={<ShieldCheck className="h-5 w-5" />} label="Inversión" value={course.price || 'Registro abierto'} />
              </div>
            )}

            {course.content && (
              <div className="rounded-lg border border-[#119ff3]/15 bg-[#06111d] p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Detalles del programa</h2>
                <p className="whitespace-pre-wrap leading-7 text-zinc-300">{course.content}</p>
              </div>
            )}

            {!isComingSoon && (
              <div className="rounded-lg border border-[#119ff3]/30 bg-[#119ff3]/10 p-6">
                <h2 className="mb-3 text-xl font-bold text-white">Qué aprenderás</h2>
                <div className="grid gap-3 text-sm text-zinc-200 md:grid-cols-2">
                  {[
                    'Qué es normal durante las primeras horas',
                    'Qué señales sí deben preocuparte',
                    'Cómo cuidar a tu bebé desde el nacimiento',
                    'Primer mes de vida: cuidados esenciales',
                    'Criterios para buscar atención médica',
                    'Guía pediátrica clara para casa',
                  ].map((item) => (
                    <div key={item} className="rounded border border-[#119ff3]/15 bg-black/30 p-3">{item}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            {!isComingSoon && (
              <div className="rounded-lg border border-[#119ff3]/15 bg-[#06111d] p-6">
                <h3 className="text-lg font-bold text-white">Inscripción</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Continúa al landing de papás primerizos para ver la oferta, registro y próximos pasos del programa.
                </p>
                <Link href={registrationUrl} className="mt-5 inline-flex w-full justify-center rounded-md bg-[#119ff3] px-5 py-3 font-semibold text-white transition hover:bg-[#38b6ff]">
                  Registrarme ahora
                </Link>
              </div>
            )}

            {related.length > 0 && (
              <div className="rounded-lg border border-[#119ff3]/15 bg-[#04101c] p-4">
                <h3 className="mb-4 font-bold text-white">Más en {course.category}</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.id} href={`/courses/${r.id}`} className="group flex gap-3 rounded-lg bg-[#06111d] p-2 transition hover:bg-[#0a1d31]">
                      <img src={r.banner_url} alt={r.title} className="h-16 w-28 flex-shrink-0 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#4dbdff]">{r.category}</div>
                        <div className="line-clamp-2 text-sm leading-snug text-white group-hover:text-[#4dbdff]">{r.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-[#119ff3]/15 bg-[#06111d] p-4">
      <div className="mb-3 text-[#4dbdff]">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
