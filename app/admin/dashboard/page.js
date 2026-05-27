'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Users, FolderPlus, PackagePlus, MessageSquare,
  LogOut, Menu, X, Search, AlertCircle, Edit3, Trash2,
  Plus, Upload, Image as ImageIcon, Loader2, Star, RefreshCw,
} from 'lucide-react';


// Replace these two helpers at the top of your file:
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

const bearer = () => {
  const t = getToken();
  if (!t) return {};
  return { Authorization: `Bearer ${t}` };
};

// ─── API config ────────────────────────────────────────────────────────
// If your server mounts routes under `/api/admin/...` instead of `/api/...`,
// just change API_BASE below.
const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE = `${API_ROOT}/api`;
const USERS_URL = `${API_ROOT}/api/admin/users`; // adjust if your users endpoint differs

// ─── Auth helpers ──────────────────────────────────────────────────────
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);
// const bearer = () => ({ Authorization: `Bearer ${token()}` });

// async function apiForm(url, method, formData) {
//   // IMPORTANT: do NOT set Content-Type for FormData — the browser sets the boundary
//   const res = await fetch(url, { method, headers: { ...bearer() }, body: formData });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
//   return data;
// }

async function apiForm(url, method, formData) {
  const t = getToken();
   console.log('[apiForm] token present:', !!t, '| first 20 chars:', t?.slice(0, 20));
  const headers = {};
  if (t) headers['Authorization'] = `Bearer ${t}`;
  // Do NOT set Content-Type for FormData — browser sets the boundary
  const res = await fetch(url, { method, headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return data;
}

// ─── Shared styles ─────────────────────────────────────────────────────
const inputCls = [
  'w-full py-3 px-4 text-sm font-medium text-gray-900 bg-white',
  'border-2 border-gray-200 rounded-xl outline-none transition-all',
  'placeholder:text-gray-400',
  'focus:border-[#c23d6a] focus:ring-4 focus:ring-[#c23d6a]/10',
  'hover:border-gray-300',
].join(' ');

const btnPrimary =
  'inline-flex items-center justify-center gap-2 bg-[#c23d6a] hover:bg-[#a8305a] active:scale-[0.98] text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-[#c23d6a]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed';
const btnGhost =
  'inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2.5 rounded-2xl transition-all';
const btnDanger =
  'inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all disabled:opacity-60';

// ─── Shared atoms ──────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
      {children} {required && <span className="text-[#c23d6a]">*</span>}
    </label>
  );
}

function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs text-red-700 font-semibold leading-snug">{error}</p>
    </div>
  );
}

function Skeleton({ rows = 5 }) {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function Empty({ icon: Icon = AlertCircle, message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#fff0f5] flex items-center justify-center mb-3">
        <Icon size={24} className="text-[#c23d6a]" />
      </div>
      <p className="text-sm font-bold text-gray-400">{message}</p>
    </div>
  );
}

function TableCard({ children }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border-2 border-gray-100 overflow-hidden">
      {children}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, size = 'lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} my-8 flex flex-col max-h-[calc(100vh-4rem)]`}>
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-gray-100 shrink-0">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm dialog ────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, title, message, loading, confirmText = 'Delete' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-black text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        <div className="flex gap-2">
          <button onClick={onClose} disabled={loading} className={`${btnGhost} flex-1`}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`${btnDanger} flex-1`}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single image upload ──────────────────────────────────────────────
function ImageUpload({ value, onChange, existingUrl, label = 'Upload image' }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!value) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const preview = previewUrl || existingUrl;
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={28} className="text-gray-300" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={inputRef} type="file" accept="image/*" hidden
          onChange={(e) => onChange(e.target.files[0] || null)} />
        <button type="button" onClick={() => inputRef.current?.click()}
          className="text-sm font-bold text-[#c23d6a] hover:text-[#a8305a] flex items-center gap-1.5">
          <Upload size={14} /> {preview ? 'Change image' : label}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)}
            className="text-xs text-red-500 hover:underline self-start">Remove</button>
        )}
        <p className="text-[10px] text-gray-400">PNG, JPG up to ~5MB</p>
      </div>
    </div>
  );
}

// ─── Multi-image upload ────────────────────────────────────────────────
function MultiImageUpload({ files, onChange, existingUrls = [], max = 5 }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleAdd = (e) => {
    const newFiles = Array.from(e.target.files || []);
    onChange([...files, ...newFiles].slice(0, max));
    e.target.value = '';
  };

  const removeAt = (i) => onChange(files.filter((_, idx) => idx !== i));
  const showExisting = files.length === 0 && existingUrls.length > 0;

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleAdd} />

      {showExisting && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Current images — uploading new ones will replace all
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {existingUrls.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeAt(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => inputRef.current?.click()} disabled={files.length >= max}
        className="w-full border-2 border-dashed border-gray-200 hover:border-[#c23d6a] hover:bg-[#fff8fb] rounded-2xl py-6 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        <Upload size={18} className="text-gray-400" />
        <span className="text-xs font-bold text-gray-500">
          {files.length >= max ? `Max ${max} images` : `Click to upload (${files.length}/${max})`}
        </span>
      </button>
    </div>
  );
}

// ─── Dashboard View ────────────────────────────────────────────────────
function DashboardView({ onNavigate, refreshKey }) {
  const [counts, setCounts] = useState({ categories: null, products: null, reviews: null, users: null });

  useEffect(() => {
    (async () => {
      try {
        const [cats, prods, revs, usrRes] = await Promise.all([
          fetch(`${API_BASE}/categories`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/products`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/reviews`).then((r) => r.json()).catch(() => []),
          fetch(USERS_URL, { headers: bearer() }).then((r) => r.json()).catch(() => ({ users: [] })),
        ]);
        const usersArr = usrRes?.users || (Array.isArray(usrRes) ? usrRes : []);
        setCounts({
          categories: Array.isArray(cats) ? cats.length : 0,
          products:   Array.isArray(prods) ? prods.length : 0,
          reviews:    Array.isArray(revs) ? revs.length : 0,
          users:      Array.isArray(usersArr) ? usersArr.length : 0,
        });
      } catch {}
    })();
  }, [refreshKey]);

  const stats = [
    { label: 'Categories', value: counts.categories ?? '—', icon: '🗂️', color: 'bg-amber-50', goto: 'categories' },
    { label: 'Products',   value: counts.products ?? '—',   icon: '📦', color: 'bg-blue-50',  goto: 'products' },
    { label: 'Reviews',    value: counts.reviews ?? '—',    icon: '⭐', color: 'bg-[#fff0f5]', goto: 'reviews' },
    { label: 'Users',      value: counts.users ?? '—',      icon: '👥', color: 'bg-green-50', goto: 'users' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => onNavigate(s.goto)}
            className="text-left bg-white rounded-3xl p-5 shadow-sm border-2 border-gray-100 hover:border-[#c23d6a]/30 hover:shadow-md flex items-center gap-4 transition-all">
            <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#c23d6a] to-[#8b1a42] rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Welcome back</p>
          <h2 className="text-xl font-black mb-1">Admin Dashboard</h2>
          <p className="text-sm text-white/70 font-medium">Manage your GymHack store from here.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Category form ─────────────────────────────────────────────────────
function CategoryForm({ category, onSuccess, onCancel }) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('name', name);
      if (imageFile) fd.append('image', imageFile);
      const url = isEdit ? `${API_BASE}/categories/${category.id}` : `${API_BASE}/categories`;
      const saved = await apiForm(url, isEdit ? 'PUT' : 'POST', fd);
      onSuccess(saved);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <Label required>Category Name</Label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)}
          required placeholder="e.g. Oats, Muesli" />
      </div>
      <div>
        <Label>Category Image</Label>
        <ImageUpload value={imageFile} onChange={setImageFile} existingUrl={category?.image_url} />
      </div>
      <ErrorBox error={error} />
      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? <><Loader2 size={14} className="animate-spin" />Saving...</> : isEdit ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}

// ─── Categories View ───────────────────────────────────────────────────
function CategoriesView({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleting) return;
    const targetId = String(deleting.id);
    setDelLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories/${targetId}`, { method: 'DELETE', headers: bearer() });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Delete failed'); }
      setItems((prev) => prev.filter((c) => String(c.id) !== targetId));
      setDeleting(null);
    } catch (e) { setError(e.message); }
    finally { setDelLoading(false); }
  };

  const q = search.trim().toLowerCase();
  const filtered = q ? items.filter((c) => (c.name || '').toLowerCase().includes(q)) : items;

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search categories..." value={search}
            onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className={btnPrimary}>
          <Plus size={15} /> New Category
        </button>
      </div>

      <TableCard>
        {loading ? <Skeleton /> : error ? <Empty message={error} /> : filtered.length === 0 ? (
          <Empty icon={FolderPlus} message={items.length === 0 ? 'No categories yet' : 'No categories match your search'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/60">
                  {['Image', 'Name', 'Slug', 'Created', ''].map((h) => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fff8fb] transition-colors">
                    <td className="px-5 py-3">
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">{c.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">{c.slug}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => { setEditing(c); setShowForm(true); }} title="Edit"
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => setDeleting(c)} title="Delete"
                          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>

      <Modal open={showForm} onClose={() => setShowForm(false)}
        title={editing ? 'Edit Category' : 'New Category'} size="md">
        <CategoryForm category={editing} onCancel={() => setShowForm(false)}
          onSuccess={(saved) => {
            if (editing) setItems((p) => p.map((c) => (c.id === saved.id ? saved : c)));
            else setItems((p) => [saved, ...p]);
            setShowForm(false);
          }}
        />
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        title="Delete Category?"
        message={`This will permanently delete "${deleting?.name}". This cannot be undone.`}
        onConfirm={handleDelete} loading={delLoading} />
    </div>
  );
}

// ─── Product form ──────────────────────────────────────────────────────
const normalizeVariants = (raw) => {
  if (!raw) return [];
  let arr = raw;
  if (typeof raw === 'string') {
    try { arr = JSON.parse(raw); } catch { return []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr.map((v) => ({
    label: String(v?.label ?? ''),
    price: v?.price ?? '',
  }));
};

function ProductForm({ product, categories, onSuccess, onCancel }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name:           product?.name           || '',
    subtitle:       product?.subtitle       || '',
    price:          product?.price          || '',
    description:    product?.description    || '',
    ingredients:    product?.ingredients    || '',
    how_to_use:     product?.how_to_use     || '',
    category_id:    product?.category_id    || '',
    stock_quantity: product?.stock_quantity || '',
  });
  const [variants, setVariants] = useState(() => {
    const v = normalizeVariants(product?.variants);
    return v.length > 0 ? v : [{ label: '', price: '' }];
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const updateVariant = (i, key, value) =>
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)));
  const addVariant = () => setVariants((prev) => [...prev, { label: '', price: '' }]);
  const removeVariant = (i) => setVariants((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const cleanVariants = variants
        .map((v) => ({ label: String(v.label || '').trim(), price: Number(v.price) }))
        .filter((v) => v.label && Number.isFinite(v.price) && v.price >= 0);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      fd.append('variants', JSON.stringify(cleanVariants));
      files.forEach((f) => fd.append('images', f));
      const url = isEdit ? `${API_BASE}/products/${product.id}` : `${API_BASE}/products`;
      const saved = await apiForm(url, isEdit ? 'PUT' : 'POST', fd);
      onSuccess(saved);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const hasVariants = variants.some((v) => v.label && v.price);

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Product Name</Label>
          <input className={inputCls} value={form.name} onChange={set('name')} required placeholder="Premium Rolled Oats" />
        </div>
        <div>
          <Label>Subtitle</Label>
          <input className={inputCls} value={form.subtitle} onChange={set('subtitle')} placeholder="100% natural" />
        </div>
        <div>
          <Label required={!hasVariants}>Base Price (₹)</Label>
          <input
            type="number" step="0.01" min="0" className={inputCls}
            value={form.price} onChange={set('price')}
            required={!hasVariants}
            placeholder={hasVariants ? 'Auto from first variant' : '180'}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {hasVariants ? 'Optional when variants are set — the first variant becomes the base.' : 'Required when no weight variants are defined.'}
          </p>
        </div>
        <div>
          <Label>Stock Quantity</Label>
          <input type="number" min="0" className={inputCls} value={form.stock_quantity} onChange={set('stock_quantity')} placeholder="50" />
        </div>
      </div>

      <div>
        <Label required>Category</Label>
        <select value={form.category_id} onChange={set('category_id')} required
          className={`${inputCls} cursor-pointer appearance-none`}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Description</Label>
        <textarea rows={3} className={`${inputCls} resize-none`} value={form.description}
          onChange={set('description')} placeholder="Short product description..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Ingredients</Label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={form.ingredients}
            onChange={set('ingredients')} placeholder="Oats, vitamins..." />
        </div>
        <div>
          <Label>How to Use</Label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={form.how_to_use}
            onChange={set('how_to_use')} placeholder="Mix with milk..." />
        </div>
      </div>

      <div>
        <Label>Weight Variants</Label>
        <p className="text-[11px] text-gray-400 mb-2">
          Add weight options (e.g. 500g, 1kg) with their own prices. Leave empty if the product has no weight options.
        </p>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                className={`${inputCls} flex-1`}
                value={v.label}
                onChange={(e) => updateVariant(i, 'label', e.target.value)}
                placeholder="e.g. 500g"
              />
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                <input
                  type="number" step="0.01" min="0"
                  className={`${inputCls} pl-7`}
                  value={v.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                  placeholder="180"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                disabled={variants.length === 1}
                title="Remove variant"
                className="p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#c23d6a] hover:text-[#a8305a]"
        >
          <Plus size={14} /> Add Variant
        </button>
      </div>

      <div>
        <Label>Product Images (up to 5)</Label>
        <MultiImageUpload files={files} onChange={setFiles}
          existingUrls={Array.isArray(product?.images) ? product.images : []} max={5} />
      </div>

      <ErrorBox error={error} />

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? <><Loader2 size={14} className="animate-spin" />Saving...</> : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

// ─── Products View ─────────────────────────────────────────────────────
function ProductsView({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
      ]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setItems(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleting) return;
    const targetId = String(deleting.id);
    setDelLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/${targetId}`, { method: 'DELETE', headers: bearer() });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Delete failed'); }
      setItems((prev) => prev.filter((x) => String(x.id) !== targetId));
      setDeleting(null);
    } catch (e) { setError(e.message); }
    finally { setDelLoading(false); }
  };

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const q = search.trim().toLowerCase();
  const filtered = items.filter((p) => {
    const matchSearch = !q || (p.name || '').toLowerCase().includes(q) || (p.subtitle || '').toLowerCase().includes(q);
    const matchCat = !categoryFilter || String(p.category_id) === String(categoryFilter);
    return matchSearch && matchCat;
  });
  const hasFilter = !!q || !!categoryFilter;

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputCls} max-w-[180px] cursor-pointer appearance-none`}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className={`${btnPrimary} ml-auto`}>
          <Plus size={15} /> New Product
        </button>
      </div>

      <TableCard>
        {loading ? <Skeleton /> : error ? <Empty message={error} /> : filtered.length === 0 ? (
          <Empty icon={PackagePlus} message={items.length === 0 ? 'No products yet' : hasFilter ? 'No products match your filter' : 'No products yet'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/60">
                  {['Image', 'Name', 'Category', 'Price', 'Stock', ''].map((h) => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                  return (
                    <tr key={p.id} className="hover:bg-[#fff8fb] transition-colors">
                      <td className="px-5 py-3">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <ImageIcon size={16} className="text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{p.name}</p>
                        {p.subtitle && <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-[#fff0f5] text-[#c23d6a] font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider whitespace-nowrap">
                          {categoryMap[p.category_id] || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-black text-gray-900 whitespace-nowrap">
                        ₹{p.price}
                        {Array.isArray(p.variants) && p.variants.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {p.variants.map((v, i) => (
                              <span key={i} className="text-[10px] font-bold bg-[#fff0f5] text-[#c23d6a] px-1.5 py-0.5 rounded-md">
                                {v.label} ₹{v.price}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold ${Number(p.stock_quantity) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {p.stock_quantity ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => { setEditing(p); setShowForm(true); }} title="Edit"
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => setDeleting(p)} title="Delete"
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>

      <Modal open={showForm} onClose={() => setShowForm(false)}
        title={editing ? 'Edit Product' : 'New Product'} size="xl">
        <ProductForm product={editing} categories={categories} onCancel={() => setShowForm(false)}
          onSuccess={(saved) => {
            if (editing) setItems((p) => p.map((x) => (x.id === saved.id ? saved : x)));
            else setItems((p) => [saved, ...p]);
            setShowForm(false);
          }}
        />
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        title="Delete Product?"
        message={`This will permanently delete "${deleting?.name}" and its images. This cannot be undone.`}
        onConfirm={handleDelete} loading={delLoading} />
    </div>
  );
}

// ─── Reviews View ──────────────────────────────────────────────────────
function ReviewsView({ refreshKey }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
        ]);
        const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
        const pList = Array.isArray(pData) ? pData : [];
        setProducts(pList);
        setCategories(Array.isArray(cData) ? cData : []);
      } catch {}
    })();
  }, [refreshKey]);

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const params = new URLSearchParams();
        if (productId) params.set('productId', productId);
        else if (categoryFilter) params.set('categoryId', categoryFilter);
        const qs = params.toString();
        const r = await fetch(`${API_BASE}/reviews${qs ? `?${qs}` : ''}`);
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Failed');
        setReviews(Array.isArray(d) ? d : []);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [productId, categoryFilter, refreshKey]);

  const handleDelete = async () => {
    if (!deleting) return;
    const targetId = String(deleting.id);
    setDelLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/${targetId}`, { method: 'DELETE', headers: bearer() });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Delete failed'); }
      setReviews((prev) => prev.filter((r) => String(r.id) !== targetId));
      setDeleting(null);
    } catch (e) { setError(e.message); }
    finally { setDelLoading(false); }
  };

  const q = search.trim().toLowerCase();
  const productMatchesFilters = (p, qStr, catId) => {
    const matchSearch = !qStr || (p.name || '').toLowerCase().includes(qStr) || (p.subtitle || '').toLowerCase().includes(qStr);
    const matchCat = !catId || String(p.category_id) === String(catId);
    return matchSearch && matchCat;
  };
  const filteredProducts = products.filter((p) => productMatchesFilters(p, q, categoryFilter));

  const handleSearchChange = (value) => {
    setSearch(value);
    if (!productId) return;
    const product = products.find((p) => String(p.id) === String(productId));
    if (product && !productMatchesFilters(product, value.trim().toLowerCase(), categoryFilter)) {
      setProductId('');
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    if (!productId) return;
    const product = products.find((p) => String(p.id) === String(productId));
    if (product && !productMatchesFilters(product, q, value)) {
      setProductId('');
    }
  };

  const selectedProduct = products.find((p) => String(p.id) === String(productId));

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => handleSearchChange(e.target.value)} className={`${inputCls} pl-10`} />
        </div>
        <select value={categoryFilter} onChange={(e) => handleCategoryChange(e.target.value)}
          className={`${inputCls} max-w-[180px] cursor-pointer appearance-none`}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={productId} onChange={(e) => setProductId(e.target.value)}
          className={`${inputCls} max-w-[260px] cursor-pointer appearance-none`}>
          {filteredProducts.length === 0 ? <option value="">No products match</option> : (
            <>
              <option value="">Select a product</option>
              {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </>
          )}
        </select>
        {reviews.length > 0 && (
          <div className="text-xs font-bold text-gray-400 ml-auto">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="bg-white rounded-2xl border-2 border-gray-100 px-4 py-3 flex items-center gap-3">
          {Array.isArray(selectedProduct.images) && selectedProduct.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <ImageIcon size={14} className="text-gray-300" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{selectedProduct.name}</p>
            {selectedProduct.subtitle && <p className="text-xs text-gray-400 truncate">{selectedProduct.subtitle}</p>}
          </div>
        </div>
      )}

      <TableCard>
        {loading ? <Skeleton />
          : error ? <Empty message={error} />
          : reviews.length === 0 ? (
            <Empty icon={MessageSquare} message={
              productId ? 'No reviews yet for this product'
              : categoryFilter ? 'No reviews yet for this category'
              : 'No reviews yet'
            } />
          )
          : (
            <ul className="divide-y divide-gray-100">
              {reviews.map((r) => {
                const productImg = Array.isArray(r.product_images) && r.product_images[0];
                return (
                <li key={r.id} className="p-5 hover:bg-[#fff8fb] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fff0f5] flex items-center justify-center text-sm font-black text-[#c23d6a] shrink-0">
                      {(r.user_name || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">{r.user_name || 'Anonymous'}</span>
                        {r.is_verified && (
                          <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wider">
                            Verified Buyer
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-gray-400">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      {r.product_name && !productId && (
                        <div className="flex items-center gap-2 mb-2 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 w-fit">
                          {productImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={productImg} alt={r.product_name} className="w-5 h-5 rounded object-cover" />
                          ) : (
                            <ImageIcon size={11} className="text-gray-300" />
                          )}
                          <span className="text-[11px] font-bold text-gray-600">{r.product_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} className={i < (r.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      {r.title && <p className="font-bold text-gray-900 text-sm mb-1">{r.title}</p>}
                      {r.body && <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>}
                    </div>
                    <button onClick={() => setDeleting(r)} title="Delete review"
                      className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );})}
            </ul>
          )}
      </TableCard>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        title="Delete Review?"
        message="This review will be permanently removed. This action cannot be undone."
        onConfirm={handleDelete} loading={delLoading} />
    </div>
  );
}

// ─── Users View (read-only) ────────────────────────────────────────────
function UsersView({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const res = await fetch(USERS_URL, { headers: bearer() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        setUsers(data.users || (Array.isArray(data) ? data : []));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [refreshKey]);

  const filtered = users.filter((u) => {
    const first = u.first_name || u.firstName || '';
    const last  = u.last_name  || u.lastName  || '';
    return `${first} ${last} ${u.email || ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input type="text" placeholder="Search users..." value={search}
          onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
      </div>

      <TableCard>
        {loading ? <Skeleton /> : error ? <Empty message={error} /> : filtered.length === 0 ? (
          <Empty icon={Users} message="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/60">
                  {['Name', 'Email', 'Phone', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u, i) => {
                  const first = u.first_name || u.firstName || '';
                  const last  = u.last_name  || u.lastName  || '';
                  const name  = `${first} ${last}`.trim() || u.name || '—';
                  const joined = u.created_at || u.createdAt;
                  return (
                    <tr key={u.id || i} className="hover:bg-[#fff8fb]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#fff0f5] flex items-center justify-center text-xs font-black text-[#c23d6a] shrink-0">
                            {(name[0] || 'U').toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 whitespace-nowrap">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{u.email || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{u.phone || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {joined ? new Date(joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}

// ─── Highlights View ──────────────────────────────────────────────────
// Backend requirements:
//   1. ALTER TABLE products ADD COLUMN is_highlighted BOOLEAN DEFAULT false;
//   2. PATCH /api/products/:id/highlight  →  { is_highlighted: bool }
//   3. GET  /api/products?is_highlighted=true  (used by homepage carousel)
function HighlightsView({ refreshKey }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
      ]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      if (!pRes.ok) throw new Error(pData.error || 'Failed');
      setProducts(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [refreshKey]);

  const toggle = async (product) => {
    const targetId = String(product.id);
    const nextValue = !product.is_highlighted;
    setToggling(product.id);
    try {
      const res = await fetch(`${API_BASE}/products/${targetId}/highlight`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...bearer() },
        body: JSON.stringify({ is_highlighted: nextValue }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Toggle failed'); }
      setProducts((prev) =>
        prev.map((x) => (String(x.id) === targetId ? { ...x, is_highlighted: nextValue } : x))
      );
    } catch (e) { setError(e.message); }
    finally { setToggling(null); }
  };

  const highlightedCount = products.filter((p) => p.is_highlighted).length;
  const q = search.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchSearch = !q || (p.name || '').toLowerCase().includes(q) || (p.subtitle || '').toLowerCase().includes(q);
    const matchCat = !categoryFilter || String(p.category_id) === String(categoryFilter);
    return matchSearch && matchCat;
  });
  const sorted = [...filtered].sort((a, b) => (b.is_highlighted ? 1 : 0) - (a.is_highlighted ? 1 : 0));
  const hasFilter = !!q || !!categoryFilter;

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="bg-[#fff0f5] border-2 border-[#f0c0d0] rounded-3xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#c23d6a]">
            {highlightedCount} product{highlightedCount !== 1 ? 's' : ''} highlighted
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Highlighted products appear in the &ldquo;Our Top Selling&rdquo; carousel on the homepage.
          </p>
        </div>
        <Star size={28} className="text-[#c23d6a] fill-[#c23d6a]/20 shrink-0" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputCls} max-w-[180px] cursor-pointer appearance-none`}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <ErrorBox error={error} />

      <TableCard>
        {loading ? <Skeleton /> : products.length === 0 ? (
          <Empty icon={Star} message="No products yet — add some in the Products tab" />
        ) : sorted.length === 0 ? (
          <Empty icon={Star} message={hasFilter ? 'No products match your filter' : 'No products yet'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/60">
                  {['Image', 'Product', 'Price', 'Stock', 'Show in Highlights'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((p) => {
                  const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                  const isOn = !!p.is_highlighted;
                  const busy = toggling === p.id;
                  return (
                    <tr key={p.id} className={`transition-colors ${isOn ? 'bg-[#fff8fb] hover:bg-[#fff4f8]' : 'hover:bg-gray-50/60'}`}>
                      <td className="px-5 py-3.5">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <ImageIcon size={16} className="text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {isOn && <Star size={12} className="text-[#c23d6a] fill-[#c23d6a] shrink-0" />}
                          <div>
                            <p className="font-semibold text-gray-900 whitespace-nowrap">{p.name}</p>
                            {p.subtitle && <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-black text-gray-900 whitespace-nowrap">₹{p.price}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold ${Number(p.stock_quantity) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {p.stock_quantity ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggle(p)}
                          disabled={busy}
                          title={isOn ? 'Remove from highlights' : 'Add to highlights'}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none
                            ${isOn ? 'bg-[#c23d6a]' : 'bg-gray-200'}
                            ${busy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {busy ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Loader2 size={12} className="animate-spin text-white" />
                            </span>
                          ) : (
                            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200
                              ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}

// ─── Nav config ────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'categories', label: 'Categories', icon: FolderPlus      },
  { id: 'products',   label: 'Products',   icon: PackagePlus     },
  { id: 'highlights', label: 'Highlights', icon: Star            },
  { id: 'reviews',    label: 'Reviews',    icon: MessageSquare   },
  { id: 'users',      label: 'Users',      icon: Users           },
];

// ─── Main Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) router.replace('/admin/gymhack-admin-2026');
    else setAuth(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/gymhack-admin-2026');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  const activeLabel = NAV.find((n) => n.id === activeView)?.label ?? 'Dashboard';

  if (!auth) return null;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':  return <DashboardView onNavigate={setActiveView} refreshKey={refreshKey} />;
      case 'categories': return <CategoriesView refreshKey={refreshKey} />;
      case 'products':   return <ProductsView refreshKey={refreshKey} />;
      case 'highlights': return <HighlightsView refreshKey={refreshKey} />;
      case 'reviews':    return <ReviewsView refreshKey={refreshKey} />;
      case 'users':      return <UsersView refreshKey={refreshKey} />;
      default:           return <DashboardView onNavigate={setActiveView} refreshKey={refreshKey} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fdf8f9' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-white border-r-2 border-gray-100 z-40
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="px-5 py-5 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c23d6a] relative overflow-hidden shrink-0 shadow-md shadow-[#c23d6a]/30">
              <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain p-1.5" />
            </div>
            <div>
              <p className="text-base font-black text-gray-900 tracking-tight leading-none">GYM HACK</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Admin</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={17} />
          </button>
        </div>

        <div className="px-4 pt-4 pb-3 border-b-2 border-gray-100">
          <div className="flex items-center gap-3 bg-[#fff0f5] border-2 border-[#f0c0d0] rounded-2xl px-3.5 py-3">
            <div className="w-9 h-9 rounded-full bg-[#c23d6a] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm shadow-[#c23d6a]/30">A</div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-none">Admin</p>
              <p className="text-[10px] text-[#c23d6a] font-bold mt-0.5 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;
            return (
              <button key={id} onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all text-left
                  ${active ? 'bg-[#c23d6a] text-white shadow-md shadow-[#c23d6a]/25'
                           : 'text-gray-600 hover:bg-[#fff0f5] hover:text-[#c23d6a]'}`}>
                <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t-2 border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} className="text-red-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b-2 border-gray-100 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-500">
              <Menu size={20} />
            </button>
            <h1 className="text-base font-black text-gray-900 tracking-tight">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} disabled={refreshing} title="Refresh data"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-[#c23d6a]/30 text-gray-700 hover:text-[#c23d6a] px-3.5 py-2 rounded-full text-xs font-black transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 bg-[#c23d6a] hover:bg-[#a8305a] text-white px-4 py-2 rounded-full text-xs font-black transition-colors shadow-md shadow-[#c23d6a]/25">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">A</div>
              Admin
              <LogOut size={11} className="opacity-70" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );

}

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto">
//           <ActiveView />
//         </main>
// //       </div>

//     </div>
//   );
// }


