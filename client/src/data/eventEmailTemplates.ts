/**
 * Event Email Notification Templates
 * Formal email templates for big events and hackathons
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  plainTextContent: string;
}

export class EventEmailTemplates {
  /**
   * Big Event Announcement Email
   */
  static bigEventAnnouncement(
    eventTitle: string,
    eventType: string,
    startDate: string,
    location: string,
    description: string,
    registrationDeadline: string,
    contactEmail: string,
    contactPhone: string,
    organizingUniversity: string,
    eventWebsite?: string
  ): EmailTemplate {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; border-left: 4px solid #0369a1; }
        .event-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; color: #1e3a8a; width: 120px; }
        .detail-value { color: #555; }
        .cta-button { display: inline-block; background: #0369a1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; }
        .important { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Major Event Announcement</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">UniVerse Synapse</p>
        </div>

        <div class="content">
            <p>Dear University Administrator,</p>

            <p>We are delighted to inform you about an exciting ${eventType.toLowerCase()} that is being organized across India. This is a wonderful opportunity for your students and faculty to participate and showcase their talents.</p>

            <div class="event-details">
                <h3 style="margin-top: 0; color: #1e3a8a;">Event Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Event Name:</span>
                    <span class="detail-value"><strong>${eventTitle}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event Type:</span>
                    <span class="detail-value">${eventType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Registration Deadline:</span>
                    <span class="detail-value"><strong>${registrationDeadline}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Organizing University:</span>
                    <span class="detail-value">${organizingUniversity}</span>
                </div>
            </div>

            <h3 style="color: #1e3a8a;">About the Event</h3>
            <p>${description}</p>

            <div class="important">
                <strong>⏰ Important:</strong> The registration deadline is <strong>${registrationDeadline}</strong>. Please ensure your students register before this date to secure their participation.
            </div>

            <h3 style="color: #1e3a8a;">How to Register</h3>
            <p>Students and faculty can register for this event through the UniVerse Synapse platform. Please visit the event page for more details and registration instructions.</p>

            ${eventWebsite ? `
            <p>For more information, visit: <a href="${eventWebsite}" style="color: #0369a1; text-decoration: none;">${eventWebsite}</a></p>
            ` : ''}

            <h3 style="color: #1e3a8a;">Contact Information</h3>
            <p>
                <strong>Email:</strong> <a href="mailto:${contactEmail}" style="color: #0369a1; text-decoration: none;">${contactEmail}</a><br>
                <strong>Phone:</strong> ${contactPhone}
            </p>

            <p style="margin-top: 30px; color: #666;">We encourage your institution to actively participate and promote this event among your students and faculty. This is an excellent opportunity for networking, learning, and showcasing talent on a national platform.</p>

            <p style="margin-top: 20px;">Best regards,<br>
            <strong>UniVerse Synapse Team</strong><br>
            <em>Empowering Universities with Modern Management Solutions</em></p>
        </div>

        <div class="footer">
            <p>This is an official communication from UniVerse Synapse. Please do not reply to this email.</p>
            <p>© 2026 UniVerse Synapse. All rights reserved.</p>
            <p>For support, contact: support@synapse.in | Phone: +91 1234567890</p>
        </div>
    </div>
</body>
</html>
    `;

    const plainTextContent = `
MAJOR EVENT ANNOUNCEMENT
UniVerse Synapse

Dear University Administrator,

We are delighted to inform you about an exciting ${eventType.toLowerCase()} that is being organized across India. This is a wonderful opportunity for your students and faculty to participate and showcase their talents.

EVENT DETAILS
=============
Event Name: ${eventTitle}
Event Type: ${eventType}
Date: ${startDate}
Location: ${location}
Registration Deadline: ${registrationDeadline}
Organizing University: ${organizingUniversity}

ABOUT THE EVENT
===============
${description}

IMPORTANT: The registration deadline is ${registrationDeadline}. Please ensure your students register before this date to secure their participation.

HOW TO REGISTER
===============
Students and faculty can register for this event through the UniVerse Synapse platform. Please visit the event page for more details and registration instructions.

${eventWebsite ? `For more information, visit: ${eventWebsite}` : ''}

CONTACT INFORMATION
===================
Email: ${contactEmail}
Phone: ${contactPhone}

We encourage your institution to actively participate and promote this event among your students and faculty. This is an excellent opportunity for networking, learning, and showcasing talent on a national platform.

Best regards,
UniVerse Synapse Team
Empowering Universities with Modern Management Solutions

---
This is an official communication from UniVerse Synapse. Please do not reply to this email.
© 2026 UniVerse Synapse. All rights reserved.
For support, contact: support@synapse.in | Phone: +91 1234567890
    `;

    return {
      subject: `🎉 Exciting ${eventType} Opportunity: ${eventTitle}`,
      htmlContent,
      plainTextContent,
    };
  }

  /**
   * Hackathon Announcement Email
   */
  static hackathonAnnouncement(
    eventTitle: string,
    startDate: string,
    location: string,
    description: string,
    registrationDeadline: string,
    contactEmail: string,
    contactPhone: string,
    organizingUniversity: string,
    prizes?: string,
    eventWebsite?: string
  ): EmailTemplate {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; border-left: 4px solid #7c3aed; }
        .event-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; color: #7c3aed; width: 120px; }
        .detail-value { color: #555; }
        .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e7eb; }
        .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
        .prize-box { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💻 HACKATHON ALERT!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">UniVerse Synapse</p>
        </div>

        <div class="content">
            <p>Dear University Administrator,</p>

            <p>We are thrilled to announce an exciting national-level hackathon! This is a fantastic opportunity for your students to showcase their coding skills, innovation, and creativity on a national platform.</p>

            <div class="event-details">
                <h3 style="margin-top: 0; color: #7c3aed;">Hackathon Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Hackathon Name:</span>
                    <span class="detail-value"><strong>${eventTitle}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Registration Deadline:</span>
                    <span class="detail-value"><strong>${registrationDeadline}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Organizing University:</span>
                    <span class="detail-value">${organizingUniversity}</span>
                </div>
            </div>

            ${prizes ? `
            <div class="prize-box">
                <h3 style="margin-top: 0;">🏆 Exciting Prizes</h3>
                <p>${prizes}</p>
            </div>
            ` : ''}

            <h3 style="color: #7c3aed;">About the Hackathon</h3>
            <p>${description}</p>

            <div class="highlight">
                <strong>⏰ Important:</strong> Registration closes on <strong>${registrationDeadline}</strong>. Teams must register before this deadline to participate.
            </div>

            <h3 style="color: #7c3aed;">Why Participate?</h3>
            <ul style="color: #555;">
                <li>Showcase your coding and problem-solving skills</li>
                <li>Network with talented developers from across India</li>
                <li>Win exciting prizes and recognition</li>
                <li>Get mentorship from industry experts</li>
                <li>Build innovative solutions to real-world problems</li>
            </ul>

            <h3 style="color: #7c3aed;">How to Register</h3>
            <p>Students can register for this hackathon through the UniVerse Synapse platform. Teams can be formed with 2-4 members from the same or different universities.</p>

            ${eventWebsite ? `
            <p>For more information and to register, visit: <a href="${eventWebsite}" style="color: #7c3aed; text-decoration: none;">${eventWebsite}</a></p>
            ` : ''}

            <h3 style="color: #7c3aed;">Contact Information</h3>
            <p>
                <strong>Email:</strong> <a href="mailto:${contactEmail}" style="color: #7c3aed; text-decoration: none;">${contactEmail}</a><br>
                <strong>Phone:</strong> ${contactPhone}
            </p>

            <p style="margin-top: 30px; color: #666;">We encourage your institution to actively promote this hackathon among your students. This is an excellent opportunity for your students to gain real-world experience and compete at the national level!</p>

            <p style="margin-top: 20px;">Best regards,<br>
            <strong>UniVerse Synapse Team</strong><br>
            <em>Empowering Universities with Modern Management Solutions</em></p>
        </div>

        <div class="footer">
            <p>This is an official communication from UniVerse Synapse. Please do not reply to this email.</p>
            <p>© 2026 UniVerse Synapse. All rights reserved.</p>
            <p>For support, contact: support@synapse.in | Phone: +91 1234567890</p>
        </div>
    </div>
</body>
</html>
    `;

    const plainTextContent = `
HACKATHON ALERT!
UniVerse Synapse

Dear University Administrator,

We are thrilled to announce an exciting national-level hackathon! This is a fantastic opportunity for your students to showcase their coding skills, innovation, and creativity on a national platform.

HACKATHON DETAILS
=================
Hackathon Name: ${eventTitle}
Date: ${startDate}
Location: ${location}
Registration Deadline: ${registrationDeadline}
Organizing University: ${organizingUniversity}

${prizes ? `EXCITING PRIZES\n===============\n${prizes}\n` : ''}

ABOUT THE HACKATHON
===================
${description}

IMPORTANT: Registration closes on ${registrationDeadline}. Teams must register before this deadline to participate.

WHY PARTICIPATE?
================
- Showcase your coding and problem-solving skills
- Network with talented developers from across India
- Win exciting prizes and recognition
- Get mentorship from industry experts
- Build innovative solutions to real-world problems

HOW TO REGISTER
===============
Students can register for this hackathon through the UniVerse Synapse platform. Teams can be formed with 2-4 members from the same or different universities.

${eventWebsite ? `For more information and to register, visit: ${eventWebsite}` : ''}

CONTACT INFORMATION
===================
Email: ${contactEmail}
Phone: ${contactPhone}

We encourage your institution to actively promote this hackathon among your students. This is an excellent opportunity for your students to gain real-world experience and compete at the national level!

Best regards,
UniVerse Synapse Team
Empowering Universities with Modern Management Solutions

---
This is an official communication from UniVerse Synapse. Please do not reply to this email.
© 2026 UniVerse Synapse. All rights reserved.
For support, contact: support@synapse.in | Phone: +91 1234567890
    `;

    return {
      subject: `💻 HACKATHON ALERT: ${eventTitle} - Register Now!`,
      htmlContent,
      plainTextContent,
    };
  }
}
