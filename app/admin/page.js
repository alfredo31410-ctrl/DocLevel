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

const empty = { title: '', description: '', category: '', video_url: '', banner_url: '', content: '', featured: false };

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'admin@doclevel.com', password: 'admin123' });
  const [courses, setCourses] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' && localStorage.getItem('doclevel_token');
    if (t) setToken(t);
  }, []);

  useEffect(() => { if (token) loadCourses(); }, [token]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } finally { setLoading(false); }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      localStorage.setItem('doclevel_token', data.token);
      setToken(data.token);
      toast.success('Bienvenido, ' + data.user.email);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('doclevel_token');
    setToken(null); setCourses([]);
  };

  const openCreate = () => { setCurrent({ ...empty }); setEditOpen(true); };
  const openEdit = (c) => { setCurrent({ ...empty, ...c }); setEditOpen(true); };

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
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
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
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-28 pb-20 px-4 flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-600/20 border border-teal-500/40 mb-4">
                <Lock className="w-6 h-6 text-teal-500" />
              </div>
              <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
              <p className="text-zinc-500 mt-2">Inicia sesión para gestionar cursos</p>
            </div>
            <form onSubmit={login} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-5">
              <div>
                <Label className="text-zinc-300 mb-2 block">Email</Label>
                <Input required type="email" value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white h-11" />
              </div>
              <div>
                <Label className="text-zinc-300 mb-2 block">Contraseña</Label>
                <Input required type="password" value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white h-11" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar sesión'}
              </Button>
              <p className="text-xs text-zinc-500 text-center pt-2">Demo: admin@doclevel.com / admin123</p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Panel de cursos</h1>
            <p className="text-zinc-500 mt-1">{courses.length} curso{courses.length !== 1 && 's'} en total</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuevo curso
            </Button>
            <Button variant="outline" onClick={logout} className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-900">
              <LogOut className="w-4 h-4 mr-2" /> Salir
            </Button>
          </div>
        </div>

        {loading && !courses.length ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <Film className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-400">No hay cursos aún. Crea el primero.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 font-semibold">
              <div className="col-span-6 md:col-span-5">Curso</div>
              <div className="col-span-3 md:col-span-3">Categoría</div>
              <div className="hidden md:block md:col-span-2">Destacado</div>
              <div className="col-span-3 md:col-span-2 text-right">Acciones</div>
            </div>
            {courses.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/50 items-center hover:bg-zinc-800/30 transition">
                <div className="col-span-6 md:col-span-5 flex gap-3 items-center min-w-0">
                  <img src={c.banner_url} alt="" className="w-16 h-10 object-cover rounded flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium line-clamp-1">{c.title}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1">{c.description}</div>
                  </div>
                </div>
                <div className="col-span-3 md:col-span-3 text-sm text-zinc-300">{c.category}</div>
                <div className="hidden md:block md:col-span-2">
                  {c.featured ? <span className="text-xs bg-teal-600/20 text-teal-400 border border-teal-500/30 px-2 py-1 rounded">Destacado</span> : <span className="text-xs text-zinc-600">—</span>}
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="text-zinc-400 hover:text-white"><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(c)} className="text-zinc-400 hover:text-teal-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{current.id ? 'Editar curso' : 'Nuevo curso'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4 mt-2">
            <div>
              <Label className="text-zinc-300 mb-1.5 block">Título *</Label>
              <Input required value={current.title} onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                className="bg-zinc-900 border-zinc-800" />
            </div>
            <div>
              <Label className="text-zinc-300 mb-1.5 block">Descripción *</Label>
              <Textarea required rows={3} value={current.description}
                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300 mb-1.5 block">Categoría *</Label>
                <Input required value={current.category}
                  placeholder="Fiscal, Contabilidad, ..."
                  onChange={(e) => setCurrent({ ...current, category: e.target.value })}
                  className="bg-zinc-900 border-zinc-800" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
                  <Checkbox checked={!!current.featured}
                    onCheckedChange={(v) => setCurrent({ ...current, featured: !!v })} />
                  Marcar como destacado (hero principal)
                </label>
              </div>
            </div>
            <div>
              <Label className="text-zinc-300 mb-1.5 block">URL del video (YouTube o Vimeo) *</Label>
              <Input required value={current.video_url}
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => setCurrent({ ...current, video_url: e.target.value })}
                className="bg-zinc-900 border-zinc-800" />
            </div>
            <div>
              <Label className="text-zinc-300 mb-1.5 block">URL de banner (imagen) *</Label>
              <Input required value={current.banner_url}
                placeholder="https://..."
                onChange={(e) => setCurrent({ ...current, banner_url: e.target.value })}
                className="bg-zinc-900 border-zinc-800" />
              {current.banner_url && (
                <img src={current.banner_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded border border-zinc-800" onError={(e) => (e.currentTarget.style.display='none')} />
              )}
            </div>
            <div>
              <Label className="text-zinc-300 mb-1.5 block">Contenido adicional (opcional)</Label>
              <Textarea rows={3} value={current.content || ''}
                onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                placeholder="Notas, recursos, enlaces..."
                className="bg-zinc-900 border-zinc-800" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}
                className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-900">Cancelar</Button>
              <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : current.id ? 'Guardar cambios' : 'Crear curso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar curso?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta acción no se puede deshacer. El curso "{deleteTarget?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-teal-600 hover:bg-teal-700 text-white">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
