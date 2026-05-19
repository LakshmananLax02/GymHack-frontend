'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FolderPlus, PackagePlus,
  TrendingUp, LogOut, Menu, X, Bell, ChevronDown,
  Search, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'users',           label: 'Users',           icon: Users           },
  { id: 'create-category', label: 'Create Category', icon: FolderPlus      },
  { id: 'add-product',     label: 'Add New Product', icon: PackagePlus     },
  { id: 'high-selling',    label: 'High Selling',    icon: TrendingUp      },
];

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}

// ─── Shared input class (matches LoginPage exactly) ───────────────────────────
const inputClass = [
  'w-full py-3 text-sm font-medium text-gray-900 bg-white',
  'border-2 border-gray-200 rounded-xl outline-none transition-all',
  'placeholder:text-gray-400',
  'focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/8',
  'hover:border-gray-300',
].join(' ');

// ─── Shared: submit button ────────────────────────────────────────────────────
function SubmitBtn({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit" disabled={loading}
      className="w-full py-3.5 bg-[#2d7a3a] text-white text-sm font-black rounded-full
                 hover:bg-[#246331] active:scale-[0.98] transition-all mt-1
                 shadow-lg shadow-[#2d7a3a]/25
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {loadingLabel}
        </span>
      ) : label}
    </button>
  );
}

// ─── Shared: error box ────────────────────────────────────────────────────────
function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-3">
      <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs text-red-700 font-semibold leading-snug">{error}</p>
    </div>
  );
}

// ─── Shared: success box ──────────────────────────────────────────────────────
function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 bg-green-50 border-2 border-green-200 rounded-xl px-3.5 py-3">
      <p className="text-xs text-green-700 font-semibold leading-snug">{message}</p>
    </div>
  );
}

// ─── Shared: field label ──────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {children}
    </label>
  );
}

// ─── Shared: form card ────────────────────────────────────────────────────────
function FormCard({ children }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-xl shadow-gray-200/80 border-2 border-gray-300 max-w-md">
      {children}
    </div>
  );
}

// ─── Shared: table card ───────────────────────────────────────────────────────
function TableCard({ children }) {
  return (
    <div className="bg-white rounded-xl shadow-xl shadow-gray-200/80 border-2 border-gray-300 overflow-hidden">
      {children}
    </div>
  );
}

// ─── Shared: skeleton ────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="p-5 space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );
}

// ─── Shared: empty ────────────────────────────────────────────────────────────
function Empty({ icon: Icon = AlertCircle, message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={40} className="text-gray-200 mb-3" />
      <p className="text-sm font-semibold text-gray-400">{message}</p>
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function DashboardView() {
  const stats = [
    { label: 'Total Users', value: '—', icon: '👥', bg: 'bg-blue-50'   },
    { label: 'Products',    value: '—', icon: '📦', bg: 'bg-green-50'  },
    { label: 'Categories',  value: '—', icon: '🗂️', bg: 'bg-amber-50'  },
    { label: 'Top Sellers', value: '—', icon: '🔥', bg: 'bg-red-50'    },
  ];
  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-xl shadow-gray-200/80 border-2 border-gray-300 flex items-center gap-4">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersView() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/api/admin/users`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUsers(data.users || []);
      } catch (e) { setError(e.message); }
      finally     { setLoading(false); }
    })();
  }, []);

  const filtered = users.filter(u =>
    `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <TableCard>
        {/* Search */}
        <div className="p-4 border-b-2 border-gray-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text" placeholder="Search users…"
              value={search} onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-10 pr-4`}
            />
          </div>
        </div>

        {loading ? <Skeleton /> : error ? <Empty message={error} /> : filtered.length === 0 ? (
          <Empty icon={Users} message="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['Name', 'Email', 'Phone', 'Joined', 'Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u, i) => {
                  const name    = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.name || '—';
                  const initial = name[0]?.toUpperCase() || 'U';
                  return (
                    <tr key={u._id || u.id || i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#2d7a3a]/10 flex items-center justify-center text-xs font-black text-[#2d7a3a] shrink-0">
                            {initial}
                          </div>
                          <span className="font-semibold text-gray-900 whitespace-nowrap">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{u.email || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{u.phone || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider
                          ${u.isActive !== false ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
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

function CreateCategoryView() {
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/api/admin/categories`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body:    JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(`Category "${data.category?.name || name}" created!`);
      setName('');
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  };

  return (
    <div className="p-6 md:p-8">
      <FormCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label>Category Name</Label>
            <input
              type="text" required placeholder="e.g. Oats, Muesli…"
              value={name} onChange={e => setName(e.target.value)}
              className={`${inputClass} px-4`}
            />
          </div>
          <ErrorBox error={error} />
          <SuccessBox message={success} />
          <SubmitBtn loading={loading} label="Create Category" loadingLabel="Creating…" />
        </form>
      </FormCard>
    </div>
  );
}

function AddProductView() {
  const [form,       setForm]       = useState({ name: '', price: '', category: '', description: '' });
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/api/admin/categories`, { headers: authHeaders() });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {}
    })();
  }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/api/admin/products`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(`Product "${form.name}" added!`);
      setForm({ name: '', price: '', category: '', description: '' });
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  };

  return (
    <div className="p-6 md:p-8">
      <FormCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <Label>Product Name</Label>
            <input type="text" required placeholder="e.g. Premium Rolled Oats"
              value={form.name} onChange={set('name')} className={`${inputClass} px-4`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Price (₹)</Label>
            <input type="number" required placeholder="e.g. 180"
              value={form.price} onChange={set('price')} className={`${inputClass} px-4`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <select value={form.category} onChange={set('category')} required
              className={`${inputClass} px-4 cursor-pointer`}>
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <textarea rows={3} placeholder="Short product description…"
              value={form.description} onChange={set('description')}
              className={`${inputClass} px-4 resize-none`} />
          </div>

          <ErrorBox error={error} />
          <SuccessBox message={success} />
          <SubmitBtn loading={loading} label="Add Product" loadingLabel="Adding…" />
        </form>
      </FormCard>
    </div>
  );
}

function HighSellingView() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/api/admin/products/high-selling`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProducts(data.products || []);
      } catch (e) { setError(e.message); }
      finally     { setLoading(false); }
    })();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <TableCard>
        {loading ? <Skeleton /> : error ? <Empty message={error} /> : products.length === 0 ? (
          <Empty icon={TrendingUp} message="No high selling products yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['Rank', 'Product', 'Category', 'Price', 'Units Sold', 'Revenue'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p, i) => (
                  <tr key={p._id || p.id || i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                        ${i === 0 ? 'bg-amber-50 text-amber-600' : i === 1 ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{p.name}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{p.category?.name || p.category || '—'}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">₹{p.price}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.unitsSold ?? p.sales ?? '—'}</td>
                    <td className="px-5 py-3.5 font-black text-[#2d7a3a]">{p.revenue ? `₹${p.revenue}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}

// ─── View map ─────────────────────────────────────────────────────────────────
const VIEWS = {
  'dashboard':       DashboardView,
  'users':           UsersView,
  'create-category': CreateCategoryView,
  'add-product':     AddProductView,
  'high-selling':    HighSellingView,
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [auth,        setAuth]        = useState(false);
  const [activeView,  setActiveView]  = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.replace('/admin/login');
    else setAuth(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const activeLabel = NAV.find(n => n.id === activeView)?.label ?? 'Dashboard';
  const ActiveView  = VIEWS[activeView];

  if (!auth) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-white border-r-2 border-gray-200 z-40
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="px-5 py-5 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative shrink-0">
              <Image src="/images/logoimg.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none mb-0.5">exploring</p>
              <p className="text-lg font-black text-[#2d7a3a] leading-none italic tracking-tight">Munnar</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-4 pt-4 pb-3 border-b-2 border-gray-100">
          <div className="flex items-center gap-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2d7a3a] flex items-center justify-center text-white text-sm font-black shrink-0">A</div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-none">Admin</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                  ${active
                    ? 'bg-[#2d7a3a] text-white shadow-md shadow-[#2d7a3a]/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t-2 border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} className="text-red-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b-2 border-gray-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-black text-gray-900 tracking-tight">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#2d7a3a] hover:bg-[#246331] text-white px-4 py-2 rounded-full text-xs font-black transition-colors shadow-md shadow-[#2d7a3a]/20"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">A</div>
              Admin
              <ChevronDown size={12} className="opacity-70" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <ActiveView />
        </main>
      </div>

    </div>
  );
}