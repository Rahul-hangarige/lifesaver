import { Link } from 'react-router-dom';
import { FaHeartbeat, FaHandHoldingHeart, FaHospital, FaTint, FaUsers, FaUser, FaCalendar, FaArrowRight } from 'react-icons/fa';

const stats = [
  { icon: FaUsers, value: '10,000+', label: 'Registered Donors' },
  { icon: FaHospital, value: '500+', label: 'Partner Hospitals' },
  { icon: FaTint, value: '50,000+', label: 'Units Collected' },
  { icon: FaHandHoldingHeart, value: '100,000+', label: 'Lives Saved' },
];

const steps = [
  {
    icon: FaUser,
    title: 'Register as Donor',
    desc: 'Create your profile and join our community of lifesavers.',
  },
  {
    icon: FaCalendar,
    title: 'Book Appointment',
    desc: 'Schedule a donation at a nearby blood bank at your convenience.',
  },
  {
    icon: FaHeartbeat,
    title: 'Save Lives',
    desc: 'One donation can save up to 3 lives. Earn certificates and rewards.',
  },
];

const Home = () => {
  return (
    <div>
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Every Drop Counts,<br className="hidden sm:block" /> Every Donor Matters
            </h1>
            <p className="text-lg md:text-xl mb-10 text-primary-100 leading-relaxed">
              Connecting blood donors, blood banks, and hospitals to save lives when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/become-donor" className="btn-secondary bg-white text-primary-600 border-white hover:bg-primary-50">
                <FaHeartbeat className="mr-2" />
                Become a Donor
              </Link>
              <Link to="/search" className="btn-primary bg-green-600 border-green-600 text-white hover:bg-green-700">
                <FaTint className="mr-2" />
                Request Blood
              </Link>
              <Link to="/find-blood-banks" className="btn-secondary bg-white text-primary-600 border-white hover:bg-primary-50">
                <FaHospital className="mr-2" />
                Find Blood Banks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stat-card">
                <div className="icon-box w-fit mx-auto mb-4">
                  <Icon className="text-2xl" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-gray-500 text-sm md:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">How LifeSaver Works</h2>
          <p className="section-subtitle">Three simple steps to make a life-saving difference</p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card text-center relative">
                <span className="absolute top-4 right-4 text-5xl font-bold text-primary-50 select-none">
                  {i + 1}
                </span>
                <div className="icon-box w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-2xl">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Blood Urgently?</h2>
          <p className="text-lg mb-8 text-primary-100 leading-relaxed">
            Our emergency system connects hospitals with available blood instantly. Every second counts.
          </p>
          <Link to="/search" className="btn-secondary bg-white text-primary-600 border-white hover:bg-primary-50">
            Search Available Blood
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Join Our Mission</h2>
          <p className="section-subtitle">
            Donate blood, support financially, or partner with us as a hospital or blood bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/become-donor" className="btn-primary">Donate Blood</Link>
            <Link to="/donate-money" className="btn-secondary">Support Financially</Link>
            <Link to="/register" className="btn-outline">Register as Partner</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
