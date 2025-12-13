import { SearchBar } from './SearchBar';

export function Banner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 transform -skew-y-6" />
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl opacity-90">
            Explore thousands of books from your favorite authors
          </p>
        </div>
        <SearchBar />
      </div>
    </section>
  );
}
