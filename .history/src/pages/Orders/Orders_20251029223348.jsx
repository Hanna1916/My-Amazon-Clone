import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import classes from "./Orders.module.css";

function Orders() {
  const [{ user, basket }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("🔄 DEMO MODE: Using mock orders data for user:", user?.email);

  // ✅ DEMO MODE: Use mock orders data instead of Firebase
  useEffect(() => {
    console.log("🚀 Loading mock orders data...");

    // Simulate API call delay
    const timer = setTimeout(() => {
      // Create realistic mock orders
      const mockOrders = [
        {
          id: "demo-order-" + Date.now(),
          data: {
            created: Date.now(),
            amount: 127.97,
            basket: [
              {
                id: "mock-item-1",
                title: "Wireless Bluetooth Headphones with Noise Cancellation",
                image:
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
                price: 79.99,
                quantity: 1,
                rating: 4,
              },
              {
                id: "mock-item-2",
                title: "Smartphone Case - Shockproof Protective Cover",
                image:
                  "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=150&h=150&fit=crop",
                price: 23.99,
                quantity: 2,
                rating: 5,
              },
            ],
            status: "Delivered",
            deliveryDate: "October 28, 2025",
          },
        },
        {
          id: "demo-order-" + (Date.now() - 86400000),
          data: {
            created: Date.now() - 86400000, // 1 day ago
            amount: 45.98,
            basket: [
              {
                id: "mock-item-3",
                title: "Stainless Steel Water Bottle - 1L Insulated",
                image:
                  "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=150&h=150&fit=crop",
                price: 22.99,
                quantity: 2,
                rating: 4,
              },
            ],
            status: "Shipped",
            deliveryDate: "Expected October 30, 2025",
          },
        },
        {
          id: "demo-order-" + (Date.now() - 172800000),
          data: {
            created: Date.now() - 172800000, // 2 days ago
            amount: 349.99,
            basket: [
              {
                id: "mock-item-4",
                title:
                  "Smart Watch with Fitness Tracker and Heart Rate Monitor",
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
                price: 349.99,
                quantity: 1,
                rating: 5,
              },
            ],
            status: "Delivered",
            deliveryDate: "October 27, 2025",
          },
        },
      ];

      setOrders(mockOrders);
      setLoading(false);
      console.log("✅ Demo orders loaded successfully");
    }, 1500); // 1.5 second delay to simulate loading

    return () => clearTimeout(timer);
  }, [user]); // Re-run if user changes

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={classes.orders}>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.loading}>
            <div className={classes.spinner}></div>
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
            background: "#e8f5e8",
            border: "2px solid #4caf50",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#2e7d32",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            🎓 SCHOOL PROJECT DEMO: Showing mock order data. In a real
            application, this would connect to your live order database.
          </p>
        </div>

        <div className={classes.orders_order}>
          {orders.length === 0 ? (
            <div className={classes.no_orders}>
              <h2>You have no orders yet</h2>
              <p>Your orders will appear here after you make purchases.</p>
              <button
                onClick={() => (window.location.href = "/")}
                className={classes.shop_button}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className={classes.orders_list}>
              <h2 className={classes.orders_count}>
                {orders.length} order{orders.length !== 1 ? "s" : ""} placed
              </h2>

              {orders?.map((order, index) => (
                <div key={order.id} className={classes.order}>
                  <div className={classes.order_header}>
                    <div className={classes.order_meta}>
                      <div className={classes.meta_item}>
                        <span className={classes.meta_label}>ORDER PLACED</span>
                        <span className={classes.meta_value}>
                          {formatDate(order.data.created)}
                        </span>
                      </div>
                      <div className={classes.meta_item}>
                        <span className={classes.meta_label}>TOTAL</span>
                        <span className={classes.meta_value}>
                          {formatCurrency(order.data.amount)}
                        </span>
                      </div>
                      <div className={classes.meta_item}>
                        <span className={classes.meta_label}>SHIP TO</span>
                        <span className={classes.meta_value}>
                          {user?.displayName || "Demo Student"}
                        </span>
                      </div>
                    </div>
                    <div className={classes.order_id}>
                      <span className={classes.meta_label}>ORDER #</span>
                      <span className={classes.meta_value}>
                        {order.id.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className={classes.order_status}>
                    <div
                      className={
                        classes.status_badge +
                        " " +
                        (order.data.status === "Delivered"
                          ? classes.delivered
                          : classes.shipped)
                      }
                    >
                      {order.data.status}
                    </div>
                    <div className={classes.delivery_info}>
                      <strong>
                        Delivery {order.data.status.toLowerCase()}:
                      </strong>{" "}
                      {order.data.deliveryDate}
                    </div>
                  </div>

                  <div className={classes.order_items}>
                    {order.data.basket.map((item) => (
                      <div key={item.id} className={classes.order_item}>
                        <div className={classes.item_image}>
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className={classes.item_info}>
                          <h4 className={classes.item_title}>{item.title}</h4>
                          <div className={classes.item_rating}>
                            {"⭐".repeat(item.rating)}
                          </div>
                          <div className={classes.item_details}>
                            <span className={classes.item_price}>
                              {formatCurrency(item.price)}
                            </span>
                            <span className={classes.item_quantity}>
                              Qty: {item.quantity}
                            </span>
                            <span className={classes.item_subtotal}>
                              Subtotal:{" "}
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                        <div className={classes.item_actions}>
                          <button className={classes.action_button}>
                            Buy it again
                          </button>
                          <button className={classes.action_button}>
                            View your item
                          </button>
                          <button className={classes.action_button}>
                            Write a product review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={classes.order_actions}>
                    <button className={classes.primary_button}>
                      Track package
                    </button>
                    <button className={classes.secondary_button}>
                      Leave seller feedback
                    </button>
                    <button className={classes.secondary_button}>
                      Archive order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
