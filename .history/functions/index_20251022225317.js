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
