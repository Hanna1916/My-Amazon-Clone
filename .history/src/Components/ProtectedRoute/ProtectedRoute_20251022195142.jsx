// import React,{useContext,useEffect} from 'react'
// import { useNavigate } from 'react-router-dom'
// import { DataContext } from '../DataProvider/DataProvider'

// const ProtectedRoute = ({children, msg, redirect}) => {
//     const navigate = useNavigate();
//     const [{user}, dispatch] = useContext(DataContext);

//     useEffect(() =>{
//         if(!user){
//             navigate("/auth", {state:{msg, redirect}});
//         }
//     },[user]);


//   return children;
// };

// export default ProtectedRoute;

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

const ProtectRoute = ({ children, msg, redirect }) => {
  const [{ user }] = useContext(DataContext);
  const location = useLocation();

  // If user is not authenticated, redirect to auth page with message
  if (!user) {
    return (
      <Navigate
        to="/auth"
        state={{
          msg: msg,
          redirect: location.pathname, // This should be the current path
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectRoute;