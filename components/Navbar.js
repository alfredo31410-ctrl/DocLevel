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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#119ff3]/10 bg-gradient-to-b from-black via-[#020912]/90 to-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center gap-8 px-4 py-4 md:px-8">
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
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === l.href ? 'text-white' : 'text-zinc-400 hover:text-[#4dbdff]'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <Link href="/courses" className="hidden items-center gap-2 text-sm text-zinc-300 hover:text-[#4dbdff] sm:inline-flex">
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </Link>
        <Link href="/admin" className="rounded-md border border-[#119ff3]/25 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-[#119ff3]/60 hover:text-white md:text-sm">
          Admin
        </Link>
      </div>
    </header>
  );
}
