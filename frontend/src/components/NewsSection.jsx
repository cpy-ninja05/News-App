import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import common from "../assets/Images/common.jpeg"; // Placeholder image
const NewsSection = ({ category = "technology", apiKey, title = "TECHNOLOGY NEWS", onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        
        const data = await response.json();
        setArticles(data.articles.slice(0, 4)); // Get first 4 articles
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, apiKey]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to truncate text to a specific length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Handler for article click
  const handleArticleClick = (article) => {
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-6">
              <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          Error loading news: {error}. Please check your API key or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-120 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button 
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
          onClick={() => navigate(`/${category.toLowerCase()}`)}
        >
          View all
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div className="grid h-85 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article, index) => (
          <div 
            key={index} 
            className="flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => handleArticleClick(article)}
          >
            <div className="h-60 mb-3 overflow-hidden rounded-lg">
              <img 
                src={article.urlToImage || common } 
                alt={article.title || "News image"} 
                onError={(e) => {e.target.src = "/api/placeholder/400/320"}}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex-grow p-3">
              <h3 className="font-semibold text-md mb-1 line-clamp-2 hover:text-[#1d2d44] transition-colors">
                {truncateText(article.title, 60)}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{article.source?.name}</p>
              <div class="flex justify-between ">
                <p className="text-xs text-gray-400">
                  {article.publishedAt ? formatDate(article.publishedAt) : ""}
                </p>
                <div className=" flex ">
                  <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm -mt-1 font-bold text-gray-500 hover:text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                  >
                  Read more
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;