import { Navbar } from '../components/navbar/Navbar';
import { Banner } from '../components/home/Banner';
import { BookGrid } from '../components/books/BookGrid';
import { PopularGenres } from '../components/home/PopularGenres';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Footer } from '../components/layout/Footer';
import {useBook} from "../context/BookContext"


function Home() {

  const {books} = useBook();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Banner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookGrid title="Featured Books" books={books} />
          <PopularGenres />
          <WhyChooseUs />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;