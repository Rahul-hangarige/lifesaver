import { FaHeartbeat, FaUsers, FaHospital, FaAward, FaHandHoldingHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About LifeSaver</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Every Drop Counts, Every Donor Matters
          </p>
        </div>
      </section>

      <div className="page-container">
        <div className="card mb-10 md:mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            LifeSaver bridges the gap between blood donors, blood banks, hospitals, and patients in need.
            Our platform ensures every donation reaches those who need it most, reducing the time to find
            compatible blood during emergencies.
          </p>
        </div>

        <h2 className="section-title mb-10">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {[
            { icon: FaHeartbeat, title: 'Connect Donors', desc: 'Seamlessly connect blood donors with blood banks and hospitals.' },
            { icon: FaHospital, title: 'Support Hospitals', desc: 'Help hospitals find available blood quickly during emergencies.' },
            { icon: FaUsers, title: 'Build Community', desc: 'Build a community of regular donors committed to saving lives.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="icon-box w-fit mx-auto mb-4">
                <Icon className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="card mb-12 md:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: FaAward, title: 'Digital Certificates', desc: 'Verified digital certificates for every donation' },
              { icon: FaHeartbeat, title: 'Real-time Notifications', desc: 'Instant alerts for emergency blood requests' },
              { icon: FaHospital, title: 'Inventory Management', desc: 'Track blood availability across partner banks' },
              { icon: FaHandHoldingHeart, title: 'Financial Support', desc: 'Secure online donations to support blood banks' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="icon-box">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Registered Donors' },
              { value: '50,000+', label: 'Units Collected' },
              { value: '500+', label: 'Partner Hospitals' },
              { value: '100,000+', label: 'Lives Saved' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold mb-1">{value}</div>
                <div className="text-primary-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
