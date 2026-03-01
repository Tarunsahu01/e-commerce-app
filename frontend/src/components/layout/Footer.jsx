/**
 * Footer component for the website
 */
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-white hover:text-gray-200">
            E-Shop
          </Link>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
