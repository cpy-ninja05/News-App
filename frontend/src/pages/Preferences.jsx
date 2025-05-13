import Axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const categories = [
  'Business',
  'Entertainment',
  'Health',
  'Science',
  'Sports',
  'Technology'
];

export default function Preferences() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useParams();

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await Axios.post(
        `http://localhost:3000/register-login/preferences/${email}`,
        { newsPreferences: selectedCategories },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate('/loginandregister');
      } else {
        setError('Failed to save preferences. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Choose Your News Preferences
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Select the categories of news you are interested in.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`py-2 px-4 rounded-md border transition-colors duration-300 ${
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-medium"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
