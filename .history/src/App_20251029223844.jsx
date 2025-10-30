import "./App.css";
import { useContext, useEffect } from "react";
import Routing from "./Router.jsx";
import { DataContext } from "./Components/DataProvider/DataProvider";
import { Type } from "./Utility/action.type";
import { auth } from "./Utility/firebase.js";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    // ✅ AUTO-DEMO: Create demo user if none exists
    if (!user) {
      console.log("🎯 App: Creating demo user...");
      const demoUser = {
        email: "demo@student.com",
        displayName: "Demo Student",
        uid: "demo-uid-app",
      };

      dispatch({
        type: Type.SET_USER,
        user: demoUser,
      });
    }

    // Keep your existing Firebase auth listener (but don't set user to null)
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      }
      // Don't set user to null in demo mode - keep the demo user
    });
  }, []);

  return <Routing />;
}

export default App;
