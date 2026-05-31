import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/jobs', label: 'Jobs' },
  { to: '/admin/jobs/new', label: 'Create Job' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <Link to="/admin/dashboard" className="text-lg font-bold text-primary-700">
            Admin Portal
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/jobs'}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-slate-800 lg:hidden">Admin</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.fullName || user?.email}</span>
            <Link to="/" className="text-sm text-primary-600 hover:underline">
              View Site
            </Link>
            <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
