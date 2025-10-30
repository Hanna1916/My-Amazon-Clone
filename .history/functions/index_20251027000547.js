const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Initialize Stripe
const stripe = new Stripe(
  process.env.STRIPE_KEY
);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "🛒 Amazon Clone Backend is running on Render!",
    status: "active",
  });
});

// ✅ PAYMENT ENDPOINT - Make sure this exists
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
