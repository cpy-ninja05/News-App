import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import tech from '../assets/Images/technology.jpg';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const Technology = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=50&apiKey=${import.meta.env.VITE_API_KEY}`
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

  // Categories for technology news
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'ai', name: 'AI & ML' },
    { id: 'gadgets', name: 'Gadgets' },
    { id: 'software', name: 'Software' },
    { id: 'internet', name: 'Internet' }
  ];

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

  // Filter articles based on category
  const filteredNews = currentCategory === 'all' 
    ? news 
    : news.filter(article => {
        const title = article.title?.toLowerCase() || '';
        const description = article.description?.toLowerCase() || '';
        const content = article.content?.toLowerCase() || '';
        const searchText = title + description + content;
        
        switch(currentCategory) {
          case 'ai':
            return searchText.includes('ai') || searchText.includes('artificial intelligence') || 
                   searchText.includes('machine learning') || searchText.includes('neural') || 
                   searchText.includes('deep learning');
          case 'gadgets':
            return searchText.includes('gadget') || searchText.includes('device') || 
                   searchText.includes('hardware') || searchText.includes('phone') || 
                   searchText.includes('laptop') || searchText.includes('wearable');
          case 'software':
            return searchText.includes('software') || searchText.includes('app') || 
                   searchText.includes('application') || searchText.includes('platform') || 
                   searchText.includes('program') || searchText.includes('code');
          case 'internet':
            return searchText.includes('internet') || searchText.includes('web') || 
                   searchText.includes('online') || searchText.includes('cloud') || 
                   searchText.includes('network') || searchText.includes('server');
          default:
            return true;
        }
      });

  // Skeleton loader for the page
  const renderSkeletonLoader = () => (
    <div className="space-y-8">
      {/* Category tabs skeleton */}
      <div className="flex overflow-x-auto pb-2 mb-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
        ))}
      </div>
      
      {/* Hero section skeleton */}
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

  // Render the news content
  const renderNewsContent = () => {
    // If no news is available
    if (!filteredNews || filteredNews.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-red-700">No technology news available at the moment.</h2>
          <p className="text-gray-500 mt-2">Please check back later for updates or try another category.</p>
        </div>
      );
    }

    // Split the news into featured and regular articles
    const featuredArticle = filteredNews[0];
    const regularArticles = filteredNews.slice(1, 7);
    const trendingArticles = filteredNews.slice(7, 10);

    return (
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Category selector */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`px-6 py-2 rounded-full mr-3 transition-colors font-medium flex-shrink-0 ${
                currentCategory === category.id 
                  ? 'bg-[#c32f27] text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-red-100'
              }`}
              onClick={() => setCurrentCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
        
        {/* Hero section */}
        {featuredArticle && (
          <motion.div 
            className="relative rounded-xl overflow-hidden h-96 mb-12 group shadow-lg"
            variants={itemVariants}
            onClick={() => navigate('/article', { state: { article: featuredArticle } })}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img 
              src={featuredArticle.urlToImage || tech} 
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/api/placeholder/1200/600';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <span className="bg-[#c32f27] text-white px-4 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                Featured
              </span>
              <h2 className="text-4xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors">
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
                  className="text-white bg-[#c32f27] bg-opacity-80 hover:bg-opacity-100 px-5 py-2 rounded-full font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read full story
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content grid */}
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
                  src={article.urlToImage || tech} 
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
                <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#c32f27] transition-colors">
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
                    className="text-[#c32f27] font-medium hover:text-red-800 transition-colors flex items-center"
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

        {/* Trending section */}
        {trendingArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c32f27] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Trending in Tech
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingArticles.map((article, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  onClick={() => navigate('/article', { state: { article } })}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={article.urlToImage || tech} 
                    alt={article.title}
                    className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 hover:text-[#c32f27] transition-colors line-clamp-2 text-sm">
                      {article.title}
                    </h4>
                    <span className="text-[#c32f27] text-xs font-medium mt-1 block">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Article detail modal
        {activeArticle && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={activeArticle.urlToImage || tech} 
                  alt={activeArticle.title}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {activeArticle.source?.name && (
                  <div className="absolute top-4 left-4 bg-[#c32f27] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {activeArticle.source.name}
                  </div>
                )}
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{activeArticle.title}</h2>
                <div className="flex items-center mb-6">
                  <span className="text-gray-500 text-sm">
                    {new Date(activeArticle.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-[#c32f27] text-sm font-medium">
                    Technology
                  </span>
                </div>
                <p className="text-gray-700 text-lg mb-6">{activeArticle.description}</p>
                <p className="text-gray-600 mb-8">
                  {activeArticle.content?.split('[+')[0] || 'Visit the source website to read the full article.'}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={activeArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#c32f27] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    Read full story
                  </a>
                  <button 
                    onClick={() => setActiveArticle(null)}
                    className="text-gray-600 hover:text-gray-800 transition-colors px-4"
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="flex justify-center items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl pb-2  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#c32f27] to-[#c32f27]">
            Technology News
          </h1>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#c32f27] to-transparent"></div>
        </motion.div>
        
        {loading ? renderSkeletonLoader() : renderNewsContent()}
      </div>
    </div>
  );
};

export default Technology;