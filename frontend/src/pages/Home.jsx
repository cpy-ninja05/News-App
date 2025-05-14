import Axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import NewsSection from '../components/NewsSection.jsx';

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get('http://localhost:3000/news/categories', { withCredentials: true });
        setSelectedCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchTrendingNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_API_KEY}`
        );
        const data = await response.json();
        setTrendingNews(data.articles.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trending news:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchTrendingNews();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === trendingNews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? trendingNews.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [trendingNews.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Trending News Carousel */}
      <div className="relative overflow-hidden bg-white shadow-lg mx-auto my-8 max-w-7xl rounded-xl">
        {isLoading ? (
          <div className="h-[600px] animate-pulse bg-gray-200 rounded-xl" />
        ) : (
          <>
            <div className="relative h-[600px]">
              {trendingNews.map((article, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
                >
                  <div className="relative h-full">
                    <img
                      src={article.urlToImage || "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/800/600';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                      <h2 className="text-white text-3xl font-bold mb-3">{article.title}</h2>
                      <p className="text-gray-200 line-clamp-2 mb-4">{article.description}</p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setActiveArticle(article)}
                          className="inline-block bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {trendingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category News Sections */}
      <div className="max-w-7xl mx-auto px-4 space-y-8 mb-8">
        {selectedCategories.map((category) => (
          <NewsSection
            key={category}
            category={category}
            apiKey={import.meta.env.VITE_API_KEY}
            title={category.toUpperCase()}
            onArticleClick={setActiveArticle}
          />
        ))}
      </div>

      {/* Article detail modal */}
      {activeArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <img 
                src={activeArticle.urlToImage || "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"} 
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;