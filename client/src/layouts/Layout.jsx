import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  FaHeartbeat, FaHome, FaUser, FaCalendar, FaHistory, 
  FaCertificate, FaBell, FaSignOutAlt, FaTint, FaHospital,
  FaFlask, FaBox, FaClipboardList, FaQrcode, FaUserCheck,
  FaChartBar, FaUsers, FaBuilding, FaMoneyBillWave, FaBullhorn,
  FaCog, FaFileAlt, FaHandHoldingHeart
} from 'react-icons/fa';

const Layout = ({ role }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = () => {
    switch (role) {
      case 'donor':
        return [
          { path: '/donor', icon: FaHome, label: 'Dashboard' },
          { path: '/donor/profile', icon: FaUser, label: 'Profile' },
          { path: '/donor/appointments', icon: FaCalendar, label: 'Appointments' },
          { path: '/donor/history', icon: FaHistory, label: 'Donation History' },
          { path: '/donor/certificates', icon: FaCertificate, label: 'Certificates' },
          { path: '/donor/rewards', icon: FaHandHoldingHeart, label: 'Rewards' },
        ];
      case 'hospital':
        return [
          { path: '/hospital', icon: FaHome, label: 'Dashboard' },
          { path: '/hospital/request', icon: FaTint, label: 'Request Blood' },
          { path: '/hospital/history', icon: FaHistory, label: 'Request History' },
          { path: '/hospital/available', icon: FaBox, label: 'Available Blood' },
        ];
      case 'bloodbank':
        return [
          { path: '/bloodbank', icon: FaHome, label: 'Dashboard' },
          { path: '/bloodbank/collection', icon: FaTint, label: 'Blood Collection' },
          { path: '/bloodbank/storage', icon: FaFlask, label: 'Blood Storage' },
          { path: '/bloodbank/inventory', icon: FaBox, label: 'Inventory' },
          { path: '/bloodbank/requests', icon: FaClipboardList, label: 'Blood Requests' },
          { path: '/bloodbank/tracking', icon: FaQrcode, label: 'Bag Tracking' },
          { path: '/bloodbank/verification', icon: FaUserCheck, label: 'Donor Verification' },
          { path: '/bloodbank/reports', icon: FaFileAlt, label: 'Reports' },
        ];
      case 'admin':
        return [
          { path: '/admin', icon: FaHome, label: 'Dashboard' },
          { path: '/admin/users', icon: FaUsers, label: 'User Management' },
          { path: '/admin/bloodbanks', icon: FaBuilding, label: 'Blood Banks' },
          { path: '/admin/inventory', icon: FaBox, label: 'Blood Inventory' },
          { path: '/admin/donations', icon: FaMoneyBillWave, label: 'Financial Donations' },
          { path: '/admin/campaigns', icon: FaBullhorn, label: 'Campaigns' },
          { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
          { path: '/admin/certificates', icon: FaCertificate, label: 'Certificates' },
          { path: '/admin/reports', icon: FaFileAlt, label: 'Reports' },
          { path: '/admin/settings', icon: FaCog, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <FaHeartbeat className="text-primary-500 text-2xl" />
            <span className="text-xl font-bold">LifeSaver</span>
          </Link>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 transition ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center space-x-3 text-gray-300 hover:text-white transition w-full"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>

            <div className="flex items-center space-x-4">
              <Link to={`/${role}/notifications`} className="relative">
                <FaBell className="text-gray-600 text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
