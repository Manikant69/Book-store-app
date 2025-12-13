import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';

const FAQ_DATA = [
  {
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking on the "Sign Up" button in the top right corner of the website. Fill in your details and follow the verification process.'
  },
  {
    question: 'How can I purchase books?',
    answer: 'Browse our collection, add books to your cart, and proceed to checkout. We accept various payment methods including credit cards, debit cards, and digital wallets.'
  },
  {
    question: 'Do you offer book returns?',
    answer: 'Yes, we offer returns within 30 days of purchase if the book is in original condition. Please contact our customer support for return assistance.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days at an additional cost.'
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, once your order is shipped, you will receive a tracking number via email to monitor your delivery status.'
  },
  {
    question: 'Do you have digital books (eBooks)?',
    answer: 'Currently, we focus on physical books only. However, we are planning to introduce digital books in the near future.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach our customer support team through the Contact page, email us at support@bookspot.com, or call our helpline during business hours.'
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'Yes, we offer special discounts for bulk orders of 20 or more books. Please contact us for a custom quote.'
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Orders can be cancelled within 2 hours of placement if they have not been processed for shipping. Please contact support immediately.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within India. International shipping will be available soon. Stay tuned for updates!'
  }
];

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpansion = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about BookSpot
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleExpansion(index)}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                {expandedItems.has(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              
              {expandedItems.has(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}