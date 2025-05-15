import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultImage from '../assets/Images/common.jpeg'; // Adjust path as needed
import Navbar from '../components/Navbar';

const SearchResults = () => {
  const { searchQuery } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=30&sortBy=relevancy&apiKey=${import.meta.env.VITE_API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'ok') {
          setNews(data.articles || []);
          setTotalResults(data.totalResults || 0);
        } else {
          console.error('Error in API response:', data);
          setNews([]);
          setTotalResults(0);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Render the skeleton loader while fetching results
  const renderSkeletonLoader = () => (
    <div className="space-y-8">
      {/* Search summary skeleton */}
      <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
      
      {/* Top result skeleton */}
      <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-8"></div>
      
      {/* Grid layout skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded-full w-32 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the search results content
  const renderSearchContent = () => {
    // If no search query
    if (!searchQuery) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700">Please enter a search term</h2>
          <p className="text-gray-500 mt-2">Use the search bar at the top to find articles.</p>
        </div>
      );
    }

    // If no results are available
    if (!news || news.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-blue-700">No results found for "{searchQuery}"</h2>
          <p className="text-gray-500 mt-2">Try different keywords or browse our categories.</p>
          <div className="mt-8 flex justify-center space-x-4">
            {['Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'].map((category) => (
              <motion.button
                key={category}
                className="px-6 py-2 rounded-full bg-white text-gray-700 hover:bg-blue-100 shadow-md font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/${category.toLowerCase()}`)}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    // Split the news into featured and regular articles
    const featuredArticle = news[0];
    const regularArticles = news.slice(1, 7);
    const relatedArticles = news.slice(7, 13);

    return (
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Summary */}
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Found {totalResults} results for "{searchQuery}"
          </h2>
        </div>
        
        {/* Hero section - Top result */}
        {featuredArticle && (
          <motion.div 
            className="relative rounded-xl overflow-hidden h-96 mb-12 group shadow-lg"
            variants={itemVariants}
            onClick={() => navigate('/article', { state: { article: featuredArticle } })}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img 
              src={featuredArticle.urlToImage || defaultImage} 
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/api/placeholder/1200/600';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                Top Result
              </span>
              <h2 className="text-4xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-200 mb-4 max-w-3xl">{featuredArticle.description}</p>
              <div className="flex items-center">
                <span className="text-gray-300 text-sm mr-4">
                  {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                </span>
                <a 
                  href={featuredArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-100 px-5 py-2 rounded-full font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read full story
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              variants={itemVariants}
              onClick={() => navigate('/article', { state: { article } })}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.urlToImage || defaultImage} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/240';
                  }}
                />
                {article.source?.name && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                    {article.source.name}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">{article.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More results section */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              More Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((article, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  onClick={() => navigate('/article', { state: { article } })}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={article.urlToImage || defaultImage} 
                    alt={article.title}
                    className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                      {article.title}
                    </h4>
                    <span className="text-blue-600 text-xs font-medium mt-1 block">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
            Search Results
          </h1>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-blue-600 to-transparent"></div>
        </motion.div>
        
        {loading ? renderSkeletonLoader() : renderSearchContent()}
      </div>
    </div>
  );
};

export default SearchResults;
