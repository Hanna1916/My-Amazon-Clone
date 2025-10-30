import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/firebase";
// ✅ REMOVE duplicate import - use the one from Firebase
// import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import classes from "./Orders.module.css";
import LayOut from "../../Components/LayOut/LayOut";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔄 Fetching orders for user:", user.uid);

        let ordersData = [];
        let source = "";

        // Try Firebase first
        if (db && user?.uid) {
          try {
            // ✅ Use modern Firestore syntax
            const { collection, getDocs, query, orderBy } = await import(
              "firebase/firestore"
            );

            const ordersRef = collection(db, "users", user.uid, "orders");
            const q = query(ordersRef, orderBy("created", "desc"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
              ordersData.push({ id: doc.id, ...doc.data() });
            });

            if (ordersData.length > 0) {
              source = "Firebase";
              console.log("📦 Found orders in Firebase:", ordersData);
            }
          } catch (firebaseError) {
            console.warn("Firestore error:", firebaseError);
          }
        }

        // If no Firebase orders, try localStorage
        if (ordersData.length === 0) {
          const localOrders = JSON.parse(
            localStorage.getItem("user_orders") || "{}"
          );
          const userLocalOrders = Object.values(localOrders)
            .filter((order) => order.userId === user.uid)
            .sort((a, b) => b.created - a.created);

          if (userLocalOrders.length > 0) {
            ordersData = userLocalOrders;
            source = "localStorage";
            console.log("📦 Found orders in localStorage:", userLocalOrders);
          }
        }

        setOrders(ordersData);
        setDataSource(source);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (location.state?.msg) {
      const timer = setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state?.msg]);

  if (loading) {
    return (
      <LayOut>
        <div className={classes.orders}>
          <h2>Your Orders</h2>
          <div className={classes.loading}>Loading your orders...</div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={classes.orders}>
        <h2>Your Orders</h2>

        {/* Success Message */}
        {location.state?.msg && (
          <div className={classes.success_message}>✅ {location.state.msg}</div>
        )}

        {/* Data source indicator */}
        {dataSource && (
          <div
            style={{
              background: "#e3f2fd",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            📊 Data loaded from: <strong>{dataSource}</strong>
          </div>
        )}

        {/* No Orders */}
        {orders.length === 0 && !loading && (
          <div className={classes.no_orders}>
            <p>You haven't placed any orders yet.</p>
            <p>Start shopping to see your orders here!</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className={classes.orders_list}>
            {orders.map((order) => (
              <div
                key={order.id || order.orderId}
                className={classes.order_card}
              >
                <div className={classes.order_header}>
                  <div>
                    <strong>Order ID:</strong> {order.orderId || order.id}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(order.created).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span className={classes.status}>
                      {order.status || "completed"}
                    </span>
                  </div>
                </div>

                <div className={classes.order_items}>
                  <h4>
                    Items ({order.basket?.length || order.items?.length || 0}):
                  </h4>
                  {(order.basket || order.items || []).map((item, index) => (
                    <div key={index} className={classes.order_item}>
                      <img src={item.image} alt={item.title} />
                      <div className={classes.item_details}>
                        <p>{item.title}</p>
                        <p>Quantity: {item.amount}</p>
                        <p>Price: ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={classes.order_total}>
                  <strong>Total: ${order.total || order.amount / 100}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayOut>
  );
}

export default Orders;
