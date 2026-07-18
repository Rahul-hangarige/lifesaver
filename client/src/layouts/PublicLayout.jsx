import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/search', label: 'Request Blood' },
  { to: '/find-blood-banks', label: 'Find Bloodbanks' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/contact', label: 'Contact' },
];

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">LifeSaver</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-black hover:text-black font-semibold text-base transition ${isActive(to) ? 'text-black font-bold' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to={`/${user.role}`} className="text-black hover:text-black font-semibold text-base transition">
                    Dashboard
                  </Link>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        logout();
                        navigate('/login');
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-black hover:text-black font-semibold text-base transition">
                    Login
                  </Link>
                  <Link to="/register" className="text-black hover:text-black font-semibold text-base transition">
                    Register
                  </Link>
                </>
              )}
            </div>

            <div
              role="button"
              tabIndex={0}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMenuOpen(!menuOpen);
                }
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="text-black hover:text-black font-semibold text-base transition w-full text-center"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to={`/${user.role}`} onClick={() => setMenuOpen(false)} className="text-black hover:text-black font-semibold text-base transition w-full text-center">
                    Dashboard
                  </Link>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => { logout(); navigate('/login'); setMenuOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        logout();
                        navigate('/login');
                        setMenuOpen(false);
                      }
                    }}
                    className="text-black hover:text-black font-semibold text-base transition w-full text-center cursor-pointer"
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-black hover:text-black font-semibold text-base transition w-full text-center">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="text-black hover:text-black font-semibold text-base transition w-full text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-600 p-2 rounded-xl">
                  <FaHeartbeat className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold">LifeSaver</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Every Drop Counts, Every Donor Matters. Connecting donors with those in need.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2.5 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/search" className="hover:text-white transition">Search Blood</Link></li>
                <li><Link to="/become-donor" className="hover:text-white transition">Become a Donor</Link></li>
                <li><Link to="/donate-money" className="hover:text-white transition">Donate Money</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2.5 text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
                <li><Link to="/campaigns" className="hover:text-white transition">Campaigns</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Emergency</h3>
              <p className="text-gray-400 mb-2 text-sm">24/7 emergency blood requests</p>
              <p className="text-primary-400 font-bold text-2xl">1800-123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} LifeSaver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
