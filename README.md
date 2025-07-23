
# Stripe Payment Practice Project

This is a basic Node.js + MongoDB project to practice Stripe payment integration. It includes both **checkout** and **subscription** flows, and saves transaction data in MongoDB for further use.

---

## 🔧 Features

- 🔐 User creation only (authentication to be done soon).
- 💳 Stripe Checkout integration.
- 🔁 Stripe Subscription flow.
- 🗃️ MongoDB used to store user and transaction data.
- 📁 Organized models for users, payments, and subscriptions.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AliAbbas2105/Stripe-Payment-Practice.git
cd Stripe-Payment-Practice
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up `.env` file
Create a `.env` file in the root directory with the following:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_product_price_id
SERVER_URL=your_server_url (http://localhost:3000)
```
You can find your secret key and price id in the [Stripe Developer Dashboard](https://dashboard.stripe.com/test/apikeys).

### 4. Start the server
```bash
npm start
```

---

## 📌 Stripe Setup

1. Go to the **Stripe Developer Dashboard**.
2. Under **Product Catalog**, create a product and set a recurring monthly/custom price.
3. Note the **Price ID**, which will be used to subscribe users.

---

## 💡 How It Works

### User Flow:
1. User signs up (data saved in **User** model).
2. User logins and userId is returned.
3. The user is assigned a **customer ID** on Stripe.
4. User can make a **one-time checkout** or a **recurring subscription**.

### Database Models:
- **User model** stores user info.
- **Payment model** stores one-time payment transactions.
- **Subscription model** stores subscription details.

---

## 📊 Admin Insights (Stripe Dashboard)
After a successful subscription:
- Admin can visit the Stripe Dashboard to view users’ **transaction history**.
- View all **subscriptions and invoices** there.

---

## 🛠 Tools Used
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Stripe API**

---

## 📬 API Testing
You can test endpoints using **Postman** or any API client.

---

## 📌 Notes

- This is my first project focusing on Stripe Payment, so there might be some loopholes in it.

---

## 📄 License
This project is open for learning and practice purposes.
