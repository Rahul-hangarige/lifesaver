import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './layouts/Layout';
import PublicLayout from './layouts/PublicLayout';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import BloodSearch from './pages/public/BloodSearch';
import BecomeDonor from './pages/public/BecomeDonor';
import DonateMoney from './pages/public/DonateMoney';
import Campaigns from './pages/public/Campaigns';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import FindBloodBanks from './pages/public/FindBloodBanks';
import Login from './pages/public/Login';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import Register from './pages/public/Register';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import DonorAppointments from './pages/donor/Appointments';
import DonorHistory from './pages/donor/History';
import DonorCertificates from './pages/donor/Certificates';
import DonorNotifications from './pages/donor/Notifications';
import DonorRewards from './pages/donor/Rewards';

// Hospital Pages
import HospitalDashboard from './pages/hospital/Dashboard';
import HospitalRequest from './pages/hospital/BloodRequest';
import HospitalHistory from './pages/hospital/History';
import HospitalAvailable from './pages/hospital/AvailableBlood';
import HospitalNotifications from './pages/hospital/Notifications';

// Blood Bank Pages
import BloodBankDashboard from './pages/bloodbank/Dashboard';
import BloodBankCollection from './pages/bloodbank/BloodCollection';
import BloodBankStorage from './pages/bloodbank/BloodStorage';
import BloodBankInventory from './pages/bloodbank/Inventory';
import BloodBankRequests from './pages/bloodbank/Requests';
import BloodBankTracking from './pages/bloodbank/Tracking';
import BloodBankVerification from './pages/bloodbank/Verification';
import BloodBankReports from './pages/bloodbank/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBloodBanks from './pages/admin/BloodBanks';
import AdminInventory from './pages/admin/Inventory';
import AdminFinancialDonations from './pages/admin/FinancialDonations';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminAnalytics from './pages/admin/Analytics';
import AdminCertificates from './pages/admin/Certificates';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="search" element={<BloodSearch />} />
              <Route path="find-blood-banks" element={<FindBloodBanks />} />
              <Route path="become-donor" element={<BecomeDonor />} />
              <Route path="donate-money" element={<DonateMoney />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/donor" element={<Layout role="donor" />}>
              <Route index element={<DonorDashboard />} />
              <Route path="profile" element={<DonorProfile />} />
              <Route path="appointments" element={<DonorAppointments />} />
              <Route path="history" element={<DonorHistory />} />
              <Route path="certificates" element={<DonorCertificates />} />
              <Route path="notifications" element={<DonorNotifications />} />
              <Route path="rewards" element={<DonorRewards />} />
            </Route>

            <Route path="/hospital" element={<Layout role="hospital" />}>
              <Route index element={<HospitalDashboard />} />
              <Route path="request" element={<HospitalRequest />} />
              <Route path="history" element={<HospitalHistory />} />
              <Route path="available" element={<HospitalAvailable />} />
              <Route path="notifications" element={<HospitalNotifications />} />
            </Route>

            <Route path="/bloodbank" element={<Layout role="bloodbank" />}>
              <Route index element={<BloodBankDashboard />} />
              <Route path="collection" element={<BloodBankCollection />} />
              <Route path="storage" element={<BloodBankStorage />} />
              <Route path="inventory" element={<BloodBankInventory />} />
              <Route path="requests" element={<BloodBankRequests />} />
              <Route path="tracking" element={<BloodBankTracking />} />
              <Route path="verification" element={<BloodBankVerification />} />
              <Route path="reports" element={<BloodBankReports />} />
            </Route>

            <Route path="/admin" element={<Layout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bloodbanks" element={<AdminBloodBanks />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="donations" element={<AdminFinancialDonations />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
