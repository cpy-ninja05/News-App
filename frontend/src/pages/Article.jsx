import { motion } from 'framer-motion';
import { Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Article = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    if (!article) {
      navigate('/home');
      return;
    }

    // Initialize speech synthesis
    const speechUtterance = new SpeechSynthesisUtterance();
    speechUtterance.text = `${article.title}. ${article.description}. ${article.content || ''}`;
    speechUtterance.rate = 1;
    speechUtterance.pitch = 1;
    speechUtterance.onend = () => setIsPlaying(false);
    setUtterance(speechUtterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [article, navigate]);

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.article 
        className="max-w-4xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/800/400';
            }}
          />
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {article.source?.name || 'News'}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <button
                onClick={toggleAudio}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Listen</span>
                  </>
                )}
                <Volume2 size={16} />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {article.description}
            </p>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {article.content?.split('[+')[0] || 'Visit the source website to read the full article.'}
              </p>
            </div>
            
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Full Article
              </a>
              
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default Article;