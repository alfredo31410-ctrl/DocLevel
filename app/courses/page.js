'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    fetch(`/api/courses?${params}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-28 md:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black text-white md:text-5xl">Explora los cursos de DocLevel</h1>
          <p className="max-w-3xl text-zinc-400">
            Encuentra cursos médicos creados por doctores especialistas para profesionales de la salud
            que buscan actualizarse, profundizar y aplicar mejor su conocimiento clínico.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar por título, descripción o especialidad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
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
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white'
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
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white'
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
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group overflow-hidden rounded-lg bg-zinc-900 transition hover:ring-2 hover:ring-teal-500/60"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={c.banner_url} alt={c.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 top-3 rounded bg-teal-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {c.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-white">{c.title}</h3>
                  <p className="line-clamp-3 text-sm text-zinc-400">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
