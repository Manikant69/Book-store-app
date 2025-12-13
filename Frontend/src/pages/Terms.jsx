import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Terms() {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing and using BookSpot, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Registration
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One person may not create multiple accounts</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Orders and Payments
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                <li>Payment is required at the time of order placement</li>
                <li>We reserve the right to refuse any order</li>
                <li>Order confirmation does not guarantee product availability</li>
                <li>We may cancel orders due to pricing errors or product unavailability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Shipping and Delivery
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Shipping costs and delivery timeframes are specified at checkout</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss transfers to you upon delivery to the shipping address</li>
                <li>You must inspect orders upon delivery and report any issues promptly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Returns and Refunds
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Books must be in original condition to be eligible for return</li>
                <li>Return shipping costs may be charged to the customer</li>
                <li>Refunds will be processed within 7-10 business days after return approval</li>
                <li>Certain items may not be eligible for return due to hygiene or safety reasons</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Prohibited Uses
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Intellectual Property Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                The service and its original content, features, and functionality are and will remain the exclusive property of BookSpot and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall BookSpot, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="text-gray-700 dark:text-gray-300">
                <p>Email: {settings?.email || 'legal@bookspot.com'}</p>
                <p>Phone: {settings?.phone || '+91-9876543210'}</p>
                <p>Address: {settings?.address || '123 Book Street, Library City, India - 110001'}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}