import { useContext, useState } from "react";
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
import { doc, setDoc } from "firebase/firestore";

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

    if (basket?.length === 0) {
      setCardError("Your basket is empty");
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      console.log("💳 Processing payment for amount:", total * 100);
      console.log("🔧 Using mock payment (Firebase Functions not available)");

      // ✅ COMPLETE MOCK PAYMENT - No backend required
      const paymentIntentId = `pi_mock_${Date.now()}`;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order data
      const orderData = {
        id: paymentIntentId,
        basket: basket,
        items: basket.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          amount: item.amount,
          image: item.image,
        })),
        amount: total * 100,
        total: total,
        created: new Date(),
        status: "paid",
        userId: user.uid,
        email: user.email,
        stripe_payment_intent: paymentIntentId,
        dev_note: "Mock payment - Firebase Functions not available",
        shipping_address: {
          email: user.email,
          address: "123 React Lane",
          city: "Frederick",
          state: "MD",
          zip: "21701",
        },
      };

      console.log("✅ Mock payment processed:", paymentIntentId);

      // Save to Firebase Firestore
      await setDoc(
        doc(db, "users", user.uid, "orders", paymentIntentId),
        orderData
      );

      console.log("✅ Order saved to Firestore");

      // Clear basket
      dispatch({ type: Type.EMPTY_BASKET });
      setSuccess(true);

      // Navigate to orders
      setTimeout(() => {
        navigate("/orders", {
          state: {
            msg: "🎉 Order placed successfully! (Development Mode)",
            orderId: paymentIntentId,
          },
        });
      }, 1500);
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
