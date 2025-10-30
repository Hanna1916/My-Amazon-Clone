// import './App.css';
// import {useContext,useEffect} from 'react'
// import Routing from './Router.jsx'
// import {DataContext} from './Components/DataProvider/DataProvider'
// import {Type} from './Utility/action.type'
// import {auth} from './Utility/firebase.js'


// function App() {
// const [{user},dispatch] = useContext(DataContext)

// useEffect(()=>{
//   auth.onAuthStateChanged((authUser)=>{
//     if(authUser){
//       // console.log(authUser)
//       dispatch({
//         type: Type.SET_USER,
//         user: authUser
//       })
//     }else{
//       dispatch({
//         type: Type.SET_USER,
//         user: null
//       })
//     }
//      }) 



// },[])

//  return (
//    <Routing/>
//     );
// }

// export default App;



import "./App.css";
import { useContext, useEffect } from "react";
import Routing from "./Router.jsx";
import { DataContext } from "./Components/DataProvider/DataProvider";
import { Type } from "./Utility/action.type";
import { auth } from "./Utility/firebase.js";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    // ✅ DEMO MODE: Auto-set a demo user for school project
    const DEMO_MODE = true;

    if (DEMO_MODE && !user) {
      dispatch({
        type: Type.SET_USER,
        user: {
          email: "demo@student.com",
          displayName: "Demo Student",
          uid: "demo-uid-123456",
        },
      });
      return;
    }

    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      } else {
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });
  }, []);

  return <Routing />;
}

export default App;
