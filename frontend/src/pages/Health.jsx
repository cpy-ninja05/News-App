import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import healthBackground from '../assets/Images/health.jpg';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
const Health = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=health&language=en&pageSize=30&apiKey=${import.meta.env.VITE_API_KEY}`
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

  // Categories for health news
  const categories = [
    { id: 'all', name: 'All Health' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'medicine', name: 'Medicine' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'mental', name: 'Mental Health' }
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
          case 'wellness':
            return searchText.includes('wellness') || searchText.includes('well-being') || searchText.includes('lifestyle');
          case 'medicine':
            return searchText.includes('medicine') || searchText.includes('medical') || searchText.includes('treatment') || searchText.includes('doctor');
          case 'nutrition':
            return searchText.includes('nutrition') || searchText.includes('diet') || searchText.includes('food') || searchText.includes('eating');
          case 'fitness':
            return searchText.includes('fitness') || searchText.includes('exercise') || searchText.includes('workout') || searchText.includes('gym');
          case 'mental':
            return searchText.includes('mental') || searchText.includes('psychology') || searchText.includes('mind') || searchText.includes('brain');
          default:
            return true;
        }
      });

  // Render the skeleton loader
  const renderSkeletonLoader = () => (
    <div className="space-y-8">
      {/* Category pills skeleton */}
      <div className="flex overflow-x-auto pb-2 mb-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
        ))}
      </div>
      
      {/* Stats section skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
      
      {/* Hero section skeleton */}
      <div className="h-96 bg-gray-200 rounded-3xl animate-pulse mb-8"></div>
      
      {/* Grid layout skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
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
          <h2 className="text-2xl font-semibold text-green-700">No health news available at the moment.</h2>
          <p className="text-gray-500 mt-2">Please check back later for updates or try another category.</p>
        </div>
      );
    }

    // Split the news into different sections
    const featuredArticle = filteredNews[0];
    const regularArticles = filteredNews.slice(1, 7);
    const essentialReads = filteredNews.slice(7, 11);

    return (
      <motion.div 
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Category selector */}
        <div className="flex overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`px-6 py-2 rounded-full mr-3 transition-all font-medium flex-shrink-0 ${
                currentCategory === category.id 
                  ? 'bg-gradient-to-r from-green-500 to-teal-400 text-white shadow-lg shadow-green-200' 
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
              onClick={() => setCurrentCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Health Stats Section */}
        {/* <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-3xl shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-emerald-800 font-bold">Today's Focus</h3>
                <p className="text-2xl font-bold text-emerald-600 mt-2">Mental Wellness</p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-3xl shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-800 font-bold">Health Tip</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">Stay Hydrated</p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-3xl shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-800 font-bold">Trending Topic</h3>
                <p className="text-2xl font-bold text-orange-600 mt-2">Immune Health</p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
         */}
        {/* Hero section */}
        {featuredArticle && (
          <motion.div 
            className="relative rounded-3xl overflow-hidden h-96 mb-12 group shadow-xl"
            variants={itemVariants}
            onClick={() => navigate('/article', { state: { article: featuredArticle } })}
          >
            <div className="absolute inset-0 z-10"></div>
            <img 
              src={featuredArticle.urlToImage || healthBackground} 
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/api/placeholder/1200/600';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <span className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                Featured Health News
              </span>
              <h2 className="text-4xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-100 mb-4 max-w-3xl">{featuredArticle.description}</p>
              <div className="flex items-center">
                <span className="text-gray-300 text-sm mr-4">
                  {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                </span>
                <a 
                  href={featuredArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full font-medium transition-colors shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read full article
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              variants={itemVariants}
              onClick={() => navigate('/article', { state: { article } })}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.urlToImage || healthBackground} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/240';
                  }}
                />
                {article.source?.name && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-green-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {article.source.name}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-green-600 transition-colors">
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
                    className="text-green-600 font-medium hover:text-green-800 transition-colors flex items-center"
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

        {/* Essential Reads section */}
        {essentialReads.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Essential Health Reads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {essentialReads.map((article, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-5 rounded-2xl shadow-sm flex gap-5 hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  onClick={() => navigate('/article', { state: { article } })}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={article.urlToImage || healthBackground} 
                    alt={article.title}
                    className="h-24 w-24 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {article.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-600 text-xs font-medium mr-3">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-700 text-xs font-medium hover:text-green-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Health insights footer section */}
        <div className="bg-white rounded-3xl p-8 shadow-md mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Health Insights</h2>
          <p className="text-gray-600 mb-6">
            Stay informed with the latest health news and research. Remember that individual health situations vary,
            and it's always best to consult with healthcare professionals for personalized advice.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Stay Hydrated</h3>
              <p className="text-gray-600 text-sm">Drink 8-10 glasses of water daily for optimal health</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Quality Sleep</h3>
              <p className="text-gray-600 text-sm">Aim for 7-9 hours of sleep each night</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4">
              <div className="bg-amber-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Regular Exercise</h3>
              <p className="text-gray-600 text-sm">Get at least 150 minutes of activity weekly</p>
            </div>
          </div>
        </div>

        {/* Article detail modal
        {activeArticle && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={activeArticle.urlToImage || healthBackground} 
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-1 rounded-full text-sm font-medium">
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
                  <span className="text-green-600 text-sm font-medium">
                    Health News
                  </span>
                </div>
                <p className="text-gray-700 text-lg mb-6">{activeArticle.description}</p>
                <p className="text-gray-600 mb-8">
                  {activeArticle.content?.split('[+')[0] || 'Visit the source website to read the full article.'}
                </p>
                <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center">
                  <div className="bg-green-50 p-4 rounded-xl flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      Always consult healthcare professionals for medical advice.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={activeArticle.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md"
                    >
                      Read full article
                    </a>
                    <button 
                      onClick={() => setActiveArticle(null)}
                      className="text-gray-600 hover:text-gray-800 transition-colors px-4 border border-gray-200 rounded-xl"
                    >
                      Close
                    </button>
                  </div>
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
          className="flex items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
            Health & Wellness
          </h1>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-green-600 to-transparent"></div>
        </motion.div>
        
        {loading ? renderSkeletonLoader() : renderNewsContent()}
      </div>
    </div>
  );
};

export default Health;