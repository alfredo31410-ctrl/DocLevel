import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-10 text-sm text-zinc-500 md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} DocLevel · Educación médica digital.</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/courses" className="hover:text-white">Cursos</Link>
          <Link href="/contact" className="hover:text-white">Contacto</Link>
          <Link href="/aviso-legal" className="hover:text-white">Aviso legal</Link>
          <Link href="/privacidad" className="hover:text-white">Política de privacidad</Link>
          <Link href="/cookies" className="hover:text-white">Política de cookies</Link>
        </div>
      </div>
    </footer>
  );
}
