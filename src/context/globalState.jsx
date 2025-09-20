import React, { createContext, useState, useEffect } from "react";
import api from "@/services/api";

// Create context
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
 
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const role = localStorage.getItem("userRole");
        setUser(userData);

        // Fetch teacher units if role is teacher
        if (role === "teacher" && userData?._id) {
          const res = await api.get(`/api/teacherUnits/${userData._id}/units`);
          setUnits(res.data);
        }

        // Fetch general data
      
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        
        units,
        setUnits,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;