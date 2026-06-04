import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const links = [
  ['Inicio', '/'],
  ['Cursos', '/courses'],
  ['Contacto', '/contact'],
  ['Admin', '/admin'],
  ['Aviso legal', '/aviso-legal'],
  ['Política de privacidad', '/privacidad'],
  ['Política de cookies', '/cookies'],
  ['Términos y condiciones', '/terminos'],
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 md:px-8">
        <h1 className="mb-8 text-3xl font-black text-white md:text-5xl">Mapa del sitio</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-zinc-200 transition hover:border-[#119ff3]/60 hover:text-white">
              {label}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

