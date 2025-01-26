import React, { useState, useContext, useReducer } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [user, setUser] = useState({})
    return <AppContext.Provider value={{user, setUser}}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
