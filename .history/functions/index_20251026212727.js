// // const express = require("express");
// // const cors = require("cors");
// // const Stripe = require("stripe");
// // require("dotenv").config();

// // const app = express();
// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // app.use(cors());
// // app.use(express.json());

// // // Create payment intent
// // app.post("/payment/create", async (req, res) => {
// //   const { total } = req.query;

// //   try {
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: parseInt(total), // amount in cents
// //       currency: "usd",
// //       metadata: {
// //         userId: req.body.userId || "test-user",
// //       },
// //     });

// //     res.json({
// //       clientSecret: paymentIntent.client_secret,
// //     });
// //   } catch (error) {
// //     console.error("Stripe error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const Stripe = require("stripe");

// // Initialize Firebase Admin
// admin.initializeApp();

// // Initialize Stripe with your test key
// const stripe = new Stripe(
//   "sk_test_51SB2Y88Rswsty7NihCq4hsc1hqQlArRwOhXvibHN4NfJsBUQcxg8qBSP4wGS52fuyQUnIQS8AW75zDhASAcjGvbU00iySrAC6j"
// );

// exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
//   // ✅ PROPER CORS HANDLING
//   res.set("Access-Control-Allow-Origin", "*");

//   if (req.method === "OPTIONS") {
//     // Send response to OPTIONS requests
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.set("Access-Control-Allow-Headers", "Content-Type");
//     res.status(204).send("");
//     return;
//   }

//   // Only allow POST requests
//   if (req.method !== "POST") {
//     return res.status(405).send("Method Not Allowed");
//   }

//   try {
//     const { total, userId } = req.body;

//     console.log(
//       "💰 Creating payment intent for amount:",
//       total,
//       "User:",
//       userId
//     );

//     // Validate input
//     if (!total || total < 50) {
//       return res.status(400).json({ error: "Invalid amount" });
//     }

//     // Create payment intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(total), // Amount in cents
//       currency: "usd",
//       metadata: {
//         userId: userId || "unknown",
//         firebaseProject: "clone-ba7d6",
//       },
//     });

//     console.log("✅ Payment intent created:", paymentIntent.id);

//     // Return client secret to frontend
//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//       amount: total,
//     });
//   } catch (error) {
//     console.error("❌ Stripe error:", error);
//     res.status(500).json({
//       error: error.message,
//       code: error.code,
//     });
//   }
// });

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();

// CORS configuration - allow all origins for now
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  })
);

app.use(express.json());

// Initialize Stripe with your test key
const stripe = new Stripe(
  process.env.STRIPE_KEY ||
    "sk_test_51SBQKEFmGJBKU2O1JsVXKh0gCcLtcG3QN5HFfqXWnW9p4XfKFBUVKbsk4v0fIl1qsPt1cuCx8tjJP4mmQlnBKAwK00zjxDypQ6"
);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "🛒 Amazon Clone Backend is running on Render!",
    status: "active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Create payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, userId, email } = req.body;

    console.log("💰 Payment request:", { amount, userId, email });

    // Validate input
    if (!amount || amount < 50) {
      return res.status(400).json({
        error: "Invalid amount. Minimum amount is $0.50",
        received: amount,
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: "usd",
      metadata: {
        userId: userId || "unknown",
        email: email || "unknown",
        deployed_on: "render",
      },
      // For testing, you can add automatic confirmation
      capture_method: "automatic",
    });

    console.log("✅ Payment intent created:", paymentIntent.id);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      status: "created",
    });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
});

// Mock payment endpoint for development
app.post("/api/create-mock-payment", async (req, res) => {
  try {
    const { amount, userId, email } = req.body;

    console.log("🔄 Mock payment request:", { amount, userId, email });

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockPayment = {
      success: true,
      clientSecret: `cs_mock_${Date.now()}`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      amount: amount,
      status: "succeeded",
      mock: true,
      message: "Mock payment processed successfully - no real charge",
    };

    res.json(mockPayment);
  } catch (error) {
    console.error("❌ Mock payment error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Order confirmation endpoint
app.post("/api/confirm-order", async (req, res) => {
  try {
    const { orderId, paymentIntentId, amount } = req.body;

    console.log("✅ Order confirmation:", { orderId, paymentIntentId, amount });

    res.json({
      success: true,
      orderId: orderId,
      paymentIntentId: paymentIntentId,
      message: "Order confirmed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Order confirmation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Amazon Clone Backend running on port ${PORT}`);
  console.log(
    `💳 Stripe integration: ${process.env.STRIPE_KEY ? "Live" : "Test mode"}`
  );
});