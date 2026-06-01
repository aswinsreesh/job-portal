import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary-800 bg-primary-900 text-primary-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">HireBridge</h3>
            <p className="mt-2 text-sm text-primary-200">
              Your gateway to finding the perfect career opportunity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="text-primary-100 hover:text-accent-300">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-100 hover:text-accent-300">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Admin</h4>
            <p className="mt-3 text-sm text-primary-200">
              <Link to="/admin/login" className="hover:text-accent-300">
                HireBridge Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
