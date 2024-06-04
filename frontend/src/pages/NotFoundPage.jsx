import React from 'react';

const NotFoundPage = () => {
  const ButtonGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src="https://seranking.com/blog/wp-content/uploads/2021/01/404_01-min.jpg" alt="Not Found" className="mb-4" />
      <p className="text-2xl mb-4">Oops, something went wrong!</p>
      <button
        onClick={ButtonGoBack}
        className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-200"
      >
        Click me to return to your last page
      </button>
    </div>
  );
};

export default NotFoundPage;
