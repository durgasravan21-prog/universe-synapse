import React from 'react';
import { useLocation } from 'wouter';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block bg-white opacity-20 rounded-full p-6 mb-6">
          <AlertCircle className="text-white" size={64} />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-2xl font-semibold text-white opacity-90 mb-4">
          Page Not Found
        </p>
        <p className="text-lg text-white opacity-80 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.
        </p>
        <button
          onClick={() => setLocation('/')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          <Home size={20} />
          <span>Go to Home</span>
        </button>
      </div>
    </div>
  );
}
