// import React,{useContext,useState} from 'react'
// import classes from './Payment.module.css'
// import LayOut from '../../Components/LayOut/LayOut'
// import { DataContext } from '../../Components/DataProvider/DataProvider'
// import ProductCard from '../../Components/Product/ProductCard'
// import {useElements,useStripe,CardElement } from '@stripe/react-stripe-js';
// import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat'
// import { axiosInstance } from "../../Api/Axios.js"; 




// function Payment() {

//   const [{user,basket}]= useContext(DataContext)
//   console.log(user)

//   const totalItems = basket?.reduce((amount,item)=> {
//   return item.amount + amount
// },0)

//   const total = basket.reduce((amount,item)=>{
//     return item.price * item.amount + amount
//   },0)

// const [cardError,setCardError] = useState(null)

// const stripe = useStripe () 
//   const elements = useElements();

//   const handleChange = (e) => {
//     console.log(e)
//     e?.error?.message ? setCardError(e?.error?.message) : setCardError("")
//   }
//   const handlePayment = async (e)=>{
//     e.preventDefault()

//     try{
//          //1, backend || function ----contact to the client-secrete
//       const response = await axiosInstance({
//         method:"POST",
//         url:`/payment/create?total=${total *100}`
//       })
//       console.log(response.data)
//   const clientSecret = response.data?.clientSecret;

//   //2, clint side (react side confirmation)
//   const confirmation = await stripe.confirmCardPayment(
//     clientSecret,
//     {
//       payment_method: {
//         card: elements.getElement(CardElement),
//       },
//     }
//   );
//   console.log(confirmation);

//   //3, after confirmation ...> order firebase database save & clear the store
// } catch (error) {
//   // Optionally handle error here
// }
 

//   return (
//     <LayOut>
//       {/* header */}
//       <div className={classes.payment_header}>checkout({totalItems}) items</div>

//       {/* payment */}

//       <section className={classes.payment}>
// {/* address */}

// <div className={classes.flex}>
//   <h3>Delivery Address</h3>
// <div>
//   <div>{user?.email}</div>
//   <div>123 React Lane</div>
//   <div>Frederick, MD 21701</div>

// </div>
// </div>
// <hr />
// {/* product */}

// <div className={classes.flex}>
//   <h3>Review items and delivery</h3>
//   <div>

//     {
//       basket?.map((item)=><ProductCard product={item} flex={true}/>)

//     }
//   </div>

// </div>
// <hr />
// {/* card form */}

// <div className={classes.flex}>
//   <h3>Payment Method</h3>
//   <div className={classes.payment_card_container}>
//     <div className={classes.payment_details}>
//       <form onSubmit={handlePayment}>
//         {/* error */}
//         {cardError && <small style={{color: "red"}}>{cardError}</small>}
//           {/* card element */}
//         <CardElement onChange={handleChange}/>
//         {/* price */}
//         <div className={classes.payment_price}>
//           <div>
//             <span >
//              <p>Order Total:</p>  <CurrencyFormat amount={total} />
//             </span>
//           </div>
//           <button type="submit">Pay Now</button>
//         </div>
//       </form>
//     </div>
//   </div>
//   </div>

//       </section>
//     </LayOut>
    
//   )
// }

// export default Payment;

import React, { useContext, useState } from 'react';
import classes from './Payment.module.css';
import LayOut from '../../Components/LayOut/LayOut';
import { DataContext } from '../../Components/DataProvider/DataProvider';
import ProductCard from '../../Components/Product/ProductCard';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat';
import { axiosInstance } from "../../Api/Axios.js";
import { Type } from "../../Utility/action.type"; // ✅ added
import {db} from "../../Utility/Firebase"
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext); // ✅ added dispatch
  console.log(user);

  const totalItems = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate()

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setCardError(null);

    try {
      // 1. Ask backend for client secret
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });
      const clientSecret = response.data?.clientSecret;

     //client side
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
  },
});

const paymentIntent = confirmation.paymentIntent; 

if (paymentIntent?.status === "succeeded") {
  setSuccess(true);

  await db
    .collection("users")     
    .doc(user.uid)
    .collection("orders")
    .doc(paymentIntent.id)
    .set({
      basket: basket,
      amount: paymentIntent.amount,
      created: paymentIntent.created,
    });

  // Clear basket after success
  dispatch({ type: Type.EMPTY_BASKET });
}
 navigate("/orders", { state: { msg: "you have placed new order" } })
    } catch (error) {
      setCardError(error.message || "Something went wrong with payment.");
    }
  
   setProcessing(false);
  };

  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment_header}>
        checkout ({totalItems}) items
      </div>

      {/* payment */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Frederick, MD 21701</div>
          </div>
        </div>
        <hr />

        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
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
                {cardError && <small style={{ color: "red" }}>{cardError}</small>}
                {/* card element */}
                <CardElement onChange={handleChange} />
                {/* price */}
                <div className={classes.payment_price}>
                  <div>
                    <span>
                      <p>Order Total:</p> <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing || success}>
                    {processing ? "Processing..." : success ? "Paid" : "Pay Now"}
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

