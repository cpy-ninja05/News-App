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
      <div className="relative overflow-hidden bg-white shadow-lg mx-auto my-8 w-10/12 rounded-xl">
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
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                      <h2 className="text-white text-3xl font-bold mb-3">{article.title}</h2>
                      <p className="text-gray-200 line-clamp-2 mb-4">{article.description}</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Read More
                      </a>
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
      <div className="w-10/12 mx-auto px-4 space-y-8 mb-8">
        {selectedCategories.map((category) => (
          <NewsSection
            key={category}
            category={category}
            apiKey={import.meta.env.VITE_API_KEY}
            title={category.toUpperCase()}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;