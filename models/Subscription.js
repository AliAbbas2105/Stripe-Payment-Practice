// models/Subscription.js
const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  subscriptionType: {
    type: String,
    required: true,
    enum: ["Basic", "Pro", "Enterprise"],
    default: "Pro"
  },
  amount: {
    type: Number, // in cents
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("Subscription", subscriptionSchema)
