const express = require('express');
const Appointment = require('../models/Appointment');
const BloodBank = require('../models/BloodBank');
const Donor = require('../models/Donor');
const { auth, authorize } = require('../middleware/auth');
const sendNotification = require('../utils/sendNotification');

const router = express.Router();

// Create appointment (Donor)
router.post('/', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const appointment = new Appointment({
      donorId: donor._id,
      ...req.body
    });

    await appointment.save();

    // Notify blood bank
    const bloodBank = await BloodBank.findById(req.body.bloodBankId).populate('userId');
    const io = req.app.get('io');
    await sendNotification(
      io,
      bloodBank.userId._id,
      'bloodbank',
      'New Appointment',
      `New appointment scheduled for ${new Date(req.body.appointmentDate).toLocaleDateString()}`,
      'appointment',
      'medium',
      true,
      `/appointments/${appointment._id}`
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor appointments
router.get('/my', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { donorId: donor._id };

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('bloodBankId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood bank appointments
router.get('/bloodbank', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    const query = { bloodBankId: bloodBank._id };

    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('donorId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment status (Blood Bank)
router.put('/:id/status', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // Notify donor
    const donor = await Donor.findById(appointment.donorId).populate('userId');
    const io = req.app.get('io');
    await sendNotification(
      io,
      donor.userId._id,
      'donor',
      'Appointment Updated',
      `Your appointment status has been updated to ${status}`,
      'appointment',
      'medium',
      false,
      `/appointments/${appointment._id}`
    );

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment (Donor)
router.put('/:id/cancel', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      donorId: donor._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify blood bank
    const bloodBank = await BloodBank.findById(appointment.bloodBankId).populate('userId');
    const io = req.app.get('io');
    await sendNotification(
      io,
      bloodBank.userId._id,
      'bloodbank',
      'Appointment Cancelled',
      `Appointment has been cancelled by donor`,
      'appointment',
      'medium',
      false,
      `/appointments/${appointment._id}`
    );

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available time slots
router.get('/slots/:bloodBankId/:date', async (req, res) => {
  try {
    const { bloodBankId, date } = req.params;
    const appointmentDate = new Date(date);

    const existingAppointments = await Appointment.find({
      bloodBankId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      }
    });

    const bookedSlots = existingAppointments.map(a => a.timeSlot);
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
