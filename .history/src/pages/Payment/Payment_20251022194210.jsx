import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/Axios.js";
import { Type } from "../../Utility/action.type";
import { db } from "../../Utility/Firebase.js";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);

  // ✅ Better logging to debug user object
  console.log("User object:", user);
  console.log("User UID:", user?.uid);
  console.log("User email:", user?.email);

  // ✅ Safe calculation for empty basket
  const totalItems =
    basket?.reduce((amount, item) => {
      return (item.amount || 0) + amount;
    }, 0) || 0;

  const total =
    basket?.reduce((amount, item) => {
      return (item.price || 0) * (item.amount || 0) + amount;
    }, 0) || 0;

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

 const handlePayment = async (e) => {
   e.preventDefault();

   console.log("🔍 DEBUG: Starting payment process...");
   console.log("🔍 DEBUG: db object:", db);
   console.log("🔍 DEBUG: db type:", typeof db);
   console.log("🔍 DEBUG: db.collection:", db?.collection);
   console.log("🔍 DEBUG: user.uid:", user?.uid);

   if (!stripe || !elements) {
     setCardError("Stripe not loaded yet");
     return;
   }

   if (basket?.length === 0) {
     setCardError("Your basket is empty");
     return;
   }

   setProcessing(true);
   setCardError(null);

   try {
     // If db is not properly initialized, use localStorage as fallback
     if (!db || typeof db.collection !== "function") {
       console.warn("❌ Firestore not available, using localStorage fallback");

       const orderId = `local_order_${Date.now()}`;
       const orderData = {
         basket: basket,
         amount: total * 100,
         created: Date.now(),
         status: "completed",
         orderId: orderId,
         userId: user.uid,
         email: user.email,
       };

       // Save to localStorage
       const existingOrders = JSON.parse(
         localStorage.getItem("user_orders") || "{}"
       );
       existingOrders[orderId] = orderData;
       localStorage.setItem("user_orders", JSON.stringify(existingOrders));

       console.log("✅ Order saved to localStorage:", orderId);
     } else {
       // Use Firestore (the normal way)
       console.log("✅ Using Firestore for order storage");
       const orderId = `order_${Date.now()}`;

       await db
         .collection("users")
         .doc(user.uid)
         .collection("orders")
         .doc(orderId)
         .set({
           basket: basket,
           amount: total * 100,
           created: Date.now(),
           status: "completed",
           orderId: orderId,
           email: user.email,
           items: basket.map((item) => ({
             id: item.id,
             title: item.title,
             price: item.price,
             amount: item.amount,
             image: item.image,
           })),
         });

       console.log("✅ Order saved to Firestore:", orderId);
     }

     // Clear basket and show success
     dispatch({ type: Type.EMPTY_BASKET });
     setSuccess(true);

     setTimeout(() => {
       navigate("/orders", {
         state: {
           msg: "🎉 Order placed successfully!",
           isDevMode: true,
         },
       });
     }, 1000);
   } catch (error) {
     console.error("❌ Payment error:", error);
     setCardError("Order processing failed. Please try again.");
   } finally {
     setProcessing(false);
   }
 };

  // ✅ Early return if no basket
  if (!basket || basket.length === 0) {
    return (
      <LayOut>
        <div className={classes.payment_header}>Your basket is empty</div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment_header}>
        Checkout ({totalItems}) items
      </div>

      {/* payment */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email || "No email available"}</div>
            <div>123 React Lane</div>
            <div>Frederick, MD 21701</div>
          </div>
        </div>
        <hr />

        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment Method</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment_details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {cardError && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    <strong>Error:</strong> {cardError}
                  </div>
                )}

                {/* card element */}
                <CardElement onChange={handleChange} />

                {/* price */}
                <div className={classes.payment_price}>
                  <div>
                    <span>
                      <p>Order Total:</p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={processing || success || !stripe}
                    style={{
                      opacity: processing || success || !stripe ? 0.6 : 1,
                    }}
                  >
                    {processing
                      ? "Processing..."
                      : success
                      ? "Paid"
                      : `Pay Now - ${total}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
