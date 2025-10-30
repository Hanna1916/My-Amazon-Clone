import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/Firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import classes from "./Orders.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check for success message from navigation
  const successMessage = location.state?.msg;

  useEffect(() => {
    import { collection, getDocs, query, orderBy } from "firebase/firestore";

    // In your fetchOrders function:
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

        // Try Firebase with modern syntax
        if (db && user?.uid) {
          try {
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

        // ... rest of your code
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
    if (successMessage) {
      const timer = setTimeout(() => {
        // Clear the state without reloading
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        {successMessage && (
          <div className={classes.success_message}>✅ {successMessage}</div>
        )}

        {/* Error Message */}
        {error && <div className={classes.error_message}>❌ {error}</div>}

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
                  {order.basket?.map((item, index) => (
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





