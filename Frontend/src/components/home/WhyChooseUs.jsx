import React from 'react';
import { BookOpen, Truck, Headphones, ThumbsUp } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Vast Collection',
    description: 'Access to millions of books across all genres'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your books delivered within 24-48 hours'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer service support'
  },
  {
    icon: ThumbsUp,
    title: 'Best Prices',
    description: 'Competitive prices and regular discounts'
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12 dark:text-white">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-full mb-4">
                <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}