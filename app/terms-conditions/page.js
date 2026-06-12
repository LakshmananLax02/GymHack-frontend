'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '../Components/scroll/Reveal';

export default function TermsAndConditions() {
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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-gray-400 text-sm">Last updated: June 1, 2025 &nbsp;·&nbsp; Effective immediately</p>
        </Reveal>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-[15px] leading-relaxed">

          <Section title="1. Agreement to Terms">
            <p>
              By accessing or using the GymHack website (<strong>gymhack.in</strong>) and placing orders through our platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. These terms apply to all visitors, users, and customers.
            </p>
          </Section>

          <Section title="2. About GymHack">
            <p>
              GymHack is an e-commerce platform that sells health, nutrition, and fitness products including oats, muesli, protein supplements, and related goods. We are registered and operate under Indian law. Our payment processing is handled through Razorpay Payment Solutions Pvt. Ltd., a licensed payment aggregator regulated by the Reserve Bank of India (RBI).
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 18 years of age to use this website and place orders. By using GymHack, you represent that you are 18 years or older and are legally capable of entering into binding contracts under Indian law.
            </p>
          </Section>

          <Section title="4. Products and Pricing">
            <ul>
              <li>All product prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to change prices at any time without prior notice. However, orders already placed will be honoured at the price shown at checkout.</li>
              <li>Product images are for illustrative purposes only. Actual packaging may vary.</li>
              <li>We make every effort to display accurate product descriptions. In case of errors, we reserve the right to cancel orders and issue a full refund.</li>
            </ul>
          </Section>

          <Section title="5. Orders and Payment">
            <ul>
              <li>Orders are confirmed only after successful payment. You will receive an email or SMS confirmation upon successful order placement.</li>
              <li>We accept payment via UPI, credit/debit cards, net banking, and wallets through Razorpay.</li>
              <li>GymHack does not store your payment card or banking details. All payment data is handled securely by Razorpay in compliance with PCI-DSS standards.</li>
              <li>In the event of a failed payment where your account is debited, the amount will be refunded to the original payment method within 5–7 business days.</li>
            </ul>
          </Section>

          <Section title="6. Delivery and Shipping">
            <ul>
              <li>We deliver across India. Delivery timelines are estimates and may vary based on location, courier availability, or unforeseen circumstances.</li>
              <li>Free shipping is offered on orders above ₹500. Orders below this threshold may incur a shipping fee disclosed at checkout.</li>
              <li>Once an order is dispatched, a tracking number will be shared with you via email or SMS.</li>
              <li>GymHack is not responsible for delays caused by courier partners, natural disasters, or other events beyond our control.</li>
            </ul>
          </Section>

          <Section title="7. Cancellations">
            <ul>
              <li>Orders may be cancelled within 12 hours of placement, provided they have not been dispatched.</li>
              <li>To cancel, contact us at <strong>support@gymhack.in</strong> or call our support number with your order ID.</li>
              <li>Once an order has been dispatched, it cannot be cancelled. You may initiate a return after delivery as per our Refund Policy.</li>
            </ul>
          </Section>

          <Section title="8. Returns and Refunds">
            <p>
              Returns and refunds are governed by our <Link href="/refund-policy" className="text-[#c23d6a] font-semibold hover:underline">Refund Policy</Link>. Please read it carefully before placing an order.
            </p>
          </Section>

          <Section title="9. User Accounts">
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              <li>GymHack reserves the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </Section>

          <Section title="10. Intellectual Property">
            <p>
              All content on this website — including text, images, logos, product photographs, and design — is the exclusive property of GymHack and is protected under applicable Indian copyright and trademark laws. Reproduction, redistribution, or use of any content without express written permission is strictly prohibited.
            </p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, GymHack shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our total liability in any dispute shall not exceed the amount paid by you for the specific order in question.
            </p>
          </Section>

          <Section title="12. Governing Law and Dispute Resolution">
            <p>
              These Terms and Conditions are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in <strong>[Your City, e.g., Chennai, Tamil Nadu]</strong>. We encourage customers to first reach out to our support team to resolve disputes amicably.
            </p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>
              We reserve the right to update these terms at any time. Continued use of our platform after changes constitutes your acceptance of the updated terms. We will notify registered users of significant changes via email.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>For any questions regarding these Terms and Conditions, please reach out to us:</p>
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