'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 md:px-8">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 text-teal-500">
            <Mail className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Contacto</span>
          </div>
          <h1 className="mb-3 text-3xl font-black text-white md:text-5xl">Hablemos</h1>
          <p className="text-zinc-400">¿Tienes preguntas sobre un curso o quieres colaborar como doctor instructor? Envíanos un mensaje.</p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <div>
            <Label className="mb-2 block text-zinc-300">Nombre</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
              className="h-11 border-zinc-800 bg-zinc-950 text-white"
            />
          </div>
          <div>
            <Label className="mb-2 block text-zinc-300">Email</Label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              className="h-11 border-zinc-800 bg-zinc-950 text-white"
            />
          </div>
          <div>
            <Label className="mb-2 block text-zinc-300">Mensaje</Label>
            <Textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="¿En qué podemos ayudarte?"
              className="border-zinc-800 bg-zinc-950 text-white"
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-teal-600 text-white hover:bg-teal-700 md:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}
