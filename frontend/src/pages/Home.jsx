import Axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import NewsSection from "../components/NewsSection.jsx";

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:3000/news/categories",
          { withCredentials: true }
        );
        setSelectedCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTrendingNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${
            import.meta.env.VITE_API_KEY
          }`
        );
        const data = await response.json();
        setTrendingNews(data.articles.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching trending news:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchTrendingNews();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === trendingNews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? trendingNews.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [trendingNews.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto px-4 pt-8 max-w-7xl">
        <motion.div
          className="flex justify-center items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl pb-2  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1d2d44] to-[#748cab]">
            Home
          </h1>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#1d2d44] to-transparent"></div>
        </motion.div>
      </div>
      {/* Trending News Carousel */}
      <div className="relative overflow-hidden bg-white shadow-lg mx-auto my-4 md:my-8 max-w-7xl rounded-xl px-2 md:px-4">
        {isLoading ? (
          <div className="h-[300px] md:h-[400px] lg:h-[600px] animate-pulse bg-gray-200 rounded-xl" />
        ) : (
          <>
            <div className="relative h-[300px] md:h-[400px] lg:h-[600px]">
              {trendingNews.map((article, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    pointerEvents: index === currentSlide ? "auto" : "none",
                  }}
                >
                  <div className="relative h-full">
                    <img
                      src={
                        article.urlToImage ||
                        "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/800/600";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 md:p-6 lg:p-8">
                      <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-bold mb-1 md:mb-3">
                        {article.title}
                      </h2>
                      <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-2 md:mb-4 hidden sm:block">
                        {article.description}
                      </p>
                      <div className="flex gap-2 md:gap-4">
                        <button
                          onClick={() =>
                            navigate("/article", { state: { article } })
                          }
                          className="inline-block bg-white text-black text-xs md:text-sm px-3 md:px-6 py-1 md:py-2 rounded-full hover:bg-gray-100 transition-colors"
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
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 md:p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="md:hidden" />
              <ChevronLeft size={24} className="hidden md:block" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 md:p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="md:hidden" />
              <ChevronRight size={24} className="hidden md:block" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
              {trendingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-white w-3 md:w-4"
                      : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category News Sections */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 space-y-6 md:space-y-8 mb-6 md:mb-8">
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
    </div>
  );
};

export default Home;
