import React, { createContext, useReducer, useEffect } from "react";
import { auth } from "../"; // Adjust path as needed
import { onAuthStateChanged } from "firebase/auth";
import { Type } from "../../Utility/action.type"; // You'll need this file

export const DataContext = createContext();

export const DataProvider = ({ children, reducer, initialState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Add Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("Auth User:", authUser);
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      } else {
        console.log("No user");
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};