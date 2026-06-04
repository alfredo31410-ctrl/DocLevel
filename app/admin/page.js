'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, LogOut, Plus, Pencil, Trash2, Film, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { allowedCourseCategories } from '@/lib/courseCategories';

const categories = allowedCourseCategories;
const empty = {
  title: '',
  description: '',
  category: 'Pediatría',
  video_url: '',
  banner_url: '',
  content: '',
  status: 'available',
  featured: false,
};

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [courses, setCourses] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' && localStorage.getItem('doclevel_token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) loadCourses();
  }, [token]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      localStorage.setItem('doclevel_token', data.token);
      setToken(data.token);
      toast.success('Bienvenido, ' + data.user.email);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('doclevel_token');
    setToken(null);
    setCourses([]);
  };

  const openCreate = () => {
    setCurrent({ ...empty });
    setEditOpen(true);
  };

  const openEdit = (c) => {
    setCurrent({ ...empty, ...c, status: c.status || 'available' });
    setEditOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const isEdit = !!current.id;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses${isEdit ? '/' + current.id : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(current),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      toast.success(isEdit ? 'Curso actualizado' : 'Curso creado');
      setEditOpen(false);
      loadCourses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Error');
      toast.success('Curso eliminado');
      setDeleteTarget(null);
      loadCourses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center px-4 pb-20 pt-28">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-teal-500/40 bg-teal-600/20">
                <Lock className="h-6 w-6 text-teal-500" />
              </div>
              <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
              <p className="mt-2 text-zinc-500">Inicia sesión para gestionar cursos</p>
            </div>
            <form onSubmit={login} className="space-y-5 rounded-lg border border-zinc-800 bg-zinc-900 p-8">
              <div>
                <Label className="mb-2 block text-zinc-300">Email</Label>
                <Input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="h-11 border-zinc-800 bg-zinc-950 text-white"
                />
              </div>
              <div>
                <Label className="mb-2 block text-zinc-300">Contraseña</Label>
                <Input
                  required
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="h-11 border-zinc-800 bg-zinc-950 text-white"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-11 w-full bg-teal-600 text-white hover:bg-teal-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Iniciar sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-28 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white md:text-4xl">Panel de cursos</h1>
            <p className="mt-1 text-zinc-500">{courses.length} curso{courses.length !== 1 && 's'} en total</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openCreate} className="bg-teal-600 text-white hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" /> Nuevo curso
            </Button>
            <Button variant="outline" onClick={logout} className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900">
              <LogOut className="mr-2 h-4 w-4" /> Salir
            </Button>
          </div>
        </div>

        {loading && !courses.length ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-20 text-center">
            <Film className="mx-auto mb-3 h-12 w-12 text-zinc-700" />
            <p className="text-zinc-400">No hay cursos aún. Crea el primero.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="grid grid-cols-12 gap-4 border-b border-zinc-800 p-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <div className="col-span-6 md:col-span-5">Curso</div>
              <div className="col-span-3 md:col-span-2">Categoría</div>
              <div className="hidden md:block md:col-span-2">Estado</div>
              <div className="hidden md:block md:col-span-1">Hero</div>
              <div className="col-span-3 md:col-span-2 text-right">Acciones</div>
            </div>
            {courses.map((c) => (
              <div key={c.id} className="grid grid-cols-12 items-center gap-4 border-b border-zinc-800/50 p-4 transition hover:bg-zinc-800/30">
                <div className="col-span-6 flex min-w-0 items-center gap-3 md:col-span-5">
                  <img src={c.banner_url} alt="" className="h-10 w-16 flex-shrink-0 rounded object-cover" />
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-medium text-white">{c.title}</div>
                    <div className="line-clamp-1 text-xs text-zinc-500">{c.description}</div>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-zinc-300 md:col-span-2">{c.category}</div>
                <div className="hidden md:block md:col-span-2">
                  {c.status === 'coming_soon' ? (
                    <span className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">Próximamente</span>
                  ) : (
                    <span className="rounded border border-teal-500/30 bg-teal-600/20 px-2 py-1 text-xs text-teal-400">Disponible</span>
                  )}
                </div>
                <div className="hidden md:block md:col-span-1">
                  {c.featured ? <span className="text-xs text-teal-400">Sí</span> : <span className="text-xs text-zinc-600">-</span>}
                </div>
                <div className="col-span-3 flex justify-end gap-1 md:col-span-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="text-zinc-400 hover:text-white"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(c)} className="text-zinc-400 hover:text-teal-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>{current.id ? 'Editar curso' : 'Nuevo curso'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="mt-2 space-y-4">
            <div>
              <Label className="mb-1.5 block text-zinc-300">Título *</Label>
              <Input
                required
                value={current.title}
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                className="border-zinc-800 bg-zinc-900"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-zinc-300">Descripción *</Label>
              <Textarea
                required
                rows={3}
                value={current.description}
                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                className="border-zinc-800 bg-zinc-900"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-zinc-300">Especialidad *</Label>
                <select
                  required
                  value={current.category}
                  onChange={(e) => setCurrent({ ...current, category: e.target.value })}
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block text-zinc-300">Estado *</Label>
                <select
                  required
                  value={current.status}
                  onChange={(e) => setCurrent({ ...current, status: e.target.value })}
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-white"
                >
                  <option value="available">Disponible</option>
                  <option value="coming_soon">Próximamente</option>
                </select>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <Checkbox
                checked={!!current.featured}
                onCheckedChange={(v) => setCurrent({ ...current, featured: !!v })}
              />
              Marcar como destacado en el hero principal
            </label>
            <div>
              <Label className="mb-1.5 block text-zinc-300">URL del video {current.status === 'available' ? '*' : '(opcional)'}</Label>
              <Input
                required={current.status === 'available'}
                value={current.video_url}
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => setCurrent({ ...current, video_url: e.target.value })}
                className="border-zinc-800 bg-zinc-900"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-zinc-300">URL de banner (imagen) *</Label>
              <Input
                required
                value={current.banner_url}
                placeholder="https://..."
                onChange={(e) => setCurrent({ ...current, banner_url: e.target.value })}
                className="border-zinc-800 bg-zinc-900"
              />
              {current.banner_url && (
                <img src={current.banner_url} alt="preview" className="mt-2 h-32 w-full rounded border border-zinc-800 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-zinc-300">Contenido adicional (opcional)</Label>
              <Textarea
                rows={3}
                value={current.content || ''}
                onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                placeholder="Notas, recursos, enlaces..."
                className="border-zinc-800 bg-zinc-900"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-teal-600 text-white hover:bg-teal-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : current.id ? 'Guardar cambios' : 'Crear curso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar curso?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta acción no se puede deshacer. El curso "{deleteTarget?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-teal-600 text-white hover:bg-teal-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
