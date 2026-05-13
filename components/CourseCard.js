'use client';

import Link from 'next/link';
import { Clock, Play } from 'lucide-react';

export function CourseCard({ course, size = 'md' }) {
  const isComingSoon = course.status === 'coming_soon' || course.coming_soon;
  const widths = {
    sm: 'w-48 md:w-56',
    md: 'w-60 md:w-72',
    lg: 'w-72 md:w-80',
  };
  return (
    <Link
      href={`/courses/${course.id}`}
      className={`group relative flex-shrink-0 ${widths[size]} rounded-md overflow-hidden bg-zinc-900 transition-all duration-300 hover:scale-[1.04] hover:z-10 hover:shadow-2xl hover:shadow-black/60`}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.banner_url}
          alt={course.title}
          className="w-full h-full object-cover group-hover:brightness-110 transition"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70" />
        <div className="absolute left-3 top-3 rounded bg-teal-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {isComingSoon ? 'Próximamente' : course.category}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl">
            {isComingSoon ? (
              <Clock className="h-6 w-6 text-black" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-black text-black" />
            )}
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[11px] uppercase tracking-widest text-teal-500 font-semibold mb-1">{course.category}</div>
        <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{course.title}</h3>
      </div>
    </Link>
  );
}

export function CourseRow({ title, courses }) {
  if (!courses?.length) return null;
  return (
    <section className="mb-10">
      <h2 className="text-lg md:text-2xl font-bold text-white mb-3 px-4 md:px-8">{title}</h2>
      <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x px-4 md:px-8 pb-4 no-scrollbar">
        {courses.map((c) => (
          <div key={c.id} className="snap-start">
            <CourseCard course={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
