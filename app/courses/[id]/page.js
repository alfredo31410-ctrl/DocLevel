import Navbar from '@/components/Navbar';
import { toEmbedUrl } from '@/lib/videoUtils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getCourse(id) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const res = await fetch(`${base}/api/courses/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.course || null;
}

async function getRelated(category, excludeId) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const res = await fetch(`${base}/api/courses?category=${encodeURIComponent(category)}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.courses || []).filter((c) => c.id !== excludeId).slice(0, 6);
}

export default async function CoursePage({ params }) {
  const course = await getCourse(params.id);
  if (!course) return notFound();
  const related = await getRelated(course.category, course.id);
  const embedUrl = toEmbedUrl(course.video_url);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 md:px-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a cursos
        </Link>

        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 ring-1 ring-zinc-800 shadow-2xl shadow-black mb-8">
          <iframe
            src={embedUrl}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="inline-block text-xs uppercase tracking-widest bg-red-600 text-white font-bold px-2.5 py-1 rounded mb-4">
              {course.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">{course.title}</h1>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">{course.description}</p>
            {course.content && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-sm uppercase tracking-widest text-red-500 font-bold mb-3">Recursos adicionales</h2>
                <p className="text-zinc-300 whitespace-pre-wrap">{course.content}</p>
              </div>
            )}
          </div>
          {related.length > 0 && (
            <aside className="lg:w-80 flex-shrink-0">
              <h3 className="text-white font-bold mb-4">Más en {course.category}</h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/courses/${r.id}`} className="flex gap-3 group bg-zinc-900/50 hover:bg-zinc-900 rounded-lg p-2 transition">
                    <img src={r.banner_url} alt={r.title} className="w-28 h-16 object-cover rounded flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-red-500 font-semibold">{r.category}</div>
                      <div className="text-sm text-white group-hover:text-red-400 line-clamp-2 leading-snug">{r.title}</div>
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
