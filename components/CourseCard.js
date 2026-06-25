'use client';

import Link from 'next/link';
import { Clock, Play } from 'lucide-react';

export function CourseCard({ course }) {
  const isComingSoon = course.status === 'coming_soon' || course.coming_soon;

  return (
    <Link
      href={`/courses/${course.id}`}
      className={`group relative block w-full overflow-hidden rounded-md border border-[#119ff3]/10 bg-[#06111d] transition-all duration-300 hover:z-10 hover:border-[#119ff3]/45 hover:shadow-2xl hover:shadow-[#119ff3]/10 ${
        isComingSoon ? 'opacity-55 saturate-50 hover:opacity-75' : 'hover:scale-[1.04]'
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.banner_url}
          alt={course.title}
          className="h-full w-full object-cover transition group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#031c31]/45 to-transparent opacity-90" />
        {isComingSoon && <div className="absolute inset-0 bg-black/35" />}
        <div className="absolute left-3 top-3 rounded bg-[#119ff3] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
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
        {!isComingSoon && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#4dbdff]">{course.category}</div>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white md:text-base">{course.title}</h3>
        {!isComingSoon && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#119ff3]/10 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Inversión</p>
              <p className="text-lg font-black text-[#4dbdff]">{course.price || '$487 MXN'}</p>
            </div>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#119ff3] px-3 text-xs font-semibold text-white transition group-hover:bg-[#38b6ff]">
              <Play className="h-4 w-4 fill-white" />
              Ver curso
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function CourseRow({ title, courses }) {
  if (!courses?.length) return null;
  return (
    <section className="mb-10">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <h2 className="mb-3 text-center text-lg font-bold text-white md:text-2xl">{title}</h2>
        <div className="grid w-full grid-cols-1 gap-4 pb-4">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
