import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

export default function LegalPage({ title, children }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 md:px-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-teal-400">DocLevel</p>
        <h1 className="mb-8 text-3xl font-black text-white md:text-5xl">{title}</h1>
        <div className="space-y-5 rounded-lg border border-zinc-800 bg-zinc-900 p-6 leading-7 text-zinc-300 md:p-8">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
