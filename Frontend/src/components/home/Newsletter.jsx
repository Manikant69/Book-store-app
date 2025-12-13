import { Send } from 'lucide-react';

export function Newsletter() {
  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-8">
      <h3 className="text-xl font-bold mb-4 dark:text-white">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get updates about new books and special offers
      </p>
      <form className="flex flex-col lg:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                   transition-colors duration-200 flex items-center gap-2"
        >
          Subscribe
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
