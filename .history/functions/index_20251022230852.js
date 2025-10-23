// const express = require("express");
// const cors = require("cors");
// const Stripe = require("stripe");
// require("dotenv").config();

// const app = express();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// app.use(cors());
// app.use(express.json());

// // Create payment intent
// app.post("/payment/create", async (req, res) => {
//   const { total } = req.query;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: parseInt(total), // amount in cents
//       currency: "usd",
//       metadata: {
//         userId: req.body.userId || "test-user",
//       },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with your test key
const stripe = new Stripe(
  "sk_test_51SB2Y88Rswsty7NihCq4hsc1hqQlArRwOhXvibHN4NfJsBUQcxg8qBSP4wGS52fuyQUnIQS8AW75zDhASAcjGvbU00iySrAC6j"
);

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  // ✅ PROPER CORS HANDLING
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { total, userId } = req.body;

    console.log(
      "💰 Creating payment intent for amount:",
      total,
      "User:",
      userId
    );

    // Validate input
    if (!total || total < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total), // Amount in cents
      currency: "usd",
      metadata: {
        userId: userId || "unknown",
        firebaseProject: "clone-ba7d6",
      },
    });

    console.log("✅ Payment intent created:", paymentIntent.id);

    // Return client secret to frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: total,
    });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({
      error: error.message,
      code: error.code,
    });
  }
});
