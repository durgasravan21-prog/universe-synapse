/**
 * Formal Email Templates for University Verification
 * Professional letter templates with formal greetings and closings
 */

export interface EmailTemplate {
  subject: string;
  body: string;
}

export const emailTemplates = {
  // Step 1: Initial Verification Email
  verificationRequest: (universityName: string, verificationLink: string, verificationCode: string): EmailTemplate => ({
    subject: `UniVerse Synapse - Email Verification Request for ${universityName}`,
    body: `
Dear Administrator,

We are pleased to inform you that your institution, ${universityName}, has initiated the registration process with UniVerse Synapse - a modern, secure multi-tenant platform designed for universities to manage students, staff, and academic operations with ease.

To proceed with the verification of your official university email domain, we request you to confirm your email address by clicking the verification link below or entering the verification code provided:

Verification Link: ${verificationLink}
Verification Code: ${verificationCode}

This verification link is valid for 24 hours from the time of this email. Please complete the verification process at your earliest convenience.

Upon successful verification, your institution will proceed to the next stage of registration, where our platform administrators will review your application and approve your access within 2-3 business days.

If you did not initiate this request or have any questions regarding this verification process, please contact our support team immediately at support@synapse.in.

We look forward to partnering with ${universityName} to enhance your academic management capabilities.

Best regards,

**UniVerse Synapse Verification Team**
Email: verify@synapse.in
Support: support@synapse.in
Website: www.synapse.in

---
This is an automated email. Please do not reply directly to this message.
UniVerse Synapse © 2026 | All Rights Reserved
    `,
  }),

  // Step 2: Verification Successful - Awaiting Admin Approval
  verificationSuccessful: (universityName: string, adminEmail: string): EmailTemplate => ({
    subject: `Email Verification Successful - Awaiting Admin Approval for ${universityName}`,
    body: `
Dear Administrator,

Congratulations! Your email verification for ${universityName} has been completed successfully.

Your institution's registration details:
- University Name: ${universityName}
- Verified Email: ${adminEmail}
- Verification Status: ✓ Completed
- Registration Status: Pending Admin Approval

Your application is now under review by our platform administrators. We will evaluate your institution's credentials and verify the authenticity of your university domain. This process typically takes 2-3 business days.

During this period, you will receive updates via email regarding the status of your application. Once approved, you will receive your official UniVerse Synapse credentials and access to the platform.

**What to expect next:**
1. Our team will verify your institution's official records
2. Domain authentication will be confirmed
3. You will receive approval notification via email
4. Your admin account will be activated with synapse.in credentials

If you have any questions or need to provide additional information, please contact us at support@synapse.in.

Thank you for choosing UniVerse Synapse as your academic management partner.

Best regards,

**UniVerse Synapse Verification Team**
Email: verify@synapse.in
Support: support@synapse.in
Website: www.synapse.in

---
This is an automated email. Please do not reply directly to this message.
UniVerse Synapse © 2026 | All Rights Reserved
    `,
  }),

  // Step 3: Verification Failed
  verificationFailed: (universityName: string, reason: string): EmailTemplate => ({
    subject: `Email Verification Failed - Action Required for ${universityName}`,
    body: `
Dear Administrator,

We regret to inform you that the email verification for your institution, ${universityName}, could not be completed successfully.

**Reason for Verification Failure:**
${reason}

**What you can do:**
1. Verify that you are using an official university email address
2. Check that the email domain matches your institution's official domain
3. Ensure the email address is active and accessible
4. Contact your IT department if the email domain has recently changed

**Next Steps:**
You may retry the verification process by:
- Visiting our registration page: www.synapse.in/register
- Using a different official university email address
- Contacting our support team for assistance

If you believe this is an error or need further assistance, please reach out to our support team at support@synapse.in with the following information:
- University Name: ${universityName}
- Email Address Used: [Your email]
- Error Details: Email verification failed

We are here to help and will work with you to resolve any issues.

Best regards,

**UniVerse Synapse Verification Team**
Email: verify@synapse.in
Support: support@synapse.in
Website: www.synapse.in

---
This is an automated email. Please do not reply directly to this message.
UniVerse Synapse © 2026 | All Rights Reserved
    `,
  }),

  // Step 4: Admin Approval - Registration Approved
  registrationApproved: (universityName: string, adminEmail: string, adminCredentials: string): EmailTemplate => ({
    subject: `Registration Approved - Welcome to UniVerse Synapse, ${universityName}!`,
    body: `
Dear Administrator,

We are delighted to inform you that your institution, ${universityName}, has been approved and is now officially registered with UniVerse Synapse!

**Your Official Credentials:**
Admin Email: ${adminEmail}
Temporary Admin ID: ${adminCredentials}

**Getting Started:**
1. Visit: www.synapse.in/login
2. Sign in with your admin credentials
3. Set up your institution profile
4. Create staff and student accounts
5. Begin managing your academic operations

**Your Dashboard Includes:**
- Student Management System
- Staff Management Portal
- Course & Assignment Tracking
- Academic Calendar Management
- Real-time Analytics & Reporting
- Multi-tenant Data Isolation
- Role-based Access Control

**Important Security Information:**
- Change your temporary password immediately upon first login
- Enable two-factor authentication for enhanced security
- Keep your credentials confidential
- Contact support immediately if you suspect unauthorized access

**Support & Resources:**
- Documentation: docs.synapse.in
- Video Tutorials: tutorials.synapse.in
- Email Support: support@synapse.in
- Phone Support: +91-XXXX-XXXX-XXXX

We are excited to partner with ${universityName} and look forward to supporting your institution's academic excellence through our platform.

If you have any questions or need assistance during onboarding, please don't hesitate to contact our support team.

Warm regards,

**UniVerse Synapse Team**
Email: support@synapse.in
Website: www.synapse.in

---
This is an automated email. Please do not reply directly to this message.
UniVerse Synapse © 2026 | All Rights Reserved
    `,
  }),

  // Step 5: Admin Approval - Registration Rejected
  registrationRejected: (universityName: string, reason: string, contactEmail: string): EmailTemplate => ({
    subject: `Registration Status Update - ${universityName}`,
    body: `
Dear Administrator,

Thank you for your interest in UniVerse Synapse. After careful review of your institution's registration application, we regret to inform you that your registration request for ${universityName} could not be approved at this time.

**Reason for Rejection:**
${reason}

**Why This Decision Was Made:**
Our verification process ensures that all institutions using UniVerse Synapse meet our quality and authenticity standards. This helps maintain the integrity and security of our platform for all users.

**What You Can Do:**
1. Review the reason for rejection carefully
2. Address any issues or concerns mentioned
3. Resubmit your application after making necessary corrections
4. Contact our support team for clarification or guidance

**Reapplication Process:**
You may reapply for registration after addressing the issues. Please visit www.synapse.in/register and follow the registration process again.

**Need Help?**
If you have questions about this decision or need assistance, please contact our support team:
Email: ${contactEmail}
Phone: +91-XXXX-XXXX-XXXX

We appreciate your understanding and remain committed to supporting legitimate educational institutions. We hope to welcome ${universityName} to UniVerse Synapse in the future.

Best regards,

**UniVerse Synapse Verification Team**
Email: verify@synapse.in
Support: support@synapse.in
Website: www.synapse.in

---
This is an automated email. Please do not reply directly to this message.
UniVerse Synapse © 2026 | All Rights Reserved
    `,
  }),
};

/**
 * Generate formal email with proper formatting
 */
export function generateFormalEmail(
  template: EmailTemplate,
  recipientName?: string
): string {
  return `${template.subject}\n\n${template.body}`;
}
