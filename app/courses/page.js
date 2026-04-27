'use client';

import { useEffect, useMemo, useState } from 'react';
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
      <div className="pt-28 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">Explora todos los cursos</h1>
          <p className="text-zinc-400">Encuentra el contenido ideal para potenciar tu carrera.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Buscar por título, descripción o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <Button
            variant={category === 'all' ? 'default' : 'outline'}
            onClick={() => setCategory('all')}
            className={cn(
              'rounded-full text-sm',
              category === 'all' ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-900'
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
                category === c ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-900'
              )}
            >
              {c}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg">No se encontraron cursos.</p>
            <p className="text-sm">Intenta con otros términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group bg-zinc-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500/60 transition"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={c.banner_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-red-600 text-white font-bold px-2 py-1 rounded">
                    {c.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 mb-2">{c.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
