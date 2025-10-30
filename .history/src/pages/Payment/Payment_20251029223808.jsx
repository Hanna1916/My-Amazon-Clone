import React, { useState, useContext, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { useNavigate } from "react-router-dom";
import classes from "./Payment.module.css";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  console.log("User object:", user);
  console.log("Basket items:", basket?.length);

  // ✅ AUTO-CREATE DEMO USER if null
  useEffect(() => {
    if (!user) {
      console.log("🚀 Creating demo user for payment...");
      const demoUser = {
        email: "demo@student.com",
        displayName: "Demo Student",
        uid: "demo-uid-" + Date.now(),
      };

      // You'll need to import your dispatch action type
      dispatch({
        type: "SET_USER", // Make sure this matches your action type
        user: demoUser,
      });
    }
  }, [user, dispatch]);

  // ✅ DEMO MODE: Simplified payment handler
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      console.log("❌ No user found, creating demo user...");
      const demoUser = {
        email: "demo@student.com",
        displayName: "Demo Student",
        uid: "demo-uid-" + Date.now(),
      };

      dispatch({
        type: "SET_USER",
        user: demoUser,
      });

      // Wait a moment for user to be set
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setProcessing(true);

    try {
      console.log("🚀 DEMO MODE: Processing payment...");
      console.log("User for order:", user?.email || "demo@student.com");

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ✅ SUCCESS: Clear cart and redirect
      dispatch({
        type: Type.EMPTY_BASKET,
      });

      console.log("✅ Demo payment successful!");

      // Redirect to orders page with success message
      navigate("/orders", {
        state: {
          msg: "🎉 Order placed successfully! This is a demo - no real payment was processed.",
        },
        replace: true,
      });
    } catch (error) {
      console.error("❌ Demo payment error:", error);
      setCardError("Demo payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Calculate total amount
  const totalAmount =
    basket?.reduce((amount, item) => {
      return amount + item.price * item.quantity;
    }, 0) || 0;

  // Get user email for display
  const userEmail = user?.email || "demo@student.com";
  const userName = user?.displayName || "Demo Student";

  return (
    <div className={classes.payment}>
      <div className={classes.payment_container}>
        <h1>Checkout ({basket?.length || 0} items)</h1>

        {/* Demo Notice */}
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
            <strong>🎓 SCHOOL PROJECT DEMO:</strong> No real payment will be
            processed. This is for demonstration purposes only.
          </p>
        </div>

        {/* Delivery Address */}
        <div className={classes.payment_section}>
          <div className={classes.payment_title}>
            <h3>Delivery Address</h3>
          </div>
          <div className={classes.payment_address}>
            <p>
              <strong>{userName}</strong>
            </p>
            <p>{userEmail}</p>
            <p>123 Demo Street</p>
            <p>Demo City, DC 12345</p>
            <p>United States</p>
          </div>
        </div>

        {/* Review Items */}
        <div className={classes.payment_section}>
          <div className={classes.payment_title}>
            <h3>Review items and delivery</h3>
          </div>
          <div className={classes.payment_items}>
            {basket && basket.length > 0 ? (
              basket.map((item) => (
                <div key={item.id} className={classes.payment_item}>
                  <img src={item.image} alt={item.title} />
                  <div className={classes.payment_itemInfo}>
                    <h4>{item.title}</h4>
                    <p>${item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className={classes.payment_section}>
          <div className={classes.payment_title}>
            <h3>Payment Method</h3>
          </div>
          <div className={classes.payment_details}>
            <form onSubmit={handlePayment}>
              <CardElement
                onChange={(e) => setCardError(e.error?.message || "")}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                  },
                }}
              />

              {cardError && (
                <div className={classes.payment_error}>{cardError}</div>
              )}

              <div className={classes.payment_priceContainer}>
                <h3>Order Total: ${totalAmount.toFixed(2)}</h3>
                <button
                  type="submit"
                  disabled={
                    !stripe || processing || !basket || basket.length === 0
                  }
                  className={classes.payment_button}
                >
                  {processing ? "Processing..." : `Buy Now`}
                </button>
              </div>

              <div
                style={{
                  background: "#e8f5e8",
                  border: "1px solid #c3e6cb",
                  borderRadius: "5px",
                  padding: "10px",
                  marginTop: "15px",
                }}
              >
                <p style={{ margin: 0, color: "#155724", fontSize: "12px" }}>
                  <strong>Test Card:</strong> Use any card number for demo
                  (e.g., 4242 4242 4242 4242)
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
