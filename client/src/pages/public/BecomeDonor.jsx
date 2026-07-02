import { Link } from 'react-router-dom';
import { FaHeartbeat, FaCheckCircle, FaUser, FaCalendar, FaAward } from 'react-icons/fa';

const eligibilityCriteria = [
  { icon: FaUser, text: 'Age between 18 and 65 years' },
  { icon: FaCheckCircle, text: 'Weight at least 50 kg' },
  { icon: FaHeartbeat, text: 'Hemoglobin level ≥ 12.5 g/dL' },
  { icon: FaCheckCircle, text: 'No major illnesses or chronic conditions' },
  { icon: FaCheckCircle, text: 'Not pregnant or breastfeeding' },
  { icon: FaCalendar, text: 'Minimum 3 months gap between donations' },
];

const benefits = [
  { icon: FaAward, text: 'Digital donation certificates' },
  { icon: FaAward, text: 'Achievement badges and rewards' },
  { icon: FaHeartbeat, text: 'Free health screening' },
  { icon: FaCheckCircle, text: 'Regular blood pressure check' },
  { icon: FaAward, text: 'Save up to 3 lives per donation' },
];

const processSteps = [
  { step: '1', title: 'Register', desc: 'Create your donor profile online' },
  { step: '2', title: 'Screening', desc: 'Health check and eligibility test' },
  { step: '3', title: 'Donate', desc: '10–15 minute donation process' },
  { step: '4', title: 'Refresh', desc: 'Receive refreshments and certificate' },
];

const BecomeDonor = () => {
  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Blood Donor</h1>
          <p className="text-lg text-primary-100">Join our community of lifesavers</p>
        </div>
      </section>

      <div className="page-container">
        <div className="card mb-8 md:mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {eligibilityCriteria.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <Icon className="text-primary-600 text-lg flex-shrink-0" />
                <span className="text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8 md:mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Donating</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-primary-50/50">
                <Icon className="text-primary-600 text-lg flex-shrink-0" />
                <span className="text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-10 md:mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Donation Process</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {processSteps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="bg-primary-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-md">
                  {step}
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Save Lives?</h2>
          <p className="mb-8 text-primary-100 max-w-lg mx-auto">
            Register now and become part of our lifesaving community
          </p>
          <Link to="/register" className="btn-secondary bg-white text-primary-600 border-white hover:bg-primary-50">
            Register as Donor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BecomeDonor;
