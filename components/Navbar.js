'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/courses', label: 'Cursos' },
  { href: '/contact', label: 'Contacto' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto flex items-center gap-8 px-4 md:px-8 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">Doc<span className="text-red-500">Level</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === l.href ? 'text-white' : 'text-zinc-400 hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <Link href="/courses" className="hidden sm:inline-flex items-center gap-2 text-zinc-300 hover:text-white text-sm">
          <Search className="w-4 h-4" />
          <span>Buscar</span>
        </Link>
        <Link href="/admin" className="text-xs md:text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-md px-3 py-1.5 transition">
          Admin
        </Link>
      </div>
    </header>
  );
}
