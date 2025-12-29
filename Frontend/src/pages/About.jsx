import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { BookOpen, Navigation2, Heart, Users, BookMarked, Coffee, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEAM_API_END_POINT } from '../utils/constants';

function About() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${TEAM_API_END_POINT}/public`);
      const data = await response.json();
      
      if (data.success) {
        setTeam(data.teamMembers || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      // Fallback to static data if API fails
      setTeam([
        {
          name: 'Sarah Chen',
          tech: 'Lead Developer',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          bio: 'Passionate about creating seamless reading experiences'
        },
        {
          name: 'Alex Rivera',
          tech: 'UI/UX Designer',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          bio: 'Crafting beautiful interfaces for book lovers'
        },
        {
          name: 'Emily Watson',
          tech: 'Content Curator',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
          bio: 'Finding the best books for our readers'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={member._id || index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-teal-600 dark:text-teal-400 font-medium text-sm uppercase tracking-wider mb-3 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full inline-block">
                      {member.tech}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 min-h-[3rem]">
                      {member.bio}
                    </p>
                    {(member.linkedinLink || member.githubLink) && (
                      <div className="flex justify-center space-x-4 pt-2">
                        {member.linkedinLink && (
                          <a
                            href={member.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 hover:text-blue-700 rounded-full transition-all duration-200 transform hover:scale-110"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.githubLink && (
                          <a
                            href={member.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-full transition-all duration-200 transform hover:scale-110"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
