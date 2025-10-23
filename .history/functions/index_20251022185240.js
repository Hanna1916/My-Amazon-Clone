
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();
// const stripe = require("stripe")(process.env.STRIPE_KEY);


// const app = express();

// app.use(cors({origin: true}));
// app.use(express.json());

// app.get("/", (req, res) =>{
// res.status(200).json({
//     message: "success"
// })
// });

// app.post("/payment/create", async (req, res) => {
//     const total = parseInt(req.query.total);
//    if(total >0){
//     const paymentsIntent = await stripe.paymentIntents.create({
//         amount: total,
//         currency: "usd",
//    })
  
//   res.status(201).json({
//     clientSecret: paymentsIntent.client_secret,
//   })
  
//    }else{
//      res.status(403).json({
//         message: "total must be greater than 0"
//      })
  
//    }
// });


// exports.api = onRequest(app);



const functions = require("firebase-functions");
const Stripe = require("stripe");
const stripe = Stripe(functions.config().stripe.secret);

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { total } = req.query;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(total),
      currency: "usd",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});
