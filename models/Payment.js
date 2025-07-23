const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amountPaid: {
    type: Number, // in cents
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("Payment", paymentSchema)
