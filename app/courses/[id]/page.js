import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck, Clock, HeartPulse, ShieldCheck, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';

async function getCourse(id) {
  const db = await getDb();
  return await db.collection('courses').findOne({ id }, { projection: { _id: 0 } });
}

async function getRelated(category, excludeId) {
  const db = await getDb();
  return await db
    .collection('courses')
    .find({ category, id: { $ne: excludeId } }, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .limit(6)
    .toArray();
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
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8">
        <Link href="/courses" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver a cursos
        </Link>

        <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="relative min-h-[420px]">
            <img src={course.banner_url} alt={course.title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="relative z-10 flex min-h-[420px] items-end p-6 md:p-10">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded bg-teal-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  {isComingSoon ? <Clock className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}
                  {isComingSoon ? 'Próximamente' : course.category}
                </div>
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">{course.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-200 md:text-lg">{course.description}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {isComingSoon ? (
                    <>
                      <Link href="/courses" className="rounded-md bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200">
                        Ver cursos disponibles
                      </Link>
                      <Link href="/contact" className="rounded-md bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700">
                        Avisarme cuando abra
                      </Link>
                    </>
                  ) : (
                    <Link href={registrationUrl} className="rounded-md bg-white px-7 py-3 font-semibold text-black shadow-lg transition hover:bg-zinc-200">
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
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Detalles del programa</h2>
                <p className="whitespace-pre-wrap leading-7 text-zinc-300">{course.content}</p>
              </div>
            )}

            {!isComingSoon && (
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-6">
                <h2 className="mb-3 text-xl font-bold text-white">Ruta de aprendizaje</h2>
                <div className="grid gap-3 text-sm text-zinc-200 md:grid-cols-2">
                  {[
                    'Tu bebé en su primer mes: 0 a 30 días',
                    'Los primeros 3 meses de tu bebé',
                    'Tu bebé de 3 a 6 meses',
                    'Comida sólida paso a paso',
                    'Tu bebé de 6 a 12 meses',
                    'Sesiones en vivo de preguntas y respuestas',
                  ].map((item) => (
                    <div key={item} className="rounded border border-white/10 bg-black/30 p-3">{item}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            {!isComingSoon && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-lg font-bold text-white">Inscripción</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Continúa al landing de papás primerizos para ver la oferta, registro y próximos pasos del programa.
                </p>
                <Link href={registrationUrl} className="mt-5 inline-flex w-full justify-center rounded-md bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">
                  Registrarme ahora
                </Link>
              </div>
            )}

            {related.length > 0 && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <h3 className="mb-4 font-bold text-white">Más en {course.category}</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.id} href={`/courses/${r.id}`} className="group flex gap-3 rounded-lg bg-zinc-900/50 p-2 transition hover:bg-zinc-900">
                      <img src={r.banner_url} alt={r.title} className="h-16 w-28 flex-shrink-0 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500">{r.category}</div>
                        <div className="line-clamp-2 text-sm leading-snug text-white group-hover:text-teal-400">{r.title}</div>
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 text-teal-400">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
