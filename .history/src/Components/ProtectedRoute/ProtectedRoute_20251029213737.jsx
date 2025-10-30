
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

const ProtectRoute = ({ children, msg, redirect }) => {
  const [{ user }] = useContext(DataContext);
  const location = useLocation();

  // ✅ DEMO MODE: Set this to false to disable all protection
  const DEMO_MODE = true;

  if (DEMO_MODE) {
    return children; // Skip all protection in demo mode
  }

  // Original protection logic (only runs when DEMO_MODE = false)
  if (!user) {
    return (
      <Navigate
        to="/auth"
        state={{
          msg: msg,
          redirect: location.pathname,
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectRoute;
Option 3: Add Demo User Automatically
Modify your App.js to auto-set a demo user:

jsx
import './App.css';
import {useContext,useEffect} from 'react'
import Routing from './Router.jsx'
import {DataContext} from './Components/DataProvider/DataProvider'
import {Type} from './Utility/action.type'
import {auth} from './Utility/firebase.js'

function App() {
const [{user},dispatch] = useContext(DataContext)

useEffect(()=>{
  // ✅ DEMO MODE: Auto-set a demo user for school project
  const DEMO_MODE = true;
  
  if (DEMO_MODE && !user) {
    dispatch({
      type: Type.SET_USER,
      user: {
        email: "demo@student.com",
        displayName: "Demo Student", 
        uid: "demo-uid-123456"
      }
    });
    return;
  }

  auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      dispatch({
        type: Type.SET_USER,
        user: authUser
      })
    }else{
      dispatch({
        type: Type.SET_USER,
        user: null
      })
    }
  }) 
},[])

 return (
   <Routing/>
 );
}

export default App;
After Making Changes:
Save the files

Your site will automatically redeploy on Netlify

Clear your browser cache and visit: https://my-amazon-deploy.netlify.app

Now you should see your actual website instead of the login page!

Recommendation:
Use Option 2 - it's the cleanest solution because:

You can easily turn protection back on by changing DEMO_MODE = false

It doesn't break your existing authentication logic

You can demonstrate both modes (with and without login)

Your site will be fully accessible within 2-3 minutes after deploying these changes! 🚀



export default ProtectRoute;
