'use client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Header */}
      <div className="bg-[#111] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-[#c23d6a] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c23d6a]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Refund Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: June 1, 2025 &nbsp;·&nbsp; Effective immediately</p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="bg-[#fafafa] border-b border-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Quick Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              icon={<CheckCircle size={22} className="text-green-500" />}
              title="Eligible for Refund"
              desc="Damaged, defective, or wrong item delivered"
              bg="bg-green-50 border-green-100"
            />
            <SummaryCard
              icon={<Clock size={22} className="text-amber-500" />}
              title="Raise Request Within"
              desc="48 hours of delivery for damaged/wrong items"
              bg="bg-amber-50 border-amber-100"
            />
            <SummaryCard
              icon={<XCircle size={22} className="text-red-400" />}
              title="Not Eligible"
              desc="Opened products, change of mind, or taste preference"
              bg="bg-red-50 border-red-100"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-[15px] leading-relaxed">

          <p className="text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-2xl p-5">
            At GymHack, we are committed to delivering quality products. If something goes wrong, we are here to make it right. Please read this policy carefully to understand your rights and the process for raising a return or refund request.
          </p>

          <Section title="1. Return Eligibility">
            <p>We accept returns only under the following conditions:</p>
            <ul>
              <li><strong>Damaged Product:</strong> The product was damaged during transit or delivery.</li>
              <li><strong>Defective Product:</strong> The product is expired, tampered with, or has a manufacturing defect.</li>
              <li><strong>Wrong Item Delivered:</strong> You received a product different from what you ordered.</li>
              <li><strong>Missing Item:</strong> An item is missing from your order.</li>
            </ul>
            <p>Returns must be requested within <strong>48 hours</strong> of delivery. Requests raised after this window may not be accepted.</p>
          </Section>

          <Section title="2. Non-Returnable Items">
            <p>The following situations are <strong>not eligible</strong> for return or refund:</p>
            <ul>
              <li>Products that have been opened, used, or consumed.</li>
              <li>Returns due to change of mind or personal taste preference.</li>
              <li>Products with tampered or missing original packaging at the time of return.</li>
              <li>Products damaged due to customer mishandling or improper storage after delivery.</li>
              <li>Orders where the delivery address was incorrect due to customer error.</li>
              <li>Products purchased during special sales or promotional events (unless defective).</li>
            </ul>
          </Section>

          <Section title="3. How to Raise a Return / Refund Request">
            <p>To initiate a return or refund request, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Email us at <strong>support@gymhack.in</strong> within 48 hours of delivery.</li>
              <li>Use the subject line: <em>"Return Request — Order #[Your Order ID]"</em>.</li>
              <li>Include the following in your email:
                <ul className="mt-2 ml-5">
                  <li>Your full name and registered phone number.</li>
                  <li>Order ID and date of purchase.</li>
                  <li>Clear photographs or a short video showing the damage, defect, or wrong item.</li>
                  <li>A brief description of the issue.</li>
                </ul>
              </li>
              <li>Our support team will review your request within <strong>2 business days</strong> and respond with next steps.</li>
            </ol>
          </Section>

          <Section title="4. Refund Process">
            <p>
              Once your return request is approved, refunds will be processed as follows:
            </p>
            <ul>
              <li><strong>Refund Method:</strong> Refunds are issued to the original payment method used at the time of purchase (UPI, credit/debit card, net banking, or wallet).</li>
              <li><strong>Processing Time:</strong> Refunds are initiated within <strong>5–7 business days</strong> of approval. Depending on your bank or payment provider, it may take an additional 3–5 business days for the amount to reflect in your account.</li>
              <li><strong>Failed Payment Refunds:</strong> If your payment was deducted but the order was not placed successfully, the amount will be automatically refunded within <strong>5–7 business days</strong> by Razorpay.</li>
              <li><strong>Partial Refunds:</strong> In cases where only part of an order is affected, a partial refund will be issued for the relevant item(s) only.</li>
            </ul>
          </Section>

          <Section title="5. Replacement Option">
            <p>
              In eligible cases (damaged, defective, or wrong item), you may choose a <strong>replacement</strong> instead of a refund. Replacements are subject to product availability. If the product is out of stock, a full refund will be issued instead.
            </p>
          </Section>

          <Section title="6. Order Cancellations">
            <ul>
              <li>You may cancel an order within <strong>12 hours</strong> of placing it, provided it has not yet been dispatched.</li>
              <li>To cancel, contact us immediately at <strong>support@gymhack.in</strong> with your order ID.</li>
              <li>If the order has already been dispatched, cancellation is not possible. You may return the product after delivery as per this policy.</li>
              <li>Refunds for cancelled orders are processed within 5–7 business days to the original payment method.</li>
            </ul>
          </Section>

          <Section title="7. Bulk Orders">
            <p>
              Refund and return policies for bulk orders (ordered via our Bulk Enquiry form or direct contact) may differ. Please discuss return terms with our team before placing bulk orders. Bulk orders are generally non-returnable unless the product is defective or wrong.
            </p>
          </Section>

          <Section title="8. Dispute Resolution">
            <p>
              If you are unsatisfied with our resolution, you may raise a dispute through Razorpay's resolution process or contact the National Consumer Helpline at <strong>1800-11-4000</strong>. We are committed to resolving all disputes fairly and in good faith.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>For return requests, refund status, or any queries related to this policy, please contact us:</p>
            <ContactBox />
            <p className="mt-4 text-sm text-gray-500">
              Our support team is available Monday–Saturday, 10:00 AM – 6:00 PM IST.
            </p>
          </Section>

        </div>
      </div>

      <PolicyFooter />
    </main>
  );
}

function SummaryCard({ icon, title, desc, bg }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border ${bg}`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-black text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-500 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-black text-black mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
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
          <Link href="/terms-conditions" className="hover:text-[#c23d6a] transition-colors font-semibold">Terms</Link>
          <Link href="/privacy-policy" className="hover:text-[#c23d6a] transition-colors font-semibold">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-[#c23d6a] transition-colors font-semibold">Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}