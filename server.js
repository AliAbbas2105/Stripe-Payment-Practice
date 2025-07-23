const express = require("express")
const mongoose = require("mongoose")
const app = express()
require("dotenv").config()

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Payment = require("./models/Payment")
const User = require("./models/User")
const Subscription = require("./models/Subscription")


app.use(express.json())
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('Connected to MongoDB');
        })
        .catch((error)=>{
            console.error('MongoDB connection error:', error);
        })

app.post("/signup", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    res.status(201).json({ message: "User created", userId: user._id })
  } catch (err) {
    res.status(400).json({ message: "Signup failed", error: err.message })
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email, password })
    if (!user) return res.status(401).json({ message: "Invalid credentials" })

    res.status(200).json({ message: "Login successful", userId: user._id })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
})

app.post("/create-checkout-session", async (req, res) => {
  const { userId } = req.body
  const dummyAmount=5000 // $50 in cents
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Dummy Test Product" },
            unit_amount: dummyAmount, 
          },
          quantity: 1,
        }
      ],
      metadata: { userId },
      success_url: `${process.env.SERVER_URL}/successCheckout?userId=${userId}&amount=${dummyAmount}`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    })

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/successCheckout", async (req, res) => {
  const { userId, amount } = req.query

  try {
    await Payment.create({
      userId,
      amountPaid: parseInt(amount),
    })
    res.send(`<h2>Payment of $${amount / 100} saved for user ${userId}</h2>`)
  } catch (err) {
    res.status(500).send("❌ Failed to save payment")
  }
})

// Create Customer
app.post("/create-customer", async (req, res) => {
  const { userId } = req.body
  const user = await User.findById(userId);
  if (!user) 
    return res.status(404).json({ message: "User not found" });

  try {
    const customer = await stripe.customers.create({
      email:user.email
    })

    res.json({ customerId: customer.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create Subscription
app.post("/subscribe", async (req, res) => {
  const { customerId } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        }
      ],
      success_url: `${process.env.SERVER_URL}/successSubscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    })

    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/successSubscription', async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['customer', 'subscription']});

    const customerId = session.customer.id;
    const email = session.customer.email;
    const amount = session.amount_total //see at the end for details

    if (!email) {
      return res.status(400).json({ error: 'Customer email not found in session.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User with this email not found' });
    }
    //saving to DB
    await Subscription.create({
      userId: user._id,
      stripeCustomerId: customerId,
      subscriptionType: 'Pro',
      amount,
    });

    res.send(`<h2>Subscription successful for ${email}</h2><p>Data stored to DB also.</p>`);
  } catch (err) {
    console.error("ERROR CONFIRMING SUBSCRIPTION:", err);
    res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

// When session.amount_total is useful:
// When you just want to record what the customer paid at checkout.
// Works for both one-time and subscription checkouts, if there's a successful payment.

// 🔍 When session.subscription.plan.amount is better:
// When you want to store actual subscription plan details (like price, billing interval).
// More robust and future-proof for recurring logic or invoices.
// Ensures you're tied to the Stripe product/price settings — not just what happened at checkout.