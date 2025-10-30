// import React, { useContext, useState, useEffect } from "react";
// import { DataContext } from "../../Components/DataProvider/DataProvider";
// import { db } from "../../Utility/firebase";
// import { useLocation } from "react-router-dom";
// import classes from "./Orders.module.css";
// import LayOut from "../../Components/LayOut/LayOut";

// function Orders() {
//   const [{ user }] = useContext(DataContext);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dataSource, setDataSource] = useState("");
//   const location = useLocation();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user?.uid) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         console.log("🔄 Fetching orders for user:", user.uid);

//         let ordersData = [];
//         let source = "";

//         // Try Firebase first
//         if (db && user?.uid) {
//           try {
//             // ✅ Use modern Firestore syntax
//             const { collection, getDocs, query, orderBy } = await import(
//               "firebase/firestore"
//             );

//             const ordersRef = collection(db, "users", user.uid, "orders");
//             const q = query(ordersRef, orderBy("created", "desc"));
//             const querySnapshot = await getDocs(q);

//             querySnapshot.forEach((doc) => {
//               ordersData.push({ id: doc.id, ...doc.data() });
//             });

//             if (ordersData.length > 0) {
//               source = "Firebase";
//               console.log("📦 Found orders in Firebase:", ordersData);
//             }
//           } catch (firebaseError) {
//             console.warn("Firestore error:", firebaseError);
//           }
//         }

//         // If no Firebase orders, try localStorage
//         if (ordersData.length === 0) {
//           const localOrders = JSON.parse(
//             localStorage.getItem("user_orders") || "{}"
//           );
//           const userLocalOrders = Object.values(localOrders)
//             .filter((order) => order.userId === user.uid)
//             .sort((a, b) => b.created - a.created);

//           if (userLocalOrders.length > 0) {
//             ordersData = userLocalOrders;
//             source = "localStorage";
//             console.log("📦 Found orders in localStorage:", userLocalOrders);
//           }
//         }

//         setOrders(ordersData);
//         setDataSource(source);
//       } catch (err) {
//         console.error("❌ Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   // Clear success message after 5 seconds
//   useEffect(() => {
//     if (location.state?.msg) {
//       const timer = setTimeout(() => {
//         window.history.replaceState({}, document.title);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [location.state?.msg]);

//   if (loading) {
//     return (
//       <LayOut>
//         <div className={classes.orders}>
//           <h2>Your Orders</h2>
//           <div className={classes.loading}>Loading your orders...</div>
//         </div>
//       </LayOut>
//     );
//   }

//   return (
//     <LayOut>
//       <div className={classes.orders}>
//         <h2>Your Orders</h2>

//         {/* Success Message */}
//         {location.state?.msg && (
//           <div className={classes.success_message}>✅ {location.state.msg}</div>
//         )}

//         {/* Data source indicator */}
//         {dataSource && (
//           <div
//             style={{
//               background: "#e3f2fd",
//               padding: "8px",
//               borderRadius: "4px",
//               marginBottom: "15px",
//               fontSize: "14px",
//             }}
//           >
//             📊 Data loaded from: <strong>{dataSource}</strong>
//           </div>
//         )}

//         {/* No Orders */}
//         {orders.length === 0 && !loading && (
//           <div className={classes.no_orders}>
//             <p>You haven't placed any orders yet.</p>
//             <p>Start shopping to see your orders here!</p>
//           </div>
//         )}

//         {/* Orders List */}
//         {orders.length > 0 && (
//           <div className={classes.orders_list}>
//             {orders.map((order) => (
//               <div
//                 key={order.id || order.orderId}
//                 className={classes.order_card}
//               >
//                 <div className={classes.order_header}>
//                   <div>
//                     <strong>Order ID:</strong> {order.orderId || order.id}
//                   </div>
//                   <div>
//                     <strong>Date:</strong>{" "}
//                     {new Date(order.created).toLocaleDateString()}
//                   </div>
//                   <div>
//                     <strong>Status:</strong>
//                     <span className={classes.status}>
//                       {order.status || "completed"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={classes.order_items}>
//                   <h4>
//                     Items ({order.basket?.length || order.items?.length || 0}):
//                   </h4>
//                   {(order.basket || order.items || []).map((item, index) => (
//                     <div key={index} className={classes.order_item}>
//                       <img src={item.image} alt={item.title} />
//                       <div className={classes.item_details}>
//                         <p>{item.title}</p>
//                         <p>Quantity: {item.amount}</p>
//                         <p>Price: ${item.price}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className={classes.order_total}>
//                   <strong>Total: ${order.total || order.amount / 100}</strong>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </LayOut>
//   );
// }

// export default Orders;

import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import classes from "./Orders.module.css";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("🔄 Fetching orders for user:", user?.uid);

  // ✅ DEMO MODE: Use mock orders data
  useEffect(() => {
    console.log("🚀 DEMO MODE: Loading mock orders data...");

    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockOrders = [
        {
          id: "demo-order-1",
          data: {
            created: Date.now(),
            amount: 49.99,
            basket: [
              {
                id: "demo-item-1",
                title: "Wireless Bluetooth Headphones",
                image: "https://via.placeholder.com/150",
                price: 49.99,
                quantity: 1,
              },
            ],
          },
        },
        {
          id: "demo-order-2",
          data: {
            created: Date.now() - 86400000, // 1 day ago
            amount: 29.99,
            basket: [
              {
                id: "demo-item-2",
                title: "USB-C Charging Cable",
                image: "https://via.placeholder.com/150",
                price: 14.99,
                quantity: 2,
              },
            ],
          },
        },
      ];

      setOrders(mockOrders);
      setLoading(false);
      console.log("✅ Demo orders loaded:", mockOrders.length);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return (
      <div className={classes.orders}>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.loading}>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.orders}>
      <div className={classes.orders_container}>
        <h1>Your Orders</h1>

        {/* Demo Notice */}
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#155724", fontSize: "14px" }}>
            <strong>Demo Mode:</strong> Showing mock order data. In a real
            application, this would connect to your order history database.
          </p>
        </div>

        <div className={classes.orders_order}>
          {orders.length === 0 ? (
            <div className={classes.no_orders}>
              <h2>You have no orders</h2>
              <p>Your orders will appear here after you make purchases.</p>
            </div>
          ) : (
            orders?.map((order, index) => (
              <div key={order.id} className={classes.order}>
                <div className={classes.order_header}>
                  <div className={classes.order_info}>
                    <p>
                      <strong>ORDER PLACED</strong>
                      <br />
                      {new Date(order.data.created).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>TOTAL</strong>
                      <br />${order.data.amount}
                    </p>
                    <p>
                      <strong>SHIP TO</strong>
                      <br />
                      {user?.displayName || "Demo User"}
                    </p>
                  </div>
                  <div className={classes.order_id}>
                    <p>
                      <strong>ORDER # {order.id.toUpperCase()}</strong>
                    </p>
                  </div>
                </div>

                <div className={classes.order_items}>
                  {order.data.basket.map((item) => (
                    <div key={item.id} className={classes.order_item}>
                      <img src={item.image} alt={item.title} />
                      <div className={classes.item_info}>
                        <h4>{item.title}</h4>
                        <p>${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={classes.order_actions}>
                  <button className={classes.action_button}>
                    Track package
                  </button>
                  <button className={classes.action_button}>
                    Leave seller feedback
                  </button>
                  <button className={classes.action_button}>
                    Write product review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
