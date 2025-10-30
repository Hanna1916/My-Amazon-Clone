// // import React, { useContext } from "react";
// // import { Navigate, useLocation } from "react-router-dom";
// // import { DataContext } from "../DataProvider/DataProvider";

// // const ProtectRoute = ({ children, msg, redirect }) => {
// //   const [{ user }] = useContext(DataContext);
// //   const location = useLocation();

// //   // If user is not authenticated, redirect to auth page with message
// //   if (!user) {
// //     return (
// //       <Navigate
// //         to="/auth"
// //         state={{
// //           msg: msg,
// //           redirect: location.pathname, // This should be the current path
// //         }}
// //         replace
// //       />
// //     );
// //   }

// //   return children;
// // };

// // export default ProtectRoute;

// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { DataContext } from "../DataProvider/DataProvider";

// const ProtectRoute = ({ children, msg, redirect }) => {
//   const [{ user }] = useContext(DataContext);
//   const location = useLocation();

//   // ✅ DEMO MODE: Set this to false to disable all protection
//   const DEMO_MODE = true;

//   if (DEMO_MODE) {
//     return children; // Skip all protection in demo mode
//   }

//   // Original protection logic (only runs when DEMO_MODE = false)
//   if (!user) {
//     return (
//       <Navigate
//         to="/auth"
//         state={{
//           msg: msg,
//           redirect: location.pathname,
//         }}
//         replace
//       />
//     );
//   }

//   return children;
// };

// export default ProtectRoute;

