'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '../Components/scroll/Reveal';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Header */}
      <div className="bg-[#111] text-white py-14 px-4">
        <Reveal variant="up" duration={0.8} amount={0} className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-[#c23d6a] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c23d6a]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: June 1, 2025 &nbsp;·&nbsp; Effective immediately</p>
        </Reveal>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-[15px] leading-relaxed">

          <p className="text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-2xl p-5">
            At GymHack, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services. By using GymHack, you consent to the practices described in this policy.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect the following categories of personal information:</p>
            <ul>
              <li><strong>Identity Information:</strong> Name, email address, phone number, and date of birth when you register or place an order.</li>
              <li><strong>Delivery Information:</strong> Shipping address, city, state, and pincode.</li>
              <li><strong>Payment Information:</strong> We do not store your card details. Payment data is processed securely by Razorpay. We only receive a transaction confirmation and order ID.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, device type, browser, and IP address collected automatically through cookies and analytics tools.</li>
              <li><strong>Communications:</strong> Messages, queries, or feedback you send us via email or contact forms.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your personal information to:</p>
            <ul>
              <li>Process and fulfil your orders and send order confirmations.</li>
              <li>Communicate shipping updates and delivery notifications.</li>
              <li>Respond to customer service queries and support requests.</li>
              <li>Send promotional offers, newsletters, and product updates (only if you have opted in).</li>
              <li>Analyse website usage to improve our platform, products, and user experience.</li>
              <li>Detect and prevent fraud, abuse, and security threats.</li>
              <li>Comply with applicable Indian laws and regulations.</li>
            </ul>
          </Section>

          <Section title="3. Legal Basis for Processing">
            <p>We process your data on the following legal grounds under applicable Indian data protection laws:</p>
            <ul>
              <li><strong>Contractual necessity:</strong> To fulfil orders you have placed.</li>
              <li><strong>Legitimate interests:</strong> To improve our services, detect fraud, and maintain security.</li>
              <li><strong>Consent:</strong> For marketing communications, which you may withdraw at any time.</li>
              <li><strong>Legal obligation:</strong> To comply with tax, financial, and regulatory requirements.</li>
            </ul>
          </Section>

          <Section title="4. Cookies and Tracking">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies help us remember your preferences, keep you logged in, and understand how you interact with our website.
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for core website functionality (login, cart).</li>
              <li><strong>Analytics Cookies:</strong> Used by tools like Google Analytics to track usage patterns.</li>
              <li><strong>Marketing Cookies:</strong> Used to show relevant ads on third-party platforms.</li>
            </ul>
            <p>You can manage or disable cookies through your browser settings. Disabling essential cookies may affect website functionality.</p>
          </Section>

          <Section title="5. Sharing Your Information">
            <p>We do not sell your personal data. We may share your information with:</p>
            <ul>
              <li><strong>Razorpay:</strong> Our payment gateway partner, to process transactions securely. Razorpay's privacy policy applies to payment data.</li>
              <li><strong>Courier Partners:</strong> To deliver your orders (name, address, phone number shared).</li>
              <li><strong>Analytics Providers:</strong> Such as Google Analytics, for website performance tracking.</li>
              <li><strong>Legal Authorities:</strong> When required by law, court order, or government regulation.</li>
            </ul>
            <p>All third parties we work with are bound by confidentiality obligations and are not permitted to use your data for their own purposes.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, including for legal, accounting, or reporting requirements. Order and transaction data is typically retained for a minimum of 7 years as required under Indian tax law. You may request deletion of your account data at any time, subject to legal retention obligations.
            </p>
          </Section>

          <Section title="7. Data Security">
            <p>
              We implement industry-standard security measures to protect your personal information, including SSL encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
            <p>
              Payment information is handled entirely by Razorpay, which is PCI-DSS compliant. We do not store any card or banking credentials on our servers.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated personal data.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time via the unsubscribe link or by contacting us.</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format.</li>
            </ul>
            <p>To exercise any of these rights, email us at <strong>support@gymhack.in</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              GymHack is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with their data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to read the privacy policies of any external sites you visit.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with a revised effective date. Continued use of GymHack after changes constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <ContactBox />
          </Section>

        </div>
      </div>

      <PolicyFooter />
    </main>
  );
}

function Section({ title, children }) {
  return (
    <Reveal variant="up" amount={0.15}>
      <h2 className="text-lg font-black text-black mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </Reveal>
  );
}

function ContactBox() {
  return (
    <div className="mt-4 bg-[#fafafa] border border-gray-100 rounded-2xl p-5 space-y-1 text-sm">
      <p><span className="font-bold text-black">Business Name:</span> GymHack</p>
      <p><span className="font-bold text-black">Email:</span> support@gymhack.in</p>
      <p><span className="font-bold text-black">Address:</span> [Your Registered Business Address], India</p>
      <p><span className="font-bold text-black">Phone:</span> +91 [Your Contact Number]</p>
    </div>
  );
}

function PolicyFooter() {
  return (
    <div className="border-t border-gray-100 bg-[#fafafa] py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-wrap gap-6 items-center justify-between text-sm text-gray-400">
        <span>© {new Date().getFullYear()} GymHack. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/terms" className="hover:text-[#c23d6a] transition-colors font-semibold">Terms</Link>
          <Link href="/privacy" className="hover:text-[#c23d6a] transition-colors font-semibold">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-[#c23d6a] transition-colors font-semibold">Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}