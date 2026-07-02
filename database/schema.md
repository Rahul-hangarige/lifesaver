# LifeSaver Database Schema

## MongoDB Collections

### 1. users
Stores user authentication and basic profile information.

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (required, enum: ['admin', 'donor', 'hospital', 'bloodbank', 'financial_donor']),
  phone: String (required),
  profilePhoto: String,
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 2. donors
Stores donor-specific information.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  dateOfBirth: Date (required),
  gender: String (required, enum: ['male', 'female', 'other']),
  age: Number (required),
  weight: Number (required),
  bloodGroup: String (required, enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'India')
  },
  medicalHistory: String,
  lastDonationDate: Date,
  totalDonations: Number (default: 0),
  governmentId: String,
  governmentIdType: String (enum: ['aadhar', 'passport', 'driving_license', 'voter_id']),
  isEligible: Boolean (default: true),
  eligibilityReason: String,
  badges: [String] (enum: ['first_hero', 'bronze_lifesaver', 'silver_lifesaver', 'gold_lifesaver', 'platinum_donor', 'legend_donor']),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 3. hospitals
Stores hospital profiles and information.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  hospitalName: String (required),
  licenseNumber: String (required, unique),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (default: 'India')
  },
  contactPerson: String (required),
  emergencyContact: String (required),
  department: String,
  totalRequests: Number (default: 0),
  location: {
    type: String (required, enum: ['Point']),
    coordinates: [Number] (required) // [longitude, latitude]
  },
  isApproved: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 4. bloodbanks
Stores blood bank information.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', required),
  bankName: String (required),
  licenseNumber: String (required, unique),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (default: 'India')
  },
  contactPerson: String (required),
  phone: String (required),
  email: String (required),
  operatingHours: {
    open: String,
    close: String
  },
  location: {
    type: String (required, enum: ['Point']),
    coordinates: [Number] (required)
  },
  totalDonations: Number (default: 0),
  totalIssued: Number (default: 0),
  isApproved: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 5. bloodbags
Stores blood inventory and tracking information.

```javascript
{
  _id: ObjectId,
  bagId: String (required, unique),
  donorId: ObjectId (ref: 'donors', required),
  bloodBankId: ObjectId (ref: 'bloodbanks', required),
  bloodGroup: String (required, enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  component: String (required, enum: ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate']),
  collectionDate: Date (required),
  expiryDate: Date (required),
  volume: Number (required),
  testResults: {
    hiv: Boolean (default: false),
    hepatitisB: Boolean (default: false),
    hepatitisC: Boolean (default: false),
    malaria: Boolean (default: false),
    syphilis: Boolean (default: false),
    otherTests: String
  },
  testStatus: String (default: 'pending', enum: ['pending', 'approved', 'rejected']),
  storage: {
    refrigeratorNumber: String,
    shelfNumber: String,
    temperature: Number
  },
  status: String (default: 'available', enum: ['available', 'reserved', 'issued', 'expired', 'discarded']),
  qrCode: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 6. appointments
Stores donation appointment information.

```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: 'donors', required),
  bloodBankId: ObjectId (ref: 'bloodbanks', required),
  appointmentDate: Date (required),
  timeSlot: String (required),
  status: String (default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled', 'no_show']),
  notes: String,
  reminderSent: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 7. bloodrequests
Stores blood requests from hospitals.

```javascript
{
  _id: ObjectId,
  requestId: String (required, unique),
  hospitalId: ObjectId (ref: 'hospitals', required),
  patientName: String (required),
  bloodGroup: String (required, enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  unitsRequired: Number (required),
  unitsAssigned: Number (default: 0),
  emergencyLevel: String (default: 'medium', enum: ['low', 'medium', 'high', 'critical']),
  contactNumber: String (required),
  status: String (default: 'pending', enum: ['pending', 'processing', 'partial', 'completed', 'cancelled']),
  assignedBloodBags: [ObjectId] (ref: 'bloodbags'),
  notes: String,
  requestedDate: Date (default: Date.now),
  completedDate: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 8. certificates
Stores digital donation certificates.

```javascript
{
  _id: ObjectId,
  certificateNumber: String (required, unique),
  donorId: ObjectId (ref: 'donors', required),
  donationId: ObjectId (ref: 'bloodbags', required),
  issueDate: Date (default: Date.now),
  donationDate: Date (required),
  bloodGroup: String (required),
  bloodBankName: String (required),
  qrCode: String,
  isVerified: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

### 9. campaigns
Stores fundraising campaign information.

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (required, enum: ['blood_camp', 'equipment', 'emergency_transport', 'patient_support', 'general_fund']),
  targetAmount: Number (required),
  raisedAmount: Number (default: 0),
  startDate: Date (required),
  endDate: Date (required),
  image: String,
  status: String (default: 'active', enum: ['active', 'completed', 'cancelled']),
  createdBy: ObjectId (ref: 'users', required),
  totalDonors: Number (default: 0),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 10. financialdonations
Stores monetary donation records.

```javascript
{
  _id: ObjectId,
  donationId: String (required, unique),
  donorName: String (required),
  email: String (required),
  phone: String,
  amount: Number (required),
  campaignId: ObjectId (ref: 'campaigns'),
  paymentMethod: String (required, enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']),
  transactionId: String (required),
  status: String (default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded']),
  isAnonymous: Boolean (default: false),
  certificateIssued: Boolean (default: false),
  certificateNumber: String,
  badge: String (enum: ['supporter', 'bronze_sponsor', 'silver_sponsor', 'gold_sponsor', 'platinum_sponsor', 'lifesaver_champion']),
  createdAt: Date (default: Date.now)
}
```

### 11. notifications
Stores user notifications.

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId (required),
  recipientRole: String (required, enum: ['admin', 'donor', 'hospital', 'bloodbank']),
  title: String (required),
  message: String (required),
  type: String (required, enum: ['emergency', 'appointment', 'certificate', 'request', 'inventory', 'general']),
  priority: String (default: 'medium', enum: ['low', 'medium', 'high', 'urgent']),
  isRead: Boolean (default: false),
  actionRequired: Boolean (default: false),
  actionLink: String,
  relatedId: ObjectId,
  createdAt: Date (default: Date.now)
}
```

## Indexes

### Geospatial Indexes
- `hospitals.location` (2dsphere)
- `bloodbanks.location` (2dsphere)

### Performance Indexes
- `bloodbags.bloodGroup` + `bloodbags.status`
- `bloodbags.expiryDate`
- `appointments.appointmentDate` + `appointments.status`
- `bloodrequests.status` + `bloodrequests.emergencyLevel`
- `bloodrequests.bloodGroup`
- `notifications.recipientId` + `notifications.isRead`

## Relationships

- **users** → donors (1:1)
- **users** → hospitals (1:1)
- **users** → bloodbanks (1:1)
- **donors** → bloodbags (1:N)
- **bloodbanks** → bloodbags (1:N)
- **bloodbanks** → appointments (1:N)
- **hospitals** → bloodrequests (1:N)
- **bloodrequests** → bloodbags (N:M)
- **bloodbags** → certificates (1:1)
- **campaigns** → financialdonations (1:N)
- **users** → notifications (1:N)
