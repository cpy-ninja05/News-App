import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import common from '../assets/Images/common.jpeg';

const NewsSection = ({ category, apiKey, title, onArticleClick }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
        );
        const data = await response.json();
        setNews(data.articles.slice(0, 6));
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        setIsLoading(false);
      }
    };

    fetchCategoryNews();
  }, [category, apiKey]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section>
      <motion.div
        className="flex justify-start items-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1d2d44] to-[#748cab]">
          {title}
        </h2>
        <div className="ml-4 h-px flex-grow bg-gradient-to-r from-[#1d2d44] to-transparent"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="overflow-hidden">
              <img
                src={article.urlToImage || common}
                alt={article.title}
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.src = common;
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {article.source?.name || "Unknown Source"}
                </span>
                <button
                  onClick={() => navigate("/article", { state: { article } })}
                  className="text-sm px-3 py-1 text-black hover:text-[#748cab] transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;