import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Newsletter } from '../home/Newsletter';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const QUICK_LINKS = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms', href: '/terms' }
];

const SOCIAL_ICON_MAP = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube
};

export function Footer() {
  const { settings } = useSiteSettings();

  // Create social links array from settings
  const socialLinks = settings?.socialLinks ? Object.entries(settings.socialLinks)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({
      icon: SOCIAL_ICON_MAP[platform],
      href: url,
      name: platform.charAt(0).toUpperCase() + platform.slice(1)
    })) : [];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Newsletter />
          </div>
          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    to={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.length > 0 ? socialLinks.map(({ icon: Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                  aria-label={`Follow us on ${name}`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Social links coming soon...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
