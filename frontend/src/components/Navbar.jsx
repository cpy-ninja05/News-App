import { Menu, Search } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate] = useState(
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  );

  const navItems = [
    'Home',
    'Business',
    'Entertainment',
    'General',
    'Health',
    'Science',
    'Sports',
    'Technology',
  ];

  return (
    <div className="w-full font-serif">
      {/* Top bar with date, search, and menu toggle */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <div className="text-gray-600 text-sm">{currentDate}</div>
        <div className="flex items-center space-x-4">
          <Search size={20} className="text-gray-600" />
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Toggle Menu"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Newspaper title */}
      <div className="flex justify-center py-6 text-center">
        <div className="text-4xl md:text-5xl font-bold tracking-tighter">
          <span className="font-[NewYorkTimes] text-5xl md:text-6xl">The </span>
          <span className="font-black uppercase">CHRONICLE</span>
          <span className="text-2xl md:text-3xl align-top">*</span>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="border-t border-b border-gray-200">
        {/* Desktop menu */}
        <nav className="hidden md:flex justify-center space-x-6 px-4 py-3">
          {navItems.map((item, index) => (
            <a key={index} href="#" className="text-gray-800 hover:text-gray-600">
              {item}
            </a>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="flex flex-col md:hidden px-4 py-3 space-y-2 bg-white shadow">
            {navItems.map((item, index) => (
              <a key={index} href="#" className="text-gray-800 hover:text-gray-600">
                {item}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;
