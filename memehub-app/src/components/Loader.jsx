import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Loading;
export const SkeletonLoader = () => (
  <div className="bg-gray-300 animate-pulse h-40 rounded-lg"></div>
);
