import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import sports from '../assets/Images/sports.jpg';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const Sports = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=30&apiKey=${import.meta.env.VITE_API_KEY}`
        );
        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Render the skeleton loader
  const renderSkeletonLoader = () => (
    <div className="space-y-8">
      {/* Main layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - large skeletons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-96">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right column - smaller skeletons */}
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="flex">
                <div className="h-24 w-24 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render the news content
  const renderNewsContent = () => {
    // If no news is available
    if (!news || news.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No sports news available at the moment.</h2>
          <p className="text-gray-500 mt-2">Please check back later for updates.</p>
        </div>
      );
    }

    // Split the news into main featured article, secondary featured articles, and sidebar articles
    const mainArticle = news[0];
    const secondaryArticles = news.slice(1, 5);
    const sidebarArticles = news.slice(5, 15);

    return (
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - featured articles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main featured article */}
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              variants={itemVariants}
              onClick={() => navigate('/article', { state: { article: mainArticle } })}
            >
              <div className="relative">
                <img 
                  src={mainArticle.urlToImage || sports} 
                  alt={mainArticle.title}
                  className="w-full h-130 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
                <div className="absolute bottom-0 left-0 bg-[#1d2d44] text-white px-3 py-1 text-sm font-medium">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 hover:text-[#1d2d44] transition-colors">{mainArticle.title}</h2>
                <p className="text-gray-500 text-sm mb-3">{new Date(mainArticle.publishedAt).toLocaleDateString()}</p>
                <p className="text-gray-700">{mainArticle.description}</p>
                <div className="mt-4">
                  <a 
                    href={mainArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1d2d44] font-medium hover:text-[#748cab] transition-colors"
                  >
                    Read full story →
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Secondary featured articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryArticles.map((article, index) => (
                <motion.div 
                  key={index} 
                  className=" bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                  variants={itemVariants}
                  onClick={() => navigate('/article', { state: { article } })}
                >
                  <img 
                    src={article.urlToImage || sports} 
                    alt={article.title}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/240';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 hover:text-[#1d2d44] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{new Date(article.publishedAt).toLocaleDateString()}</p>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1d2d44] text-sm font-medium hover:text-[#748cab] transition-colors"
                    >
                      Read more →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right column - sidebar articles */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Latest Updates</h3>
            {sidebarArticles.map((article, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-4 transition-shadow hover:shadow-lg"
                variants={itemVariants}
                onClick={() => navigate('/article', { state: { article } })}
              >
                <div className="flex">
                  <img 
                    src={article.urlToImage || sports} 
                    alt={article.title}
                    className="h-29 w-24 object-cover rounded-lg mr-4"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-800 hover:text-[#1d2d44] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">{new Date(article.publishedAt).toLocaleDateString()}</p>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1d2d44] text-xs font-medium hover:text-[#748cab] transition-colors mt-2 block"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Article detail modal
        {activeArticle && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={activeArticle.urlToImage || sports} 
                  alt={activeArticle.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{activeArticle.title}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(activeArticle.publishedAt).toLocaleDateString()} • 
                  <span className="ml-1">{activeArticle.source?.name || 'Unknown Source'}</span>
                </p>
                <p className="text-gray-700 mb-4">{activeArticle.description}</p>
                <p className="text-gray-700 mb-6">{activeArticle.content || 'Visit the source website to read the full article.'}</p>
                <div className="flex justify-between items-center">
                  <a 
                    href={activeArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1d2d44] text-white px-6 py-2 rounded-lg hover:bg-[#778da9] transition-colors"
                  >
                    Read full story
                  </a>
                  <button 
                    onClick={() => setActiveArticle(null)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )} */}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          className="flex justify-center items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl pb-2  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1d2d44] to-[#748cab]">
            Sports News
          </h1>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#1d2d44] to-transparent"></div>
        </motion.div>
        
        {loading ? renderSkeletonLoader() : renderNewsContent()}
      </div>
    </div>
  );
};

export default Sports;