import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  { question: 'Who can donate blood?', answer: 'Anyone between 18-65 years old, weighing at least 50kg, with hemoglobin level ≥12.5 g/dL can donate blood. You should be in good health with no major illnesses.' },
  { question: 'How often can I donate blood?', answer: 'Men can donate every 3 months (4 times a year) and women can donate every 4 months (3 times a year). This interval allows your body to replenish the blood cells.' },
  { question: 'Is donating blood safe?', answer: 'Yes, donating blood is completely safe. All equipment used is sterile and disposable. The process is supervised by trained medical professionals.' },
  { question: 'How long does the donation process take?', answer: 'The entire process takes about 30-45 minutes, including registration, health screening, the actual donation (10-15 minutes), and refreshment time.' },
  { question: 'What should I do before donating blood?', answer: "Eat a healthy meal, drink plenty of water, and get a good night's sleep. Avoid alcohol for 24 hours before donation." },
  { question: 'Will donating blood affect my health?', answer: 'No, donating blood does not affect your health. Your body replaces the lost blood within 24-48 hours. Regular donation can even have health benefits.' },
  { question: 'How do I register as a donor?', answer: 'You can register online through our website by clicking "Become a Donor" and filling out the registration form.' },
  { question: 'Can I donate if I have a tattoo?', answer: "You can donate blood 6 months after getting a tattoo or piercing. This waiting period ensures there's no risk of infection." },
  { question: 'What happens to my donated blood?', answer: "Your blood is tested for various diseases, separated into components, and stored. It's then matched with patients who need it." },
  { question: 'How can I support LifeSaver financially?', answer: 'You can make secure online donations through our "Donate Money" page. Choose a specific campaign or make a general donation.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQs</h1>
          <p className="text-lg text-primary-100">Answers to common questions about blood donation</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left p-5 hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-primary-600 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-primary-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-gray-600 pt-4 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card bg-primary-50 border-primary-100 mt-10 text-center">
          <h3 className="font-bold text-lg mb-2 text-gray-900">Still have questions?</h3>
          <p className="text-gray-600 mb-5">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
