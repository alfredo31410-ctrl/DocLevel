'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, Play, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import SiteFooter from '@/components/SiteFooter';

const categoryOrder = ['Pediatría', 'Odontología', 'Ginecología', 'Cardiología'];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch('/api/categories', { signal: ctrl.signal });
        const data = await response.json();
        if (!active) return;

        const cats = data.categories || [];
        setCategories([
          ...categoryOrder.filter((c) => cats.includes(c)),
          ...cats.filter((c) => !categoryOrder.includes(c)),
        ]);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        console.error('Categories fetch error', error);
      }
    }

    loadCategories();

    return () => {
      active = false;
      if (!ctrl.signal.aborted) {
        ctrl.abort(new DOMException('Categories request cancelled', 'AbortError'));
      }
    };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    let active = true;

    async function loadCourses() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'all') params.set('category', category);

      try {
        const response = await fetch(`/api/courses?${params}`, { signal: ctrl.signal });
        const data = await response.json();
        if (active) setCourses(data.courses || []);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        console.error('Courses fetch error', error);
        if (active) setCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      active = false;
      if (!ctrl.signal.aborted) {
        ctrl.abort(new DOMException('Courses request cancelled', 'AbortError'));
      }
    };
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#02070d_0%,#000_48%,#030912_100%)]">
      <Navbar />
      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-28 md:px-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#4dbdff]">Catálogo</p>
          <h1 className="mb-2 text-3xl font-black text-white md:text-5xl">Explora los cursos de DocLevel</h1>
          <p className="max-w-3xl text-zinc-400">
            Encuentra cursos médicos creados por doctores especialistas para profesionales de la salud
            que buscan actualizarse, profundizar y aplicar mejor su conocimiento clínico.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4dbdff]" />
            <Input
              placeholder="Buscar por título, descripción o especialidad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-[#119ff3]/20 bg-[#06111d] pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-[#119ff3]"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <Button
            variant={category === 'all' ? 'default' : 'outline'}
            onClick={() => setCategory('all')}
            className={cn(
              'rounded-full text-sm',
              category === 'all'
                ? 'bg-[#119ff3] text-white hover:bg-[#38b6ff]'
                : 'border-[#119ff3]/25 bg-transparent text-zinc-300 hover:bg-[#071b2d] hover:text-white'
            )}
          >
            Todas
          </Button>
          {categories.map((c) => (
            <Button
              key={c}
              variant={category === c ? 'default' : 'outline'}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full text-sm',
                category === c
                  ? 'bg-[#119ff3] text-white hover:bg-[#38b6ff]'
                  : 'border-[#119ff3]/25 bg-transparent text-zinc-300 hover:bg-[#071b2d] hover:text-white'
              )}
            >
              {c}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <p className="text-lg">No se encontraron cursos.</p>
            <p className="text-sm">Intenta con otros términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((c) => (
              <CourseGridCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

function CourseGridCard({ course }) {
  const isComingSoon = course.status === 'coming_soon' || course.coming_soon;

  return (
  <Link
    href={
      course.title === 'Las Primeras Horas de tu Bebé'
        ? '/landings/papa-primerizo-inscripcion'
        : `/courses/${course.id}`
    }
    className={cn(
        'group flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-[#119ff3]/10 bg-[#06111d] transition hover:border-[#119ff3]/45 hover:ring-2 hover:ring-[#119ff3]/30 lg:min-h-[370px] xl:min-h-[405px]',
        isComingSoon && 'opacity-55 saturate-50 hover:opacity-75'
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={course.banner_url} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-[#031c31]/35 to-transparent" />
        {isComingSoon && <div className="absolute inset-0 bg-black/35" />}
        <div className="absolute left-3 top-3 rounded bg-[#119ff3] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {course.category}
        </div>
        {isComingSoon && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            <Clock className="h-3 w-3" />
            Próximamente
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={cn('line-clamp-2 font-semibold text-white', !isComingSoon && 'mb-2')}>{course.title}</h3>
        {!isComingSoon && <p className="line-clamp-3 text-sm text-zinc-400">{course.description}</p>}
        {!isComingSoon && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#119ff3]/10 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Inversión</p>
              <p className="text-xl font-black leading-none text-[#4fe5ff]">{course.price || '487 MXN'}</p>
            </div>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#119ff3] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#119ff3]/10 transition group-hover:bg-[#38b6ff]">
              <Play className="h-4 w-4 fill-white" />
              Ver curso
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
