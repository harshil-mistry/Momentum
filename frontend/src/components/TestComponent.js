import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind Test</h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled properly, Tailwind CSS is working!
        </p>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
