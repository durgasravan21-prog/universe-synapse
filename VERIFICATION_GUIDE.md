# UniVerse Synapse - University Verification System

## Overview

The UniVerse Synapse platform implements a comprehensive, multi-layered verification system to ensure that only legitimate universities can register and use the platform. This document outlines the verification process and security measures in place.

## Verification Layers

### 1. **University Database Verification**
- The system maintains a database of verified universities with their official email domains
- Only universities in this verified list can register
- Each university has multiple official domains registered (e.g., harvard.edu, fas.harvard.edu)
- New universities can be added to the database by platform administrators

**Current Verified Universities:**

**NIRF Ranked Indian Universities - IITs (Indian Institutes of Technology):**
- IIT Madras (iitm.ac.in) - NIRF Rank 1
- IIT Delhi (iitd.ac.in) - NIRF Rank 2
- IIT Bombay (iitb.ac.in) - NIRF Rank 3
- IIT Kanpur (iitk.ac.in)
- IIT Kharagpur (iitkgp.ac.in)
- IIT Roorkee (iitr.ac.in)
- IIT Guwahati (iitg.ac.in)
- IIT (BHU) Varanasi (iitbhu.ac.in)
- IIT Indore (iiti.ac.in)
- IIT Hyderabad (iith.ac.in)
- IIT Gandhinagar (iitgn.ac.in)
- IIT Mandi (iitmandi.ac.in)
- IIT Bhubaneswar (iitbbs.ac.in)
- IIT Goa (iitgoa.ac.in)
- IIT Tirupati (iittp.ac.in)
- IIT Dhanbad (iitism.ac.in)
- IIT Palakkad (iitpkd.ac.in)
- IIT Jammu (iitjammu.ac.in)
- IIT Jodhpur (iitj.ac.in)

**NIRF Ranked Indian Universities - Central Universities:**
- Indian Institute of Science Bangalore (iisc.ac.in) - NIRF Rank 2 Overall
- Jawaharlal Nehru University (jnu.ac.in) - NIRF Rank 3 Overall
- University of Delhi (du.ac.in)
- Banaras Hindu University (bhu.ac.in)
- Aligarh Muslim University (amu.ac.in)
- Jamia Millia Islamia (jmi.ac.in)
- Anna University (annauniv.edu.in)
- Savitribai Phule Pune University (unipune.ac.in)
- University of Calcutta (caluniv.ac.in)
- University of Madras (unom.ac.in)
- University of Mumbai (mu.ac.in)
- Jadavpur University (jadavpur.edu.in)

**NIRF Ranked Indian Universities - Private Universities:**
- Manipal Academy of Higher Education (manipal.edu)
- Amrita Vishwa Vidyapeetham (amrita.edu)
- VIT University (vit.ac.in)
- BITS Pilani (bits-pilani.ac.in)

**NIRF Ranked Indian Universities - NITs (National Institutes of Technology):**
- NIT Tiruchirappalli (nitt.edu)
- NIT Warangal (nitw.ac.in)
- NIT Rourkela (nitrourkela.ac.in)
- NIT Karnataka (nitk.ac.in)
- NIT Allahabad (mnnit.ac.in)

**NIRF Ranked Indian Universities - IIITs (Indian Institutes of Information Technology):**
- IIIT Hyderabad (iiit.ac.in)
- IIIT Delhi (iiitd.ac.in)
- IIIT Bangalore (iiitb.ac.in)

**NIRF Ranked Indian Universities - IISERs (Indian Institutes of Science Education and Research):**
- IISER Pune (iiserpune.ac.in)
- IISER Kolkata (iiserkolkata.ac.in)
- IISER Bhopal (iiserbhopal.ac.in)
- IISER Thiruvananthapuram (iisertvm.ac.in)

**International Universities:**
- Harvard University (harvard.edu)
- Stanford University (stanford.edu)
- MIT (mit.edu)
- University of Oxford (ox.ac.uk)
- University of Cambridge (cam.ac.uk)
- UC Berkeley (berkeley.edu)
- Caltech (caltech.edu)
- Yale University (yale.edu)
- Princeton University (princeton.edu)
- Columbia University (columbia.edu)
- University of Pennsylvania (upenn.edu)
- Duke University (duke.edu)
- University of Chicago (uchicago.edu)
- Northwestern University (northwestern.edu)
- Cornell University (cornell.edu)
- University of Toronto (utoronto.ca)
- McGill University (mcgill.ca)
- National University of Singapore (nus.edu.sg)
- Nanyang Technological University (ntu.edu.sg)

### 2. **Email Domain Verification**
- During registration, users must provide an official university email address
- The system automatically validates that the email domain matches one of the university's official domains
- Users cannot proceed with registration if their email domain doesn't match
- Example: To register Harvard University, the admin must use an email ending in @harvard.edu

### 3. **Multi-Step Registration Process**

#### Step 1: University Selection
- Users browse a searchable list of verified universities
- They select their institution from the list
- This ensures they can only register verified universities

#### Step 2: Email Verification
- Users enter their official university email address
- The system validates the email domain against the selected university's official domains
- If the domain doesn't match, registration is blocked with a clear error message
- Users receive immediate feedback about domain validation

#### Step 3: Account Setup
- After email verification, users create their admin account
- They set a strong password
- They provide their full name
- All information is collected before submission

#### Step 4: Pending Approval
- After registration, the account enters a "Pending Approval" state
- Platform administrators review the registration
- Administrators can approve or reject the registration with reasons
- Users are notified of the approval status via email

### 4. **Admin Verification Dashboard**
- Platform administrators have access to a dedicated verification dashboard
- Dashboard shows all pending registrations with full details
- Administrators can:
  - View pending university registrations
  - Filter by status (pending, verified, rejected)
  - Search by university name or email
  - Approve registrations
  - Reject registrations with detailed reasons
- All approvals and rejections are logged with timestamps and admin information

### 5. **Verification Status Tracking**

Each university registration has one of three statuses:

- **Pending**: Awaiting platform admin review
- **Verified**: Approved and active
- **Rejected**: Rejected with reason provided

Users can see their registration status and any rejection reasons.

## Security Features

### Email Credential System
- Each verified university receives a unique domain: `{university_name}.synapse.in`
- Admin emails are auto-generated: `{domain}.admin.{incremental_number}@synapse.in`
- Example: `harvard.admin.001@synapse.in`, `harvard.admin.002@synapse.in`
- This prevents credential sharing and maintains clear audit trails

### Multi-Tenant Isolation
- Each university's data is completely isolated
- Universities cannot access other universities' information
- Staff and students are scoped to their university

### Formal Authentication
- All users must authenticate with their university credentials
- Session management prevents unauthorized access
- Role-based access control ensures users can only access appropriate features

## Registration Flow

```
User visits landing page
    ↓
Clicks "Register Your University"
    ↓
Selects university from verified list
    ↓
Enters official university email
    ↓
System validates email domain
    ↓
Creates admin account with password
    ↓
Registration submitted for approval
    ↓
Platform admin reviews registration
    ↓
Admin approves or rejects
    ↓
User notified of status
    ↓
If approved: University admin can now log in and manage staff/students
```

## Testing the System

### Demo Credentials for Testing:

**Platform Admin** (for verification dashboard):
- Email: `platform-admin@synapse.in`
- Password: any password (demo mode)
- Access: `/admin/verification` route

**Verified University Admin**:
- Email: `harvard.admin.001@synapse.in`
- Password: any password (demo mode)

**Staff Member**:
- Email: `staff@synapse.in`
- Password: any password (demo mode)

**Student**:
- Email: `student@synapse.in`
- Password: any password (demo mode)

### Testing Registration:

1. Go to the landing page
2. Click "Register Your University"
3. Select a university from the list (e.g., Harvard University)
4. Enter an email matching that university's domain (e.g., admin@harvard.edu)
5. Complete the registration form
6. The registration will be marked as "Pending Approval"
7. Log in as platform admin to approve/reject

## Future Enhancements

1. **Email Verification Tokens**
   - Send verification emails with tokens
   - Users must click the link to confirm email ownership
   - Prevents registration with invalid emails

2. **Advanced Domain Validation**
   - Check MX records to validate email domains
   - Verify SPF/DKIM records
   - Real-time email validation APIs

3. **Two-Factor Authentication**
   - Add 2FA for all users
   - SMS or authenticator app support
   - Enhanced security for sensitive operations

4. **Audit Logging**
   - Log all verification actions
   - Track admin approvals/rejections
   - Generate compliance reports

5. **API for University Verification**
   - Allow universities to integrate their own verification
   - SAML/OAuth integration with university systems
   - Automatic credential provisioning

## Support

For questions about the verification system or to add new universities to the verified list, contact the platform administrators.
