# LifeSaver API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Routes

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "role": "donor",
  "dateOfBirth": "1990-01-01",
  "bloodGroup": "O+",
  "age": 34,
  "weight": 70
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor",
    "isVerified": false
  }
}
```

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor",
    "isVerified": true
  }
}
```

### GET /auth/me
Get current user profile (Authenticated).

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "donor",
  "phone": "+91 9876543210",
  "isVerified": true,
  "isActive": true
}
```

### PUT /auth/profile
Update user profile (Authenticated).

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+91 9876543211"
}
```

## Donor Routes

### GET /donors/profile
Get donor profile (Authenticated - Donor only).

### PUT /donors/profile
Update donor profile (Authenticated - Donor only).

### GET /donors
Get all donors (Authenticated - Admin/Blood Bank).

**Query Parameters:**
- `bloodGroup` - Filter by blood group
- `isEligible` - Filter by eligibility status
- `page` - Page number
- `limit` - Items per page

### GET /donors/:id
Get donor by ID (Authenticated).

### PUT /donors/:id/eligibility
Update donor eligibility (Authenticated - Admin/Blood Bank).

### GET /donors/eligible/:bloodGroup
Get eligible donors by blood group (Authenticated - Admin/Blood Bank/Hospital).

## Hospital Routes

### GET /hospitals/profile
Get hospital profile (Authenticated - Hospital only).

### PUT /hospitals/profile
Update hospital profile (Authenticated - Hospital only).

### GET /hospitals
Get all hospitals (Authenticated - Admin).

### GET /hospitals/:id
Get hospital by ID (Authenticated).

### PUT /hospitals/:id/approve
Approve hospital (Authenticated - Admin).

### GET /hospitals/nearby/:coordinates
Get nearby hospitals (Public).

## Blood Bank Routes

### GET /bloodbanks/profile
Get blood bank profile (Authenticated - Blood Bank only).

### PUT /bloodbanks/profile
Update blood bank profile (Authenticated - Blood Bank only).

### GET /bloodbanks
Get all blood banks (Authenticated - Admin).

### GET /bloodbanks/approved/list
Get approved blood banks (Public).

### GET /bloodbanks/:id
Get blood bank by ID (Authenticated).

### PUT /bloodbanks/:id/approve
Approve blood bank (Authenticated - Admin).

### GET /bloodbanks/nearby/:coordinates
Get nearby blood banks (Public).

## Blood Routes

### POST /blood
Add blood bag (Authenticated - Blood Bank only).

**Request Body:**
```json
{
  "bagId": "BAG-12345",
  "donorId": "donor_id",
  "bloodGroup": "O+",
  "component": "whole_blood",
  "collectionDate": "2024-01-15",
  "expiryDate": "2024-02-15",
  "volume": 450
}
```

### GET /blood/inventory
Get blood inventory (Authenticated - Blood Bank only).

**Query Parameters:**
- `bloodGroup` - Filter by blood group
- `component` - Filter by component
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

### GET /blood/available/:bloodGroup
Get available blood by blood group (Public).

### PUT /blood/:id
Update blood bag details (Authenticated - Blood Bank only).

### PUT /blood/:id/tests
Update test results (Authenticated - Blood Bank only).

**Request Body:**
```json
{
  "testResults": {
    "hiv": false,
    "hepatitisB": false,
    "hepatitisC": false,
    "malaria": false,
    "syphilis": false
  },
  "testStatus": "approved"
}
```

### PUT /blood/:id/status
Update blood bag status (Authenticated - Blood Bank only).

### GET /blood/expiring/alert
Get expiring blood bags (Authenticated - Blood Bank only).

### GET /blood/summary/stats
Get inventory summary (Authenticated - Admin/Blood Bank).

## Appointment Routes

### POST /appointments
Create appointment (Authenticated - Donor only).

**Request Body:**
```json
{
  "bloodBankId": "bloodbank_id",
  "appointmentDate": "2024-01-20",
  "timeSlot": "10:00"
}
```

### GET /appointments/my
Get donor appointments (Authenticated - Donor only).

### GET /appointments/bloodbank
Get blood bank appointments (Authenticated - Blood Bank only).

### PUT /appointments/:id/status
Update appointment status (Authenticated - Blood Bank only).

### PUT /appointments/:id/cancel
Cancel appointment (Authenticated - Donor only).

### GET /appointments/slots/:bloodBankId/:date
Get available time slots (Public).

## Blood Request Routes

### POST /requests
Create blood request (Authenticated - Hospital only).

**Request Body:**
```json
{
  "patientName": "Patient Name",
  "bloodGroup": "O+",
  "unitsRequired": 2,
  "emergencyLevel": "high",
  "contactNumber": "+91 9876543210"
}
```

### GET /requests/my
Get hospital requests (Authenticated - Hospital only).

### GET /requests
Get all requests (Authenticated - Admin/Blood Bank).

### GET /requests/:id
Get request by ID (Authenticated).

### PUT /requests/:id/assign
Assign blood bags to request (Authenticated - Blood Bank only).

**Request Body:**
```json
{
  "bloodBagIds": ["bag_id_1", "bag_id_2"]
}
```

### PUT /requests/:id/status
Update request status (Authenticated).

## Certificate Routes

### POST /certificates
Generate certificate (Authenticated - Blood Bank only).

**Request Body:**
```json
{
  "donationId": "bloodbag_id"
}
```

### GET /certificates/my
Get donor certificates (Authenticated - Donor only).

### GET /certificates/:id
Get certificate by ID (Authenticated).

### GET /certificates/verify/:certificateNumber
Verify certificate (Public).

### GET /certificates/:id/download
Download certificate (Authenticated).

## Campaign Routes

### POST /campaigns
Create campaign (Authenticated - Admin only).

### GET /campaigns
Get all campaigns (Public).

### GET /campaigns/:id
Get campaign by ID (Public).

### PUT /campaigns/:id
Update campaign (Authenticated - Admin only).

### DELETE /campaigns/:id
Delete campaign (Authenticated - Admin only).

### GET /campaigns/active/list
Get active campaigns (Public).

## Financial Donation Routes

### POST /donations
Create financial donation (Public).

**Request Body:**
```json
{
  "donorName": "Donor Name",
  "email": "donor@example.com",
  "amount": 1000,
  "campaignId": "campaign_id",
  "paymentMethod": "credit_card"
}
```

### GET /donations
Get all donations (Authenticated - Admin only).

### GET /donations/:id
Get donation by ID (Authenticated).

### GET /donations/history/:email
Get donation history by email (Public).

### POST /donations/:id/certificate
Generate certificate for financial donation (Authenticated - Admin only).

### GET /donations/stats/summary
Get donation statistics (Authenticated - Admin only).

## Notification Routes

### GET /notifications
Get user notifications (Authenticated).

### PUT /notifications/:id/read
Mark notification as read (Authenticated).

### PUT /notifications/read/all
Mark all notifications as read (Authenticated).

### DELETE /notifications/:id
Delete notification (Authenticated).

### GET /notifications/unread/count
Get unread count (Authenticated).

## Analytics Routes

### GET /analytics/overview
Get overall analytics (Authenticated - Admin only).

### GET /analytics/donations/monthly
Get monthly donations chart data (Authenticated - Admin only).

### GET /analytics/blood/distribution
Get blood group distribution (Authenticated - Admin only).

### GET /analytics/bloodbank/stats
Get blood bank specific analytics (Authenticated - Blood Bank only).

### GET /analytics/campaigns/performance
Get campaign performance (Authenticated - Admin only).

### GET /analytics/donor/stats
Get donor statistics (Authenticated - Donor only).

## Report Routes

### GET /reports/donations/daily
Generate daily donations report (Authenticated - Admin/Blood Bank).

### GET /reports/donations/monthly
Generate monthly donations report (Authenticated - Admin/Blood Bank).

### GET /reports/inventory
Generate blood inventory report (Authenticated - Admin/Blood Bank).

### GET /reports/usage
Generate blood usage report (Authenticated - Admin/Blood Bank).

### GET /reports/expired
Generate expired blood report (Authenticated - Admin/Blood Bank).

### GET /reports/hospital-requests
Generate hospital requests report (Authenticated - Admin).

### GET /reports/donor-activity
Generate donor activity report (Authenticated - Admin).

### GET /reports/certificates
Generate certificates report (Authenticated - Admin).

### GET /reports/financial-donations
Generate financial donations report (Authenticated - Admin).

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.
