import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/Axios.js";
import { Type } from "../../Utility/action.type";
import { db } from "../../Utility/firebase.js";
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { axiosInstance } from "../../Api/Axios.js";

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

   if (!stripe || !elements) {
     setCardError("Stripe not loaded yet");
     return;
   }

   setProcessing(true);
   setCardError(null);

   try {
     // 1. Create payment intent with backend
     console.log("💳 Creating payment intent for amount:", total * 100);

     const response = await axiosInstance.post(
       "/payment/create",
       {
         total: total * 100, // Convert to cents
         userId: user.uid,
       },
       {
         params: { total: total * 100 },
       }
     );

     const clientSecret = response.data.clientSecret;
     console.log("✅ Payment intent created, clientSecret received");

     // 2. Confirm payment with Stripe
     const { error: stripeError, paymentIntent } =
       await stripe.confirmCardPayment(clientSecret, {
         payment_method: {
           card: elements.getElement(CardElement),
           billing_details: {
             name: user.displayName || "Customer",
             email: user.email,
           },
         },
       });

     if (stripeError) {
       throw new Error(stripeError.message);
     }

     // 3. If payment successful, save to Firebase
     if (paymentIntent?.status === "succeeded") {
       console.log("✅ Payment succeeded:", paymentIntent.id);

       const orderId = paymentIntent.id;
       const orderData = {
         id: orderId,
         basket: basket,
         amount: paymentIntent.amount,
         total: total,
         created: new Date(),
         status: "completed",
         userId: user.uid,
         email: user.email,
         stripe_payment_intent: paymentIntent.id,
         shipping_address: {
           email: user.email,
           address: "123 React Lane",
           city: "Frederick",
           state: "MD",
           zip: "21701",
         },
       };

       // Save to Firebase
       await setDoc(doc(db, "users", user.uid, "orders", orderId), orderData);

       console.log(
         "✅ Order saved to Firebase with Stripe payment ID:",
         orderId
       );

       // Clear basket and navigate
       dispatch({ type: Type.EMPTY_BASKET });
       setSuccess(true);

       setTimeout(() => {
         navigate("/orders", {
           state: {
             msg: "🎉 Order placed successfully with real payment!",
             orderId: orderId,
           },
         });
       }, 1500);
     }
   } catch (error) {
     console.error("❌ Payment error:", error);
     setCardError("Payment failed: " + error.message);
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
