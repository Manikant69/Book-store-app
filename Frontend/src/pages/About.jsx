import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { BookOpen, Navigation2, Heart, Users, BookMarked, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const features = [
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Access thousands of books across multiple genres'
    },
    {
      icon: Navigation2,
      title: 'Easy Navigation',
      description: 'Find your next read with intuitive search and filters'
    },
    {
      icon: Heart,
      title: 'Personalized',
      description: 'Get recommendations based on your reading preferences'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow readers and share reviews'
    },
    {
      icon: BookMarked,
      title: 'Track Reading',
      description: 'Keep track of your reading progress and wishlist'
    },
    {
      icon: Coffee,
      title: 'Reading Goals',
      description: 'Set and achieve your reading goals'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Passionate about creating seamless reading experiences'
    },
    {
      name: 'Alex Rivera',
      role: 'UI/UX Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Crafting beautiful interfaces for book lovers'
    },
    {
      name: 'Emily Watson',
      role: 'Content Curator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      bio: 'Finding the best books for our readers'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-16">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000&q=80"
              alt="Library"
              className="w-full h-full object-cover brightness-50"
            />
          </div>
          <div className="relative py-24 px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About BookStore</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your one-stop solution for all your reading needs
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            BookStore is an innovative platform designed to bring readers closer to their favorite books. 
            Whether you're looking to browse, add, or explore new genres, our app provides a seamless 
            experience tailored to book enthusiasts worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 bg-teal-600 hover:bg-teal-700 
                     text-white rounded-lg transition-colors duration-200"
          >
            Explore Books Now
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
