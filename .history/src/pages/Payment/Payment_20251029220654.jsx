// import { useContext, useState } from "react";
// import classes from "./Payment.module.css";
// import LayOut from "../../Components/LayOut/LayOut";
// import { DataContext } from "../../Components/DataProvider/DataProvider";
// import ProductCard from "../../Components/Product/ProductCard";
// import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
// import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
// import { Type } from "../../Utility/action.type";
// import { db } from "../../Utility/firebase.js";
// import { useNavigate } from "react-router-dom";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// function Payment() {
//   const [{ user, basket }, dispatch] = useContext(DataContext);

//   // ✅ Better logging to debug user object
//   console.log("User object:", user);
//   console.log("User UID:", user?.uid);
//   console.log("User email:", user?.email);

//   // ✅ Safe calculation for empty basket
//   const totalItems =
//     basket?.reduce((amount, item) => {
//       return (item.amount || 0) + amount;
//     }, 0) || 0;

//   const total =
//     basket?.reduce((amount, item) => {
//       return (item.price || 0) * (item.amount || 0) + amount;
//     }, 0) || 0;

//   const [cardError, setCardError] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
//   };
//   const handlePayment = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       setCardError("Stripe not loaded yet");
//       return;
//     }

//     if (!basket || basket.length === 0) {
//       setCardError("Your basket is empty");
//       return;
//     }

//     if (!user || !user.uid) {
//       setCardError("Please sign in to complete payment");
//       return;
//     }

//     setProcessing(true);
//     setCardError(null);

//     try {
//       console.log("💳 Using MOCK payment (backend returning 'hello world')");

//       // ✅ MOCK PAYMENT - Backend is not returning proper JSON
//       const mockPayment = {
//         paymentIntentId: `pi_mock_${Date.now()}`,
//         clientSecret: `cs_mock_${Date.now()}`,
//         amount: total * 100,
//         status: "succeeded",
//         mock: true,
//       };

//       console.log("✅ Mock payment created:", mockPayment);

//       // Create order data
//       const orderData = {
//         id: mockPayment.paymentIntentId,
//         basket: basket,
//         items: basket.map((item) => ({
//           id: item.id,
//           title: item.title,
//           price: item.price,
//           amount: item.amount,
//           image: item.image,
//         })),
//         amount: total * 100,
//         total: total,
//         created: serverTimestamp(),
//         status: "paid",
//         userId: user.uid,
//         email: user.email,
//         stripe_payment_intent: mockPayment.paymentIntentId,
//         payment_method: "mock_development",
//         shipping_address: {
//           email: user.email,
//           address: "123 React Lane",
//           city: "Frederick",
//           state: "MD",
//           zip: "21701",
//         },
//       };

//       console.log("📦 Saving order to Firestore...");

//       // Save to Firestore
//       await setDoc(
//         doc(db, "users", user.uid, "orders", mockPayment.paymentIntentId),
//         orderData
//       );

//       console.log("✅ Order saved to Firestore");

//       // Clear basket and show success
//       dispatch({ type: Type.EMPTY_BASKET });
//       setSuccess(true);

//       setTimeout(() => {
//         navigate("/orders", {
//           state: {
//             msg: "🎉 Order placed successfully! (Development Mode)",
//             orderId: mockPayment.paymentIntentId,
//           },
//         });
//       }, 1500);
//     } catch (error) {
//       console.error("❌ Payment error:", error);
//       setCardError("Payment failed: " + error.message);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ✅ Early return if no basket
//   if (!basket || basket.length === 0) {
//     return (
//       <LayOut>
//         <div className={classes.payment_header}>Your basket is empty</div>
//       </LayOut>
//     );
//   }

//   return (
//     <LayOut>
//       {/* header */}
//       <div className={classes.payment_header}>
//         Checkout ({totalItems}) items
//       </div>

//       {/* payment */}
//       <section className={classes.payment}>
//         {/* address */}
//         <div className={classes.flex}>
//           <h3>Delivery Address</h3>
//           <div>
//             <div>{user?.email || "No email available"}</div>
//             <div>123 React Lane</div>
//             <div>Frederick, MD 21701</div>
//           </div>
//         </div>
//         <hr />

//         {/* product */}
//         <div className={classes.flex}>
//           <h3>Review items and delivery</h3>
//           <div>
//             {basket.map((item) => (
//               <ProductCard key={item.id} product={item} flex={true} />
//             ))}
//           </div>
//         </div>
//         <hr />

//         {/* card form */}
//         <div className={classes.flex}>
//           <h3>Payment Method</h3>
//           <div className={classes.payment_card_container}>
//             <div className={classes.payment_details}>
//               <form onSubmit={handlePayment}>
//                 {/* error */}
//                 {cardError && (
//                   <div style={{ color: "red", marginBottom: "10px" }}>
//                     <strong>Error:</strong> {cardError}
//                   </div>
//                 )}

//                 {/* card element */}
//                 <CardElement onChange={handleChange} />

//                 {/* price */}
//                 <div className={classes.payment_price}>
//                   <div>
//                     <span>
//                       <p>Order Total:</p>
//                       <CurrencyFormat amount={total} />
//                     </span>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={processing || success || !stripe}
//                     style={{
//                       opacity: processing || success || !stripe ? 0.6 : 1,
//                     }}
//                   >
//                     {processing
//                       ? "Processing..."
//                       : success
//                       ? "Paid"
//                       : `Pay Now - ${total}`}
//                   </button>
//                 </div>

//                 {/* Development note */}
//                 <div
//                   style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}
//                 >
//                   💡 Development Mode: Mock payment (no real charge)
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </LayOut>
//   );
// }

// export default Payment;


import React, { useState, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { DataContext } from "../DataProvider/DataProvider";
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

  // ✅ DEMO MODE: Simplified payment handler
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      console.log("🚀 DEMO MODE: Processing payment...");

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
  const totalAmount = basket?.reduce((amount, item) => {
    return amount + item.price * item.quantity;
  }, 0);

  return (
    <div className={classes.payment}>
      <div className={classes.payment_container}>
        <h1>Checkout ({basket?.length} items)</h1>

        {/* Delivery Address */}
        <div className={classes.payment_section}>
          <div className={classes.payment_title}>
            <h3>Delivery Address</h3>
          </div>
          <div className={classes.payment_address}>
            <p>{user?.email}</p>
            <p>123 Demo Street</p>
            <p>Demo City, DC 12345</p>
          </div>
        </div>

        {/* Review Items */}
        <div className={classes.payment_section}>
          <div className={classes.payment_title}>
            <h3>Review items and delivery</h3>
          </div>
          <div className={classes.payment_items}>
            {basket?.map((item) => (
              <div key={item.id} className={classes.payment_item}>
                <img src={item.image} alt={item.title} />
                <div className={classes.payment_itemInfo}>
                  <h4>{item.title}</h4>
                  <p>${item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
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
              />

              {cardError && (
                <div className={classes.payment_error}>{cardError}</div>
              )}

              <div className={classes.payment_priceContainer}>
                <h3>Order Total: ${totalAmount?.toFixed(2)}</h3>
                <button
                  type="submit"
                  disabled={!stripe || processing || basket.length === 0}
                  className={classes.payment_button}
                >
                  {processing ? "Processing..." : `Buy Now`}
                </button>
              </div>

              {/* Demo Notice */}
              <div
                style={{
                  background: "#fff3cd",
                  border: "1px solid #ffeaa7",
                  borderRadius: "5px",
                  padding: "10px",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
                  <strong>Demo Mode:</strong> No real payment will be processed.
                  This is for school project demonstration only.
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