import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { CourseRow } from '@/components/CourseCard';

async function fetchCourses() {
  try {
    // Trigger seed then fetch
    const base = process.env.NEXT_PUBLIC_BASE_URL || '';
    await fetch(`${base}/api/seed`, { method: 'POST', cache: 'no-store' }).catch(() => {});
    const res = await fetch(`${base}/api/courses`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses || [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const courses = await fetchCourses();
  const featured = courses.find((c) => c.featured) || courses[0];

  // Group by category
  const byCategory = courses.reduce((acc, c) => {
    (acc[c.category] = acc[c.category] || []).push(c);
    return acc;
  }, {});
  const categoryOrder = ['Fiscal', 'Innovación', 'Contabilidad', 'Marketing', 'Tecnología'];
  const orderedCats = [
    ...categoryOrder.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      {featured && (
        <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={featured.banner_url}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 h-full flex items-end md:items-center pb-20 md:pb-0">
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8">
              <div className="max-w-2xl">
                <div className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-teal-500 font-bold mb-4 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-sm">
                  Destacado · {featured.category}
                </div>
                <h1 className="text-3xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                  {featured.title}
                </h1>
                <p className="text-base md:text-lg text-zinc-200 mb-8 max-w-xl leading-relaxed drop-shadow-lg">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${featured.id}`}
                    className="inline-flex items-center gap-2 bg-white text-black font-semibold px-7 py-3 rounded-md hover:bg-zinc-200 transition shadow-lg"
                  >
                    <Play className="w-5 h-5 fill-black" /> Reproducir
                  </Link>
                  <Link
                    href={`/courses/${featured.id}`}
                    className="inline-flex items-center gap-2 bg-zinc-700/80 text-white font-semibold px-7 py-3 rounded-md hover:bg-zinc-600/80 transition backdrop-blur"
                  >
                    <Info className="w-5 h-5" /> Más información
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category rows */}
      <div className="relative z-20 -mt-16 md:-mt-24">
        {orderedCats.map((cat) => (
          <CourseRow key={cat} title={cat} courses={byCategory[cat]} />
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 px-4 md:px-8 text-zinc-500 text-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>© {new Date().getFullYear()} DocLevel · Aprende con video.</div>
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
