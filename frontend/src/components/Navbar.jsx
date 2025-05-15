import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const location = useLocation();
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Business", path: "/business" },
    { name: "Entertainment", path: "/entertainment" },
    { name: "Health", path: "/health" },
    { name: "Science", path: "/science" },
    { name: "Sports", path: "/sports" },
    { name: "Technology", path: "/technology" },
  ];

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
    // Focus the input when it becomes visible
    if (!isSearchVisible) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality here
    navigate(`/${searchQuery}`);
    console.log("Searching for:", searchQuery);
    // Clear the input and hide search after submission
    setSearchQuery("");
    setIsSearchVisible(false);
  };

  // Close search when clicking outside
  const handleClickOutside = (e) => {
    if (isSearchVisible && searchInputRef.current && !searchInputRef.current.contains(e.target) && e.target.id !== "search-icon") {
      setIsSearchVisible(false);
    }
  };

  // Add event listener for clicking outside
  useState(() => {
    if (isSearchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchVisible]);

  return (
    <div className="w-full font-serif">
      {/* Top bar with date, search, and menu toggle */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <div className="text-gray-600 text-sm">{currentDate}</div>
        <div className="flex items-center space-x-4">
          <AnimatePresence>
            {isSearchVisible && (
              <motion.form
                onSubmit={handleSearchSubmit}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  opacity: { duration: 0.2 }
                }}
                className="relative"
              >
                <motion.input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-1 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </motion.form>
            )}
          </AnimatePresence>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search
              id="search-icon"
              onClick={handleSearchIconClick}
              size={20}
              className={`cursor-pointer ${isSearchVisible ? "text-blue-600" : "text-gray-600"}`}
            />
          </motion.div>
          
          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Toggle Menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} className={`${isMenuOpen ? "text-blue-600" : "text-gray-600"}`} />
          </motion.button>
        </div>
      </div>

      {/* Newspaper title */}
      <div className="flex justify-center py-6 text-center">
        <Link
          to="/home"
          className="text-4xl md:text-5xl font-bold tracking-tighter"
        >
          <span className="font-[NewYorkTimes] text-5xl md:text-6xl">The </span>
          <span 
            className="font-black uppercase"
          >
            CHRONICLE
          </span>
          <span className="text-2xl md:text-3xl align-top">*</span>
        </Link>
      </div>

      {/* Navigation menu */}
      <div className="border-t border-b border-gray-200">
        {/* Desktop menu */}
        <nav className="hidden md:flex justify-center space-x-6 px-4 py-3">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`transition-colors relative ${
                location.pathname === item.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="navbar-underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              className="flex flex-col md:hidden px-4 py-3 space-y-2 bg-white shadow"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`transition-colors block py-2 ${
                      location.pathname === item.path
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800 hover:text-blue-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Navbar;