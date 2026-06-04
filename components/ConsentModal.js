'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const storageKey = 'doclevel_legal_consent_v1';

export default function ConsentModal() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem(storageKey) !== 'accepted');
  }, []);

  const accept = () => {
    localStorage.setItem(storageKey, 'accepted');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <img src="/favicon.png" alt="DocLevel" className="h-10 w-10 rounded bg-black object-contain" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#4dbdff]">DocLevel</p>
            <h2 className="text-xl font-bold">Aviso de privacidad y términos</h2>
          </div>
        </div>
        <p className="text-sm leading-6 text-zinc-300">
          Para continuar navegando en DocLevel, confirma que has leído y aceptas nuestro aviso de privacidad,
          términos y condiciones, y uso de cookies. Esta plataforma ofrece información educativa y no sustituye
          la valoración médica personalizada.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#4dbdff]">
          <Link href="/aviso-legal" className="hover:text-white">Aviso legal</Link>
          <Link href="/privacidad" className="hover:text-white">Política de privacidad</Link>
          <Link href="/cookies" className="hover:text-white">Política de cookies</Link>
          <Link href="/terminos" className="hover:text-white">Términos y condiciones</Link>
        </div>
        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-[#119ff3]"
          />
          <span>Acepto los términos y condiciones, aviso de privacidad y políticas del sitio.</span>
        </label>
        <div className="mt-6 flex justify-end">
          <Button disabled={!accepted} onClick={accept} className="bg-[#119ff3] text-white hover:bg-[#38b6ff] disabled:opacity-50">
            Aceptar y continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

