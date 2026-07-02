import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { bloodBankService } from '../../services/bloodBankService';
import { FaCalendar, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DonorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    bloodBankId: '',
    appointmentDate: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, bloodBanksRes] = await Promise.all([
        appointmentService.getMyAppointments(),
        bloodBankService.getApprovedBloodBanks()
      ]);
      setAppointments(appointmentsRes.data.appointments || []);
      setBloodBanks(bloodBanksRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    setBookingForm({ ...bookingForm, appointmentDate: date, timeSlot: '' });
    if (bookingForm.bloodBankId && date) {
      try {
        const response = await appointmentService.getAvailableSlots(bookingForm.bloodBankId, date);
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error loading slots:', error);
      }
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.createAppointment(bookingForm);
      toast.success('Appointment booked successfully');
      setShowBooking(false);
      setBookingForm({ bloodBankId: '', appointmentDate: '', timeSlot: '' });
      loadData();
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        toast.success('Appointment cancelled');
        loadData();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <button onClick={() => setShowBooking(!showBooking)} className="btn-primary">
          {showBooking ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Book New Appointment</h3>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Blood Bank</label>
              <select
                value={bookingForm.bloodBankId}
                onChange={(e) => setBookingForm({ ...bookingForm, bloodBankId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Choose a blood bank</option>
                {bloodBanks.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.bankName} - {bank.address.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={bookingForm.appointmentDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                      className={`py-2 px-3 rounded-lg font-medium transition ${
                        bookingForm.timeSlot === slot
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={!bookingForm.timeSlot} className="btn-primary">
              Confirm Booking
            </button>
          </form>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No appointments yet. Book your first appointment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <FaCalendar className="text-primary-600 text-xl" />
                    <div>
                      <p className="font-semibold text-lg">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">{appointment.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600">
                    <FaMapMarkerAlt />
                    <span>{appointment.bloodBankId?.bankName}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mt-1">
                    <FaPhone />
                    <span>{appointment.bloodBankId?.phone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>

                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="block mt-3 text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorAppointments;
