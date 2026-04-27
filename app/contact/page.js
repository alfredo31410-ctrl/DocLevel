'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

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
      <div className="pt-28 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-red-500 mb-3">
            <Mail className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-bold">Contacto</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Hablemos</h1>
          <p className="text-zinc-400">¿Tienes preguntas, sugerencias o quieres colaborar? Envíanos un mensaje.</p>
        </div>

        <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-5">
          <div>
            <Label className="text-zinc-300 mb-2 block">Nombre</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
              className="bg-zinc-950 border-zinc-800 text-white h-11"
            />
          </div>
          <div>
            <Label className="text-zinc-300 mb-2 block">Email</Label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              className="bg-zinc-950 border-zinc-800 text-white h-11"
            />
          </div>
          <div>
            <Label className="text-zinc-300 mb-2 block">Mensaje</Label>
            <Textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="¿En qué podemos ayudarte?"
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
          <Button type="submit" disabled={sending} className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto">
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </form>
      </div>
    </div>
  );
}
