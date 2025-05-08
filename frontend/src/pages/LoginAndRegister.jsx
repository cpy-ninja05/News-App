import { Newspaper } from 'lucide-react';
import { useState } from 'react';
import LoginCard from '../components/LoginCard.jsx';
import RegisterCard from '../components/RegisterCard.jsx';

export default function LoginAndRegister({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const switchToLogin = () => setIsLoginView(true);
  const switchToRegister = () => setIsLoginView(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold font-serif text-gray-800"><span className='font-[NewYorkTimes] text-4xl'>The </span>CHRONICLE</h1>
        </div>
        <p className="text-gray-600 text-center">Your personalized news recommendation platform</p>
      </div>
      
      {isLoginView ? (
        <LoginCard switchToRegister={switchToRegister} onLoginSuccess={onLoginSuccess} />
      ) : (
        <RegisterCard switchToLogin={switchToLogin} />
      )}
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} NewsFlash. All rights reserved.</p>
      </div>
    </div>
  );
}