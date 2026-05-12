'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
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
        <Link href="/" className="group flex items-center">
          <Image
            src="/brand/doclevel-logo.png"
            alt="DocLevel"
            width={190}
            height={72}
            priority
            className="h-12 w-auto object-contain transition duration-300 group-hover:scale-[1.02] md:h-14"
          />
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
