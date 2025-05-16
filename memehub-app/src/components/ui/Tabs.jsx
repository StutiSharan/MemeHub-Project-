import React, { useState } from "react";

export const TabsContext = React.createContext();

export const Tabs = ({ children, value: controlledValue, onValueChange }) => {
  const [internalValue, setInternalValue] = useState(controlledValue || null);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setValue = (val) => {
    if (onValueChange) onValueChange(val);
    if (controlledValue === undefined) setInternalValue(val);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }) => {
  return <div className="flex border-b border-gray-300">{children}</div>;
};

export const TabsTrigger = ({ value, children }) => {
  const { value: activeValue, setValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 -mb-px border-b-2 font-semibold transition-colors duration-200 ${
        isActive
          ? "border-indigo-600 text-indigo-700"
          : "border-transparent text-gray-600 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  if (activeValue !== value) return null;
  return <div className="pt-4">{children}</div>;
};
