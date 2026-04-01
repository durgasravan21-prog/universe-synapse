/**
 * OTP Email Templates
 * Professional email templates for OTP verification
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  plainTextContent: string;
}

/**
 * OTP Verification Email Template
 */
export function getOTPVerificationEmail(
  universityName: string,
  adminName: string,
  email: string,
  otp: string,
  expiryMinutes: number = 15
): EmailTemplate {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
        .greeting { font-size: 16px; margin-bottom: 20px; color: #1e293b; }
        .otp-section { background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 30px 0; text-align: center; }
        .otp-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .otp-code { font-size: 48px; font-weight: 700; color: #1e3a8a; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 20px 0; }
        .otp-expiry { font-size: 13px; color: #ef4444; margin-top: 15px; }
        .instructions { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #1e40af; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer-text { margin: 5px 0; }
        .security-notice { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 12px; color: #92400e; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; padding: 12px 30px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>UniVerse Synapse</h1>
          <p>University Management Platform</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Dear <strong>${adminName}</strong>,</p>
            <p>Thank you for registering <strong>${universityName}</strong> with UniVerse Synapse. To complete your email verification and activate your account, please use the One-Time Password (OTP) below.</p>
          </div>

          <div class="otp-section">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">⏱️ This code expires in ${expiryMinutes} minutes</div>
          </div>

          <div class="instructions">
            <strong>📋 How to use this code:</strong><br>
            1. Go to the verification page on UniVerse Synapse<br>
            2. Enter the 6-digit code above<br>
            3. Click "Verify Email" to confirm your university email
          </div>

          <div class="security-notice">
            <strong>🔒 Security Notice:</strong> If you did not request this verification code, please ignore this email. Do not share this code with anyone. UniVerse Synapse staff will never ask for your OTP.
          </div>

          <div class="divider"></div>

          <div class="footer">
            <p class="footer-text"><strong>Registration Details:</strong></p>
            <p class="footer-text">University: ${universityName}</p>
            <p class="footer-text">Admin Email: ${email}</p>
            <p class="footer-text">Verification Code: ${otp}</p>
            <p class="footer-text">Sent: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p class="footer-text">
                <strong>Need Help?</strong> Contact our support team at support@synapse.in
              </p>
              <p class="footer-text">
                © 2026 UniVerse Synapse. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainTextContent = `
    UNIVERSE SYNAPSE - Email Verification
    =====================================
    
    Dear ${adminName},
    
    Thank you for registering ${universityName} with UniVerse Synapse. To complete your email verification and activate your account, please use the One-Time Password (OTP) below.
    
    YOUR VERIFICATION CODE: ${otp}
    
    This code expires in ${expiryMinutes} minutes.
    
    HOW TO USE THIS CODE:
    1. Go to the verification page on UniVerse Synapse
    2. Enter the 6-digit code above
    3. Click "Verify Email" to confirm your university email
    
    SECURITY NOTICE:
    If you did not request this verification code, please ignore this email. Do not share this code with anyone. UniVerse Synapse staff will never ask for your OTP.
    
    REGISTRATION DETAILS:
    University: ${universityName}
    Admin Email: ${email}
    Verification Code: ${otp}
    Sent: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    
    NEED HELP?
    Contact our support team at support@synapse.in
    
    © 2026 UniVerse Synapse. All rights reserved.
  `;

  return {
    subject: `[UniVerse Synapse] Email Verification Code for ${universityName}`,
    htmlContent,
    plainTextContent,
  };
}

/**
 * OTP Verification Success Email Template
 */
export function getOTPVerificationSuccessEmail(
  universityName: string,
  adminName: string,
  email: string
): EmailTemplate {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #16a34a 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
        .success-badge { text-align: center; margin-bottom: 30px; }
        .success-icon { font-size: 60px; margin-bottom: 10px; }
        .success-message { font-size: 20px; color: #16a34a; font-weight: 600; }
        .next-steps { background: #dcfce7; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #16a34a; }
        .next-steps h3 { margin-top: 0; color: #166534; }
        .next-steps li { margin: 8px 0; color: #166534; }
        .button { display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Email Verified Successfully</h1>
        </div>
        
        <div class="content">
          <div class="success-badge">
            <div class="success-icon">✅</div>
            <div class="success-message">Your email has been verified!</div>
          </div>

          <p>Dear <strong>${adminName}</strong>,</p>
          <p>Congratulations! Your email address <strong>${email}</strong> has been successfully verified for <strong>${universityName}</strong>.</p>

          <div class="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>Your account is now under review by our platform administrators</li>
              <li>You will receive an email within 2-3 business days with approval status</li>
              <li>Once approved, you'll receive your admin credentials and access link</li>
              <li>You can then create staff and student accounts for your university</li>
            </ul>
          </div>

          <p>If you have any questions during the verification process, please don't hesitate to contact our support team.</p>

          <div class="footer">
            <p>
              <strong>Need Help?</strong> Contact our support team at support@synapse.in
            </p>
            <p>
              © 2026 UniVerse Synapse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainTextContent = `
    EMAIL VERIFIED SUCCESSFULLY
    ===========================
    
    Dear ${adminName},
    
    Congratulations! Your email address ${email} has been successfully verified for ${universityName}.
    
    WHAT'S NEXT?
    - Your account is now under review by our platform administrators
    - You will receive an email within 2-3 business days with approval status
    - Once approved, you'll receive your admin credentials and access link
    - You can then create staff and student accounts for your university
    
    If you have any questions during the verification process, please don't hesitate to contact our support team.
    
    NEED HELP?
    Contact our support team at support@synapse.in
    
    © 2026 UniVerse Synapse. All rights reserved.
  `;

  return {
    subject: `[UniVerse Synapse] Email Verified - Account Under Review`,
    htmlContent,
    plainTextContent,
  };
}

/**
 * OTP Verification Failed Email Template
 */
export function getOTPVerificationFailedEmail(
  universityName: string,
  adminName: string,
  email: string,
  reason: string
): EmailTemplate {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
        .alert { background: #fee2e2; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .alert h3 { margin-top: 0; color: #991b1b; }
        .alert p { color: #7f1d1d; }
        .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Verification Failed</h1>
        </div>
        
        <div class="content">
          <p>Dear <strong>${adminName}</strong>,</p>
          <p>We encountered an issue with your email verification for <strong>${universityName}</strong>.</p>

          <div class="alert">
            <h3>Reason:</h3>
            <p>${reason}</p>
          </div>

          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Request a new verification code</li>
            <li>Ensure you're using the correct university email address</li>
            <li>Check your email spam folder for our messages</li>
            <li>Contact our support team for assistance</li>
          </ul>

          <div class="footer">
            <p>
              <strong>Need Help?</strong> Contact our support team at support@synapse.in
            </p>
            <p>
              © 2026 UniVerse Synapse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainTextContent = `
    VERIFICATION FAILED
    ===================
    
    Dear ${adminName},
    
    We encountered an issue with your email verification for ${universityName}.
    
    REASON: ${reason}
    
    WHAT YOU CAN DO:
    - Request a new verification code
    - Ensure you're using the correct university email address
    - Check your email spam folder for our messages
    - Contact our support team for assistance
    
    NEED HELP?
    Contact our support team at support@synapse.in
    
    © 2026 UniVerse Synapse. All rights reserved.
  `;

  return {
    subject: `[UniVerse Synapse] Email Verification Failed - Action Required`,
    htmlContent,
    plainTextContent,
  };
}

/**
 * Account Approved Email Template
 */
export function getAccountApprovedEmail(
  universityName: string,
  adminName: string,
  email: string,
  adminCredentials: string
): EmailTemplate {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
        .credentials-box { background: white; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 20px 0; font-family: 'Courier New', monospace; }
        .credentials-box p { margin: 10px 0; }
        .credentials-label { color: #64748b; font-size: 12px; }
        .credentials-value { color: #1e3a8a; font-weight: 600; font-size: 14px; }
        .button { display: inline-block; padding: 12px 30px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Account Approved</h1>
        </div>
        
        <div class="content">
          <p>Dear <strong>${adminName}</strong>,</p>
          <p>Great news! Your registration for <strong>${universityName}</strong> has been approved by our administrators. Your account is now active and ready to use.</p>

          <div class="credentials-box">
            <p><span class="credentials-label">Admin Email:</span><br><span class="credentials-value">${email}</span></p>
            <p><span class="credentials-label">Admin Credentials:</span><br><span class="credentials-value">${adminCredentials}</span></p>
          </div>

          <p><strong>You can now:</strong></p>
          <ul>
            <li>Log in to your admin dashboard</li>
            <li>Create and manage departments</li>
            <li>Add staff members and students</li>
            <li>Configure university settings</li>
            <li>Access comprehensive analytics and reports</li>
          </ul>

          <div class="footer">
            <p>
              <strong>Need Help?</strong> Contact our support team at support@synapse.in
            </p>
            <p>
              © 2026 UniVerse Synapse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainTextContent = `
    ACCOUNT APPROVED
    ================
    
    Dear ${adminName},
    
    Great news! Your registration for ${universityName} has been approved by our administrators. Your account is now active and ready to use.
    
    ADMIN CREDENTIALS:
    Email: ${email}
    Credentials: ${adminCredentials}
    
    YOU CAN NOW:
    - Log in to your admin dashboard
    - Create and manage departments
    - Add staff members and students
    - Configure university settings
    - Access comprehensive analytics and reports
    
    NEED HELP?
    Contact our support team at support@synapse.in
    
    © 2026 UniVerse Synapse. All rights reserved.
  `;

  return {
    subject: `[UniVerse Synapse] Account Approved - Welcome to ${universityName}!`,
    htmlContent,
    plainTextContent,
  };
}
