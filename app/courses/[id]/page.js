import Navbar from '@/components/Navbar';
import { toEmbedUrl } from '@/lib/videoUtils';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
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
  const embedUrl = toEmbedUrl(course.video_url);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8">
        <Link href="/courses" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver a cursos
        </Link>

        {isComingSoon ? (
          <div className="relative mb-8 overflow-hidden rounded-lg bg-zinc-950 shadow-2xl shadow-black ring-1 ring-zinc-800">
            <img src={course.banner_url} alt={course.title} className="h-[360px] w-full object-cover opacity-70 md:h-[460px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded bg-teal-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                <Clock className="h-4 w-4" />
                Próximamente
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">{course.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-200 md:text-lg">
                Estamos preparando esta especialidad para DocLevel. Muy pronto estará disponible con doctores especialistas,
                contenido estructurado y una experiencia pensada para profesionales de la salud.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/courses" className="rounded-md bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200">
                  Ver cursos disponibles
                </Link>
                <Link href="/contact" className="rounded-md bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700">
                  Avisarme cuando abra
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg bg-zinc-950 shadow-2xl shadow-black ring-1 ring-zinc-800">
            <iframe
              src={embedUrl}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 inline-block rounded bg-teal-600 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
              {course.category}
            </div>
            <h1 className="mb-5 text-3xl font-black leading-tight text-white md:text-5xl">{course.title}</h1>
            <p className="mb-6 text-lg leading-relaxed text-zinc-300">{course.description}</p>
            {course.content && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-500">
                  Recursos adicionales
                </h2>
                <p className="whitespace-pre-wrap text-zinc-300">{course.content}</p>
              </div>
            )}
          </div>

          {related.length > 0 && (
            <aside className="lg:w-80 lg:flex-shrink-0">
              <h3 className="mb-4 font-bold text-white">Más en {course.category}</h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/courses/${r.id}`}
                    className="group flex gap-3 rounded-lg bg-zinc-900/50 p-2 transition hover:bg-zinc-900"
                  >
                    <img src={r.banner_url} alt={r.title} className="h-16 w-28 flex-shrink-0 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500">
                        {r.category}
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-white group-hover:text-teal-400">
                        {r.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
