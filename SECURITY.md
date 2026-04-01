# UniVerse Synapse - Security Documentation

## Overview

UniVerse Synapse is a multi-tenant university management platform designed with security as a core principle. This document outlines the security measures, best practices, and compliance guidelines implemented in the application.

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Data Protection](#data-protection)
3. [Authentication & Authorization](#authentication--authorization)
4. [Input Validation & Sanitization](#input-validation--sanitization)
5. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
6. [Session Management](#session-management)
7. [Audit Logging](#audit-logging)
8. [Compliance](#compliance)
9. [Security Best Practices](#security-best-practices)
10. [Incident Response](#incident-response)

---

## Security Architecture

### Multi-Tenant Isolation

UniVerse Synapse implements strict data isolation between universities:

- **Database-Level Isolation**: Each university's data is logically separated with university_id as a foreign key
- **Application-Level Isolation**: Row-level security ensures users can only access their university's data
- **API-Level Isolation**: All API endpoints verify user's university affiliation before returning data

### Defense in Depth

The application implements multiple layers of security:

```
┌─────────────────────────────────────────┐
│    Client-Side Security (Frontend)      │
│  - Input Validation & Sanitization      │
│  - CSRF Protection                      │
│  - XSS Prevention                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Network Security                     │
│  - HTTPS/TLS Encryption                 │
│  - Security Headers                     │
│  - Rate Limiting                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Application Security                 │
│  - Authentication & Authorization       │
│  - Session Management                   │
│  - Audit Logging                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Data Security                        │
│  - Encryption at Rest                   │
│  - Encryption in Transit                │
│  - Data Masking                         │
└─────────────────────────────────────────┘
```

---

## Data Protection

### Encryption

#### Data at Rest
- Sensitive fields (passwords, OTP codes, personal information) are encrypted using AES-256
- Encryption keys are stored securely and rotated regularly
- Database backups are encrypted

#### Data in Transit
- All communications use HTTPS/TLS 1.2 or higher
- Certificate pinning is implemented for critical API endpoints
- Perfect Forward Secrecy (PFS) is enabled

### Data Classification

| Classification | Examples | Protection |
|---|---|---|
| **Public** | University name, event information | No encryption required |
| **Internal** | Department information, course details | Standard encryption |
| **Confidential** | Student records, staff information | Strong encryption + access control |
| **Restricted** | Passwords, OTP codes, financial data | Maximum encryption + audit logging |

### Data Retention

- User data is retained for the duration of their account
- Deleted accounts: data anonymized after 90 days
- Audit logs: retained for 2 years
- Backup data: retained for 30 days

---

## Authentication & Authorization

### Two-Step Email Verification

All university registrations require:

1. **Step 1: Email Domain Verification**
   - Verify email belongs to official university domain
   - Validate against NIRF-ranked universities database
   - Send verification email with OTP

2. **Step 2: OTP Verification**
   - 6-digit OTP sent to university email
   - OTP valid for 15 minutes
   - Maximum 5 attempts per OTP
   - Rate limited to prevent brute force

### Password Security

- Minimum 12 characters
- Must contain uppercase, lowercase, numbers, and special characters
- Passwords hashed using bcrypt with salt rounds = 12
- Password history: last 5 passwords cannot be reused
- Password expiration: 90 days

### Session Management

- Session timeout: 30 minutes of inactivity
- Secure session tokens: 256-bit random tokens
- Session tokens stored in secure, HTTP-only cookies
- Cross-site request forgery (CSRF) tokens for state-changing operations

### Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **Owner** | Platform administration, university management, analytics |
| **Admin** | University management, department creation, user management |
| **Department Head** | Department operations, staff management, course management |
| **Staff** | Class management, assignment creation, grade management |
| **Student** | Course enrollment, assignment submission, grade viewing |

---

## Input Validation & Sanitization

### Client-Side Validation

- All user inputs validated before submission
- HTML sanitization to prevent XSS attacks
- File type and size validation for uploads
- Email format and domain validation

### Server-Side Validation (Recommended for Backend)

- All inputs re-validated on server
- Parameterized queries to prevent SQL injection
- Content-Type validation
- Request size limits

### Sanitization Rules

```typescript
// Email validation
- Format: RFC 5322 compliant
- Maximum length: 254 characters
- Domain validation against university list

// Phone validation
- Format: International format with +91 prefix
- Length: 10-15 digits
- No special characters except + and -

// Text fields
- Maximum length enforced
- HTML tags removed
- Special characters escaped
- Whitespace trimmed
```

---

## Rate Limiting & DDoS Protection

### Rate Limiting Thresholds

| Action | Limit | Window |
|---|---|---|
| Login attempts | 5 | 15 minutes |
| OTP verification | 5 | 15 minutes |
| Password reset | 3 | 1 hour |
| API calls | 100 | 1 minute |
| File uploads | 10 | 1 hour |

### DDoS Protection Measures

- IP-based rate limiting
- Request pattern analysis
- Automatic blocking of suspicious traffic
- WAF (Web Application Firewall) integration
- CDN-based DDoS mitigation

---

## Session Management

### Session Security Features

- **Secure Tokens**: 256-bit cryptographically secure random tokens
- **HTTP-Only Cookies**: Session tokens cannot be accessed via JavaScript
- **Secure Flag**: Cookies transmitted only over HTTPS
- **SameSite**: Cookies not sent with cross-site requests (Strict mode)
- **Session Binding**: Sessions tied to IP address and user agent
- **Timeout**: Automatic logout after 30 minutes of inactivity
- **Logout**: Complete session destruction on logout

### Session Fixation Prevention

- New session token generated on login
- Old session tokens invalidated
- Session token rotation on privilege escalation

---

## Audit Logging

### Logged Events

All security-relevant events are logged with:

- **Timestamp**: ISO 8601 format with timezone
- **User ID**: Anonymized user identifier
- **Action**: Specific action performed
- **Result**: Success/failure status
- **Details**: Relevant context information
- **Severity**: Low, Medium, High, Critical
- **IP Address**: User's IP address
- **User Agent**: Browser/client information

### Logged Actions

- Authentication attempts (success/failure)
- Authorization failures
- Data access (read/write/delete)
- Configuration changes
- User management operations
- System alerts and errors
- API calls to sensitive endpoints

### Log Retention

- Production logs: 2 years
- Development logs: 30 days
- Audit logs: 7 years (for compliance)
- Logs encrypted and stored securely

---

## Compliance

### Standards & Frameworks

- **OWASP Top 10**: Implemented protections against all top 10 vulnerabilities
- **NIST Cybersecurity Framework**: Follows identify, protect, detect, respond, recover
- **ISO/IEC 27001**: Information security management system principles
- **GDPR**: Data protection and privacy regulations (where applicable)
- **India Data Protection**: Compliance with Indian data protection laws

### Privacy

- **Data Minimization**: Collect only necessary data
- **Purpose Limitation**: Data used only for stated purposes
- **Consent Management**: Explicit consent for data collection
- **Right to Access**: Users can request their data
- **Right to Deletion**: Users can request data deletion
- **Data Portability**: Users can export their data

### Vulnerability Management

- Regular security audits and penetration testing
- Automated vulnerability scanning
- Security patch management
- Responsible disclosure policy
- Bug bounty program (future)

---

## Security Best Practices

### For Developers

1. **Code Review**: All code changes reviewed for security issues
2. **Secure Coding**: Follow OWASP secure coding guidelines
3. **Dependency Management**: Keep dependencies updated, scan for vulnerabilities
4. **Secrets Management**: Never commit secrets; use environment variables
5. **Error Handling**: Don't expose sensitive information in error messages
6. **Logging**: Log security events; don't log sensitive data

### For Administrators

1. **Access Control**: Implement principle of least privilege
2. **Monitoring**: Monitor system logs and alerts
3. **Backups**: Regular encrypted backups with tested recovery procedures
4. **Updates**: Keep system and dependencies updated
5. **Training**: Security awareness training for all users
6. **Incident Response**: Have documented incident response procedures

### For Users

1. **Strong Passwords**: Use unique, strong passwords
2. **Phishing Awareness**: Be cautious of suspicious emails
3. **Two-Factor Authentication**: Enable when available
4. **Device Security**: Keep devices updated and protected
5. **Data Sharing**: Don't share sensitive information
6. **Reporting**: Report security issues immediately

---

## Incident Response

### Incident Classification

| Severity | Impact | Response Time |
|---|---|---|
| **Critical** | Data breach, system down | Immediate (< 1 hour) |
| **High** | Unauthorized access, data loss | 4 hours |
| **Medium** | Potential vulnerability, performance issue | 24 hours |
| **Low** | Minor issues, informational | 7 days |

### Incident Response Steps

1. **Detection**: Identify the security incident
2. **Containment**: Isolate affected systems
3. **Investigation**: Determine scope and impact
4. **Remediation**: Fix the vulnerability
5. **Recovery**: Restore normal operations
6. **Post-Incident**: Review and improve processes

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do Not**: Publicly disclose the vulnerability
2. **Do**: Report to security@synapse.in
3. **Include**: Detailed description, steps to reproduce, potential impact
4. **Wait**: For acknowledgment and resolution timeline

---

## Security Checklist

- [ ] All passwords meet complexity requirements
- [ ] Two-factor authentication enabled for admin accounts
- [ ] SSL/TLS certificates valid and up-to-date
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] Backups encrypted and tested
- [ ] Dependencies updated and scanned
- [ ] No secrets in code repository
- [ ] Security training completed
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled

---

## Contact & Support

For security concerns or questions:

- **Email**: security@synapse.in
- **Phone**: +91 1234567890
- **Security Portal**: https://security.synapse.in

---

**Last Updated**: March 2026
**Version**: 1.0
**Maintained By**: UniVerse Synapse Security Team
