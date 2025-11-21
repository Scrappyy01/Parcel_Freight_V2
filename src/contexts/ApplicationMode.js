import { createContext, useState } from 'react';

// Create the context
export const ApplicationMode = createContext();

// Create a provider component
export const ApplicationModeProvider = ({ children }) => {
  // Define the state variable and its updater
  const [applicationMode, setApplicationMode] = useState('Heavy Freight');

  return (
    <ApplicationMode.Provider value={{ applicationMode, setApplicationMode }}>
      {children}
    </ApplicationMode.Provider>
  );
};
