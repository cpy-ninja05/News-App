import Axios from 'axios';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Business',
  'Entertainment',
  'Health',
  'Science',
  'Sports',
  'Technology'
];

export default function UpdatePreferences() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPreferences, setFetchingPreferences] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch current user preferences on component mount
  useEffect(() => {
    fetchCurrentPreferences();
  }, []);

  const fetchCurrentPreferences = async () => {
    setFetchingPreferences(true);
    try {
      const response = await Axios.get(
        // `https://news-app-dcs5.onrender.com/register-login/preferences`,
        `http://localhost:3000/register-login/preferences`,
        { withCredentials: true }
      );
      if (response.data.success && response.data.preferences) {
        setSelectedCategories(response.data.preferences);
        setOriginalCategories(response.data.preferences);
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
      setError('Failed to load current preferences.');
    } finally {
      setFetchingPreferences(false);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    // Clear any existing messages when user makes changes
    setError('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    
    // Check if preferences have actually changed
    const hasChanged = JSON.stringify(selectedCategories.sort()) !== JSON.stringify(originalCategories.sort());
    if (!hasChanged) {
      setSuccessMessage('No changes detected.');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await Axios.put(
        // `https://news-app-dcs5.onrender.com/register-login/preferences`,
        `http://localhost:3000/register-login/preferences`,
        { newsPreferences: selectedCategories },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setOriginalCategories([...selectedCategories]);
        setSuccessMessage('Preferences updated successfully!');
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('Failed to update preferences. Please try again.');
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('An error occurred while updating preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCategories([...originalCategories]);
    setError('');
    setSuccessMessage('');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (fetchingPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading preferences...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Header section matching newspaper theme */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Update News Preferences
            </h1>
            <p className="text-gray-600 text-lg">
              Customize your news feed by selecting your areas of interest
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Content header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Your News Categories
            </h2>
            <p className="text-gray-600 mt-1">
              Select the categories you want to see in your personalized news feed
            </p>
          </div>

          {/* Categories grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    selectedCategories.includes(category)
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">{category}</span>
                    {selectedCategories.includes(category) && (
                      <Check size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {category === 'Business' && 'Markets, finance, and corporate news'}
                    {category === 'Entertainment' && 'Movies, music, and celebrity news'}
                    {category === 'Health' && 'Medical breakthroughs and wellness'}
                    {category === 'Science' && 'Research, discoveries, and innovation'}
                    {category === 'Sports' && 'Games, scores, and athletic news'}
                    {category === 'Technology' && 'Tech trends and product launches'}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected count */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedCategories.length}</span> of {categories.length} categories selected
              </p>
              {selectedCategories.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Selected: </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedCategories.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <X size={20} className="text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <Check size={20} className="text-green-600" />
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex-1 sm:flex-none bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition duration-300 font-medium flex items-center justify-center space-x-2"
              >
                <X size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional info section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Your Preferences</h3>
          <div className="text-gray-600 space-y-2">
            <p>• Your preferences help us curate a personalized news feed tailored to your interests.</p>
            <p>• You can update these preferences at any time by clicking the settings icon in the navigation bar.</p>
            <p>• Changes take effect immediately and will be reflected in your next news feed refresh.</p>
            <p>• We recommend selecting at least 2-3 categories for a well-rounded news experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}