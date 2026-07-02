import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    toast.success('Your message has been sent successfully!');
  };

  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-primary-100">We're here to help you save lives</p>
        </div>
      </section>

      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: FaEnvelope, title: 'Email', lines: ['support@lifesaver.org', 'emergency@lifesaver.org'] },
                { icon: FaPhone, title: 'Phone', lines: ['General: +91 123 456 7890', 'Emergency: 1800-123-456-7'], tel: ['+911234567890', '18001234567'] },
                {
                  icon: FaMapMarkerAlt,
                  title: 'Address',
                  lines: ['LifeSaver Headquarters', '123 Healthcare Avenue', 'Medical District, City - 500001'],
                  mapHref: 'https://www.google.com/maps/search/?api=1&query=LifeSaver+Headquarters+123+Healthcare+Avenue+Medical+District+City+500001',
                },
                { icon: FaClock, title: 'Working Hours', lines: ['Emergency: 24/7'] },
              ].map(({ icon: Icon, title, lines, tel, mapHref, highlight }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="icon-box">
                    <Icon className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    {lines.map((line, index) => {
                      if (title === 'Phone' && tel && index < tel.length) {
                        const [label, value] = line.split(': ');
                        return (
                          <p key={line} className="text-gray-600">
                            {label}: <a href={`tel:${tel[index]}`} className="text-primary-700 underline">{value}</a>
                          </p>
                        );
                      }

                      return (
                        <p key={line} className="text-gray-600">{line}</p>
                      );
                    })}
                    {mapHref && (
                      <p className="mt-2">
                        <a href={mapHref} target="_blank" rel="noreferrer" className="text-primary-700 underline">
                          View on map
                        </a>
                      </p>
                    )}
                    {highlight && (
                      <p className="font-bold text-primary-600 mt-1">{highlight}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field resize-none"
                  rows="5"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="emergency-banner mt-12 md:mt-16">
          <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
            <FaPhone />
            Emergency Blood Request
          </h3>
          <p className="text-red-700 mb-3">For emergency blood requests, call our 24/7 helpline:</p>
          <p className="text-3xl font-bold text-red-600">
            <a href="tel:18001234567" className="underline hover:text-red-800">1800-123-4567</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
