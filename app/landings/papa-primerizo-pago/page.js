import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import {
  ArrowRight,
  Baby,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  PlayCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export const metadata = {
  title: 'Las Primeras Horas de tu Bebe | DocLevel',
  description:
    'Curso de pago para papas primerizos sobre cuidados esenciales del bebe desde el nacimiento. Inversion: $487 MXN.',
};

const paymentHref = 'https://pay.hotmart.com/P106439324N?off=5q438z0i&checkoutMode=10&bid=1782322313291';

const included = [
  'Que es normal en las primeras horas de vida',
  'Senales de alarma que si requieren atencion medica',
  'Cuidados practicos desde el nacimiento',
  'Alimentacion, sueno, llanto y cambios esperados',
  'Guia clara para vivir el primer mes con mas seguridad',
  'Criterio pediatrico explicado en lenguaje sencillo',
];

const modules = [
  'Primer contacto con tu bebe y adaptacion al nacimiento',
  'Respiracion, coloracion, temperatura y signos normales',
  'Lactancia, evacuaciones, sueno y cuidados en casa',
  'Cuando observar, cuando llamar y cuando acudir a urgencias',
];

export default function PapaPrimerizoPagoLanding() {
  return (
    <div className="min-h-screen bg-[#020711] pb-24 text-white md:pb-0">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pb-20 lg:pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,159,243,0.22),transparent_34%),linear-gradient(180deg,#03142a_0%,#020711_58%,#000_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.58),rgba(0,0,0,0.2),rgba(0,0,0,0.72))]" />

          <div className="relative z-10 mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
            <div className="pt-3 text-center lg:text-left">
              <div className="mb-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <span className="inline-flex items-center rounded-full border border-[#4ee7ef]/55 bg-[#4ee7ef]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#4ee7ef]">
                  Pediatria / Papas primerizos
                </span>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-200">
                  Curso en linea
                </span>
              </div>

              <h1 className="mx-auto max-w-4xl text-[2.75rem] font-black uppercase leading-[0.95] tracking-normal text-white sm:text-6xl md:text-7xl lg:mx-0">
                Las primeras horas de tu bebe
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-black uppercase leading-snug text-white md:text-2xl lg:mx-0">
                Aprende que es normal, que debe preocuparte y como cuidar a tu bebe desde el nacimiento
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg lg:mx-0">
                Una guia pediatrica directa para papas primerizos que quieren tomar decisiones con
                calma, entender las senales importantes y sentirse acompanados durante el primer mes.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <PaymentButton href={paymentHref} label="Inscribirme ya!" />
                <Link
                  href="#contenido"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md border border-white/18 bg-white/5 px-7 py-4 text-base font-black uppercase tracking-wide text-white transition hover:border-[#4ee7ef]/70 hover:bg-[#4ee7ef]/10 sm:w-auto"
                >
                  Ver contenido
                </Link>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-[#00ddff] lg:text-left">
                Acceso sencillo: toca el boton, solicita tu pago y completa tu inscripcion.
              </p>
            </div>

            <aside
              id="inscripcion"
              className="rounded-sm border border-[#4ee7ef]/35 bg-[#061b34]/86 p-5 shadow-2xl shadow-[#119ff3]/20 backdrop-blur md:p-6"
            >
              <div className="overflow-hidden rounded-sm border border-[#119ff3]/25 bg-black/35">
                <img
                  src="/brand/Copia de BANNER - CAMPAÑA.png"
                  alt="Curso Las Primeras Horas de tu Bebe"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>

              <div className="mt-6 border border-[#4ee7ef]/35 bg-[#041324] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">Inversion</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-black leading-none text-[#4ee7ef]">$487</span>
                  <span className="pb-1 text-lg font-black text-white">MXN</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-zinc-300">
                  Impartido por el <strong className="text-white">Dr. Raul G. de Lira Lopez</strong>,
                  especialista en pediatria.
                </p>
                <PaymentButton href={paymentHref} label="Inscribirme ya!" className="mt-6" />
              </div>
            </aside>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-4 md:grid-cols-3">
            <InfoCard icon={<Stethoscope className="h-6 w-6" />} label="Experto" value="Dr. Raul G. de Lira Lopez" />
            <InfoCard icon={<CalendarCheck className="h-6 w-6" />} label="Acceso" value="Curso digital en linea" />
            <InfoCard icon={<ShieldCheck className="h-6 w-6" />} label="Precio" value="$487 MXN" />
          </div>
          <div className="mx-auto mt-6 max-w-[1120px]">
            <PaymentStrip />
          </div>
        </section>

        <section id="contenido" className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#4ee7ef]">Contenido del curso</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">
                Una guia practica para cuidar a tu bebe con mas seguridad.
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-300">
                Pensado para resolver dudas reales de los primeros dias: que observar, que no
                normalizar y como actuar sin entrar en panico.
              </p>
              <PaymentButton href={paymentHref} label="Quiero pagar mi acceso" className="mt-7" />
            </div>

            <div className="grid gap-3">
              {included.map((item) => (
                <div key={item} className="flex gap-3 border border-[#119ff3]/18 bg-[#06111d] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4ee7ef]" />
                  <span className="text-sm leading-6 text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8">
          <div className="mx-auto max-w-[1120px] border border-[#119ff3]/20 bg-[#041324] p-6 md:p-8">
            <div className="mb-7 flex items-center gap-3">
              <PlayCircle className="h-7 w-7 text-[#4ee7ef]" />
              <h2 className="text-2xl font-black text-white md:text-3xl">Lo que vas a revisar</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {modules.map((module, index) => (
                <div key={module} className="border border-white/10 bg-black/24 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4ee7ef]">
                    Modulo {index + 1}
                  </p>
                  <p className="mt-3 text-base font-semibold leading-6 text-white">{module}</p>
                </div>
              ))}
            </div>
            <div className="mt-7">
              <PaymentButton href={paymentHref} label="Pagar el curso ahora" />
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-6 border border-[#4ee7ef]/35 bg-[linear-gradient(135deg,#08223d,#03101e)] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-[#4ee7ef]">
                <Baby className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.22em]">Inscripcion abierta</span>
              </div>
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                Empieza hoy por $487 MXN.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                Da el siguiente paso y solicita tu acceso al curso de papas primerizos de DocLevel.
              </p>
            </div>
            <PaymentButton href={paymentHref} label="Inscribirme ya" />
          </div>
        </section>
      </main>

      <SiteFooter />
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#4ee7ef]/30 bg-[#020711]/95 p-3 shadow-[0_-12px_28px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Curso completo</p>
            <p className="text-lg font-black leading-none text-[#4ee7ef]">$487 MXN</p>
          </div>
          <Link
            href={paymentHref}
            className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-md bg-[#4ee7ef] px-4 py-3 text-center text-base font-black uppercase text-[#00111f] shadow-[0_0_24px_rgba(78,231,239,0.35)]"
          >
            Pagar
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaymentButton({ href, label, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-md bg-[#4ee7ef] px-7 py-4 text-center text-base font-black uppercase tracking-wide text-[#00111f] shadow-[0_0_34px_rgba(78,231,239,0.35)] transition hover:bg-[#7af7ff] sm:w-auto ${className}`}
    >
      <CreditCard className="h-5 w-5" />
      {label}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}

function PaymentStrip() {
  return (
    <div className="grid gap-4 border border-[#4ee7ef]/35 bg-[#061b34] p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4ee7ef]">Inscripcion rapida</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
          Accede al curso por $487 MXN.
        </h2>
        <p className="mt-2 text-base leading-7 text-zinc-300">
          Boton grande y visible para facilitar el pago desde telefono.
        </p>
      </div>
      <PaymentButton href={paymentHref} label="Inscribirme ya!" />
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="border border-[#119ff3]/18 bg-[#06111d] p-5">
      <div className="mb-4 text-[#4ee7ef]">{icon}</div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-2 text-base font-bold text-white">{value}</p>
    </div>
  );
}