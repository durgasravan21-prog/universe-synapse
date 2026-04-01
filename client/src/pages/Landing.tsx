import React from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Users, BookOpen, Shield, Zap, Globe, Award, CheckCircle2, Mail, Clock } from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">US</span>
            </div>
            <span className="text-xl font-bold text-slate-900">UniVerse Synapse</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/signin')}
              className="px-6 py-2 text-slate-700 font-medium hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setLocation('/signup')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Register Your University →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663459591826/Gafhgtb9WVozFCjSXjkmP8/hero-main-Cz2zL4AQp7N9H5h38bqDR2.webp"
            alt="University Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Empower Your University with <span className="text-teal-300">Synapse</span>
            </h1>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
              A modern, secure multi-tenant platform designed for universities to manage students, staff, and academic operations with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setLocation('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Image */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Powerful Features for Modern Universities
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="grid grid-cols-1 gap-6">
                {/* Feature 1 */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">User Management</h3>
                      <p className="text-slate-600 text-sm">
                        Easily manage students, staff, and administrators with role-based access control and secure credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="text-teal-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Course Management</h3>
                      <p className="text-slate-600 text-sm">
                        Create, organize, and track courses with assignments, grades, and real-time student progress monitoring.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise Security</h3>
                      <p className="text-slate-600 text-sm">
                        Multi-tenant architecture with end-to-end encryption, role-based access, and comprehensive audit logs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663459591826/Gafhgtb9WVozFCjSXjkmP8/features-section-bg-cGvLzCWqZNohKVxQpbYe9B.webp"
                alt="Modern University Classroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <Zap className="text-blue-600 mb-3" size={28} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Analytics</h3>
              <p className="text-slate-700 text-sm">
                Comprehensive dashboards with real-time insights into student performance, enrollment trends, and institutional metrics.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200">
              <Globe className="text-teal-600 mb-3" size={28} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Multi-Tenant Architecture</h3>
              <p className="text-slate-700 text-sm">
                Complete data isolation between institutions with independent configurations and customizable workflows.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <Award className="text-purple-600 mb-3" size={28} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance & Standards</h3>
              <p className="text-slate-700 text-sm">
                Built to meet educational standards, GDPR compliance, and institutional governance requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
            Secure Verification Process
          </h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
            We ensure only legitimate universities can register on our platform through a comprehensive two-step verification process with formal email communications.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663459591826/Gafhgtb9WVozFCjSXjkmP8/verification-process-bg-aasiC6CKyGTkxfVcu.webp"
                alt="Secure Email Verification"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Verification</h3>
                  <p className="text-slate-600">
                    Submit your official university email address. We send a formal verification email with a secure code. Complete verification within 24 hours.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Admin Review & Approval</h3>
                  <p className="text-slate-600">
                    Our administrators review your institution's credentials. Formal approval emails are sent within 2-3 business days with your official synapse.in credentials.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Activation</h3>
                  <p className="text-slate-600">
                    Upon approval, your admin account is activated with secure synapse.in credentials. You can immediately begin managing your institution.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Create Users</h3>
                  <p className="text-slate-600">
                    Start creating staff and student accounts with automatic @synapse.in email credentials and formal welcome letters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
            Comprehensive Admin Dashboard
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Manage your entire institution from a single, intuitive dashboard with real-time analytics and reporting.
          </p>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663459591826/Gafhgtb9WVozFCjSXjkmP8/admin-dashboard-preview-LX6L8LKDepS7ifz89TW9cb.webp"
              alt="Admin Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Trusted by Leading Universities
          </h2>
          <p className="text-center text-slate-300 mb-16 max-w-2xl mx-auto">
            University administrators and staff across India's top institutions rely on UniVerse Synapse for secure, efficient academic management.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Dr. Rajesh Kumar</h4>
                  <p className="text-sm text-slate-400">Registrar, IIT Madras</p>
                </div>
              </div>
              <p className="text-slate-300">
                "UniVerse Synapse has transformed how we manage student records and course administration. The security and ease of use are exceptional."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Prof. Meera Sharma</h4>
                  <p className="text-sm text-slate-400">Dean of Academics, Delhi University</p>
                </div>
              </div>
              <p className="text-slate-300">
                "The platform's intuitive interface makes it easy for our staff to manage courses and track student progress. Highly recommended!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Mr. Arjun Patel</h4>
                  <p className="text-sm text-slate-400">IT Director, BITS Pilani</p>
                </div>
              </div>
              <p className="text-slate-300">
                "The multi-tenant architecture and security features give us complete confidence in data protection. Excellent support team!"
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="p-8 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-white">Dr. Priya Gupta</h4>
                  <p className="text-sm text-slate-400">Vice Chancellor, Manipal University</p>
                </div>
              </div>
              <p className="text-slate-300">
                "The verification process is thorough and professional. We appreciate the formal communications and secure credential management."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features List */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Why Choose UniVerse Synapse?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Multi-tenant architecture with complete data isolation',
              'Formal email verification with 2-3 day approval process',
              'Automatic @synapse.in credential generation',
              'Role-based access control for students, staff, and admins',
              'Real-time analytics and comprehensive reporting',
              'Enterprise-grade security and compliance',
              'Support for all NIRF-ranked Indian universities',
              'Intuitive dashboard for easy management',
              'Automated user onboarding with formal letters',
              ' 24/7 technical support and documentation',
              'Scalable infrastructure for institutions of any size',
              'Regular updates and feature enhancements',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your University?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading Indian universities in modernizing academic management with UniVerse Synapse.
          </p>
          <button
            onClick={() => setLocation('/signup')}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 mx-auto group"
          >
            <span>Register Your University Today</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">US</span>
                </div>
                <span className="font-bold text-white">UniVerse Synapse</span>
              </div>
              <p className="text-sm">Modern university management platform for India's leading institutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@synapse.in" className="hover:text-white transition">support@synapse.in</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8">
            <p className="text-center text-sm">
              © 2026 UniVerse Synapse. All rights reserved. | <a href="#" className="hover:text-white transition">Privacy Policy</a> | <a href="#" className="hover:text-white transition">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
