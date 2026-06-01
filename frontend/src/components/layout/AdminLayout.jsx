import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/applications', label: 'Applications' },
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
    <div className="flex min-h-screen bg-surface-50">
      <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white lg:block">
        <div className="border-b border-stone-200 px-6 py-5">
          <Link to="/admin/dashboard" className="text-lg font-bold text-primary-700">
            HireBridge Admin
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/jobs'}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent-50 text-accent-800'
                    : 'text-stone-600 hover:bg-surface-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-stone-800 lg:hidden">Admin</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-stone-600">{user?.fullName || user?.email}</span>
            <Link to="/" className="link-accent text-sm">
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
