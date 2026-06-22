'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Check, MessageCircle, Mic, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

const ACTIVE_CAMPAIGN_FORM_ID = '255';

export default function VoxingFreeClassLanding() {
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!formOpen) return;

    const container = document.querySelector('._form_255');
    if (container) container.innerHTML = '';

    document
      .querySelectorAll(`script[data-activecampaign-form="${ACTIVE_CAMPAIGN_FORM_ID}"]`)
      .forEach((script) => script.remove());

    const script = document.createElement('script');
    script.src = `https://cefincapacitacion.activehosted.com/f/embed.php?id=${ACTIVE_CAMPAIGN_FORM_ID}`;
    script.charset = 'utf-8';
    script.async = true;
    script.dataset.activecampaignForm = ACTIVE_CAMPAIGN_FORM_ID;
    document.body.appendChild(script);
  }, [formOpen]);

  return (
    <main className="voxing-landing-shell">
      <header className="voxing-landing-topbar">
        <img src="/voxing/voxing-logo-white.png" alt="Voxing Academy" />
        <a className="voxing-text-button" href="/">Volver a DocLevel</a>
      </header>

      <section className="voxing-landing-hero">
        <div className="voxing-landing-copy">
          <p className="voxing-landing-kicker">Clase gratis de ingles</p>
          <h1>Descubre tu nivel y la ruta ideal para empezar a hablar ingles con mas seguridad.</h1>
          <p>
            Una sesion inicial para entender tu objetivo, detectar desde donde partir y recomendarte el programa Voxing
            que mejor se adapta a tu vida, trabajo, estudios o viajes.
          </p>

          <div className="voxing-landing-actions">
            <button className="voxing-primary-button voxing-large voxing-landing-primary" onClick={() => setFormOpen(true)}>
              Registrarme gratis
              <UserPlus size={20} />
            </button>
            <span>Formulario seguro conectado a ActiveCampaign.</span>
          </div>

          <div className="voxing-landing-points" aria-label="Beneficios de la clase gratis">
            <span><Mic size={18} /> Diagnostico practico</span>
            <span><CalendarDays size={18} /> Siguiente paso claro</span>
            <span><ShieldCheck size={18} /> Sin compromiso</span>
          </div>
        </div>

        <aside className="voxing-landing-card" aria-label="Que incluye la clase gratis">
          <div className="voxing-landing-card-icon">
            <MessageCircle size={28} />
          </div>
          <h2>Tu primer mapa para aprender ingles</h2>
          <ul>
            <li><Check size={17} /> Revision rapida de tu nivel actual.</li>
            <li><Check size={17} /> Objetivo principal: trabajo, estudio, viaje o crecimiento profesional.</li>
            <li><Check size={17} /> Recomendacion de curso, ruta o membresia dentro del ecosistema Voxing.</li>
          </ul>
        </aside>
      </section>

      <section className="voxing-landing-form-area" id="registro-gratis">
        <div className="voxing-landing-form-copy">
          <p className="voxing-landing-kicker">Registro</p>
          <h2>Reserva tu acceso gratuito</h2>
          <p>Deja tus datos y te contactaremos para coordinar tu clase inicial.</p>
        </div>

        {!formOpen ? (
          <button className="voxing-secondary-button voxing-large voxing-landing-form-trigger" onClick={() => setFormOpen(true)}>
            Abrir formulario
            <Sparkles size={18} />
          </button>
        ) : (
          <div className="voxing-activecampaign-panel">
            <div className="_form_255"></div>
          </div>
        )}
      </section>
    </main>
  );
}
