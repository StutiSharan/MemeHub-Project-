import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Loading;
