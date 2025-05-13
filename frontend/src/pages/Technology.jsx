import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import tech from '../assets/Images/technology.jpg';
import Navbar from '../components/Navbar';

const Technology = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=18&apiKey=${import.meta.env.VITE_API_KEY}`
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

  // Function to change the featured article
  const changeFeatured = (index) => {
    setFeaturedIndex(index);
  };

  // Function to open modal with article preview
  const openPreviewModal = (article, e) => {
    e.stopPropagation(); // Prevent triggering the changeFeatured function
    setActiveArticle(article);
  };

  // Function to close the modal
  const closeModal = () => {
    setActiveArticle(null);
  };

  // Skeleton loader for the featured and regular cards
  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Featured skeleton */}
      <div className="md:col-span-6 lg:col-span-8 bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Grid of smaller skeletons */}
      <div className="md:col-span-6 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-3 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      {/* Remaining skeletons in a grid */}
      <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-3 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the actual content when data is loaded
  const renderNewsGrid = () => {
    if (news.length === 0) return <p>No news articles available.</p>;
    
    // Extract the featured article
    const featuredArticle = news[featuredIndex];
    
    // Create a copy of the news array without the featured article
    const remainingArticles = news.filter((_, index) => index !== featuredIndex);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Featured article - large card */}
        <article className="md:col-span-6 lg:col-span-8 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative"
          >
            <img
              src={featuredArticle.urlToImage}
              alt={featuredArticle.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          </div>
          <div className="p-6" 
          >
            <h2 className="text-2xl font-bold mb-3"
            
            >{featuredArticle.title}</h2>
            <p className="text-gray-600 mb-4">{featuredArticle.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
              <div className="flex gap-3">
                <a
                  href={featuredArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </article>
        
        {/* Right sidebar with 4 smaller cards */}
        <div className="md:col-span-6 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {remainingArticles.slice(0, 4).map((article, index) => (
            <article 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
              onClick={() => changeFeatured(remainingArticles.indexOf(article) + (remainingArticles.indexOf(article) >= featuredIndex ? 1 : 0))}
            >
              <img
                src={article.urlToImage||tech}
                alt={article.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1 line-clamp-2">{article.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => openPreviewModal(article, e)}
                  className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium shadow"
                >
                  Quick View
                </button>
              </div> */}
            </article>
          ))}
        </div>
        
        {/* Bottom grid with remaining articles */}
        <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {remainingArticles.slice(4).map((article, index) => (
            <article 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
              onClick={(e) => openPreviewModal(article, e)}
            >
              <img
                src={article.urlToImage|| tech}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read
                    </a>
                  </div>
                </div>
              </div>
              
              {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => openPreviewModal(article, e)}
                  className="px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium shadow"
                >
                  Quick View
                </button>
              </div> */}
            </article>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto px-4 py-8 w-10/12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Technology News</h1>
        
        {loading ? renderSkeletonLoader() : renderNewsGrid()}
        
        {/* Article detail modal */}
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
                  src={activeArticle.urlToImage || tech} 
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
                <p className="text-gray-700 mb-6">{activeArticle.content?.substring(0, 400) || 'Visit the source website to read the full article.'}</p>
                <div className="flex justify-between items-center">
                  <a 
                    href={activeArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default Technology;