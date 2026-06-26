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
  title: 'Primer Mes de tu Bebé Paso a Paso | DocLevel',
  description:
    'Curso de pago para papás primerizos sobre cuidados esenciales del bebé desde el nacimiento. Inversión: $487 MXN.',
};

const paymentHref = 'https://pay.hotmart.com/P106439324N?off=5q438z0i&checkoutMode=10&bid=1782322313291';

const included = [
  'Qué es normal en las primeras horas de vida.',
  'Señales de alarma que sí requieren atención médica.',
  'Cuidados prácticos desde el nacimiento.',
  'Alimentación, sueño, llanto y cambios esperados.',
  'Guía clara para vivir el primer mes con más seguridad.',
  'Criterio pediátrico explicado en lenguaje sencillo.',
];

const skills = [
  'Identificar señales normales durante la adaptación al nacimiento.',
  'Reconocer cuándo observar, llamar o acudir a urgencias.',
  'Cuidar la respiración, coloración y temperatura del bebé.',
  'Manejar lactancia, sueño, evacuaciones y cuidados en casa.',
];

export default function PapaPrimerizoPagoLanding() {
  return (
    <div className="min-h-screen bg-[#020711] pb-24 text-white md:pb-0">
      <main>
        <div className="sticky top-0 z-[70] border-b border-[#4ee7ef]/35 bg-[#061b34]/95 px-4 py-3 text-center shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur md:py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4ee7ef] md:text-sm">Entrenamiento en vivo DocLevel</p>
          <p className="mt-1 text-lg font-black leading-tight text-white md:text-2xl">3 días en vivo: 1, 2 y 3 de julio del 2026 · 2 horas diarias · 12 pm hora CDMX</p>
          <p className="mx-auto mt-2 inline-flex max-w-3xl items-center justify-center rounded-md border border-[#4ee7ef]/45 bg-[#4ee7ef]/12 px-3 py-2 text-xs font-black uppercase leading-snug text-[#dffcff] md:mt-3 md:px-4 md:text-base">
            Incluye acceso a las grabaciones durante 1 año
          </p>
        </div>
        <section className="relative overflow-hidden px-4 pb-16 pt-8 md:px-8 md:pb-20 lg:pt-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,159,243,0.22),transparent_34%),linear-gradient(180deg,#03142a_0%,#020711_58%,#000_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.58),rgba(0,0,0,0.2),rgba(0,0,0,0.72))]" />

          <div className="relative z-10 mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
            <div className="pt-3 text-center lg:text-left">
              <div className="mb-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <span className="inline-flex items-center rounded-full border border-[#4ee7ef]/55 bg-[#4ee7ef]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#4ee7ef]">
                  Pediatría / Papás primerizos
                </span>
              </div>

              <h1 className="mx-auto max-w-4xl text-[2.75rem] font-black uppercase leading-[0.95] tracking-normal text-white sm:text-6xl md:text-7xl lg:mx-0">
                Primer mes de tu bebé paso a paso
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-black uppercase leading-snug text-white md:text-2xl lg:mx-0">
              Aprende a cuidar a tu bebé con seguridad desde sus primeros días.
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg lg:mx-0">
             Descubre qué cambios son normales durante el primer mes de vida, identifica las señales de alerta y aprende los cuidados esenciales para acompañar a tu bebé con confianza y tranquilidad, guiado por un especialista en pediatría.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <PaymentButton href={paymentHref} label="¡Inscribirme ya!" />
                <Link
                  href="#contenido"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md border border-white/18 bg-white/5 px-7 py-4 text-base font-black uppercase tracking-wide text-white transition hover:border-[#4ee7ef]/70 hover:bg-[#4ee7ef]/10 sm:w-auto"
                >
                  Ver contenido
                </Link>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-[#00ddff] lg:text-left">
                Acceso sencillo: toca el botón, realiza tu pago y completa tu inscripción.
              </p>
            </div>

            <aside
              id="inscripcion"
              className="rounded-sm border border-[#4ee7ef]/35 bg-[#061b34]/86 p-5 shadow-2xl shadow-[#119ff3]/20 backdrop-blur md:p-6"
            >
              <div className="overflow-hidden rounded-sm border border-[#119ff3]/25 bg-black/35">
                <img
                  src="/brand/Copia de BANNER - CAMPAÑA.png"
                  alt="Curso Primer Mes de tu Bebé Paso a Paso"
                  className="aspect-[16/10] w-full bg-[#06111d] object-contain object-center"
                />
              </div>

              <div className="mt-6 border border-[#4ee7ef]/35 bg-[#041324] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">Inversión</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-black leading-none text-[#4ee7ef]">$487</span>
                  <span className="pb-1 text-lg font-black text-white">MXN</span>
                </div>
                <p className="mt-5 text-sm leading-6 text-zinc-300">
                  Impartido por el <strong className="text-white">Dr. Raúl G. de Lira López</strong>,
                  especialista en pediatría.
                </p>
                <PaymentButton href={paymentHref} label="¡Inscribirme ya!" className="mt-6" />
              </div>
            </aside>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-4 md:grid-cols-4">
            <InfoCard icon={<Stethoscope className="h-6 w-6" />} label="Experto" value="Dr. Raúl G. de Lira López" />
            <InfoCard icon={<CalendarCheck className="h-6 w-6" />} label="Fechas" value="1, 2 y 3 de julio del 2026" />
            <InfoCard icon={<PlayCircle className="h-6 w-6" />} label="En vivo" value="2 horas diarias" />
            <InfoCard icon={<ShieldCheck className="h-6 w-6" />} label="Precio" value="$487 MXN" />
          </div>
          <div className="mx-auto mt-6 max-w-[1120px]">
            <PaymentStrip />
          </div>
        </section>

        <section id="contenido" className="px-4 py-10 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#4ee7ef]">Contenido del entrenamiento</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">
                Un entrenamiento para cuidar a tu bebé con confianza.
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-300">
                Aprende a comprender las necesidades de tu bebé durante su primer mes de vida, identificar los cambios normales, reconocer las señales de alerta y brindarle los cuidados que necesita para favorecer su bienestar desde el nacimiento.
              </p>
              <PaymentButton href={paymentHref} label="¡Inscribirme ya!" className="mt-7" />
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
              <h2 className="text-2xl font-black text-white md:text-3xl">Habilidades que vas a desarrollar</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {skills.map((skill, index) => (
                <div key={skill} className="border border-white/10 bg-black/24 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4ee7ef]">
                    Habilidad {index + 1}
                  </p>
                  <p className="mt-3 text-base font-semibold leading-6 text-white">{skill}</p>
                </div>
              ))}
            </div>
            <div className="mt-7">
              <PaymentButton href={paymentHref} label="¡Inscribirme ya!" />
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-6 border border-[#4ee7ef]/35 bg-[linear-gradient(135deg,#08223d,#03101e)] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-[#4ee7ef]">
                <Baby className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.22em]">Inscripción abierta</span>
              </div>
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                Empieza hoy por $487 MXN.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                Da el siguiente paso y solicita tu acceso al entrenamiento de papás primerizos de DocLevel.
              </p>
            </div>
            <PaymentButton href={paymentHref} label="¡Inscribirme ya!" />
          </div>
        </section>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#4ee7ef]/30 bg-[#020711]/95 p-3 shadow-[0_-12px_28px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Entrenamiento completo</p>
            <p className="text-lg font-black leading-none text-[#4ee7ef]">$487 MXN</p>
          </div>
          <Link
            href={paymentHref}
            className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-md bg-[#4ee7ef] px-4 py-3 text-center text-base font-black uppercase text-[#00111f] shadow-[0_0_24px_rgba(78,231,239,0.35)]"
          >
            ¡Inscribirme ya!
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
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4ee7ef]">Inscripción rápida</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
          Accede al entrenamiento por $487 MXN.
        </h2>
      </div>
      <PaymentButton href={paymentHref} label="¡Inscribirme ya!" />
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