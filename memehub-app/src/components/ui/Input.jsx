import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={
        "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 " +
        className
      }
    />
  );
});

Input.displayName = "Input";

export default Input;
