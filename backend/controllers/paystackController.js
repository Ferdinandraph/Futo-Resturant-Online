const axios = require("axios");
const mysql = require("mysql2"); 
const db = require("../dbconnection");
const { sendVerificationEmail, sendPaymentConfirmationEmail } = require("../brevo")

// Initialize payment
const initializePayment = async (req, res) => {
    const { email, amount, restaurantId, id, orderType, location, quantity, callback_url } = req.body;
    const items = [{ food_item_id: id, quantity, price: amount }];
    console.log("Request Body:", req.body);

    if (!email || !amount || !restaurantId || !orderType || !items || items.length === 0) {
        return res.status(400).json({ error: "Email, amount, restaurant ID, order type, and items are required." });
    }

    try {
        // Fetch the user_id based on the email and role
        const [userRows] = await db.query(
            `SELECT user_id FROM users WHERE email = ? AND role = 'customer'`,
            [email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: "Customer not found." });
        }

        const customerId = userRows[0].user_id;
        console.log("Fetched customer ID:", customerId);

        // Fetch subaccount details
        const [subaccountRows] = await db.query(
            `SELECT subaccount_code FROM payments WHERE restaurant_id = ?`,
            [restaurantId]
        );

        if (subaccountRows.length === 0) {
            return res.status(404).json({ error: "Subaccount for the restaurant not found." });
        }

        const subaccountCode = subaccountRows[0].subaccount_code;

        console.log("Subaccount:", subaccountCode);
        
        // Initialize Paystack payment
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                callback_url,
                email,
                amount: amount * 100, // Convert to kobo
                metadata: { restaurantId, id}, // Add restaurant ID to metadata
                subaccount: subaccountCode, // Include the subaccount code
                bearer_settlement: "account",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Paystack Response:", response.data); // Log the full response from Paystack

        const paymentRef = response.data.data.reference;

        // Insert the order into the database
        const [orderResult] = await db.query(
            `INSERT INTO orders (customer_id, restaurant_id, total, payment_ref, status, order_type, location) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [customerId, restaurantId, amount, paymentRef, "pending", orderType, location]
        );

        const orderId = orderResult.insertId; // Get the inserted order's ID
        console.log(orderId)

        // Insert each item into the order_items table
        const orderItemsPromises = items.map((item) =>
            db.query(
                `INSERT INTO order_items (order_id, food_item_id, quantity, price) 
                VALUES (?, ?, ?, ?)`,
                [orderId, item.food_item_id, item.quantity, item.price]
            )
        );

        // Wait for all order items to be inserted
        await Promise.all(orderItemsPromises);

        res.status(200).json({ authorization_url: response.data.data.authorization_url });
    } catch (error) {
        console.error("Error initializing payment:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to initialize payment." });
    }
};

// Verify payment
const verifyPayment = async (req, res) => {
    const { reference } = req.params;

    if (!reference) {
        return res.status(400).json({ error: "Payment reference is required." });
    }

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const paymentStatus = response.data.data.status;

        if (paymentStatus === "success") {
            // Fetch the order_id from the orders database using the payment_ref
            const [orderRows] = await db.query(`SELECT id FROM orders WHERE payment_ref = ?`, [reference]);

            if (orderRows.length === 0) {
                return res.status(404).json({ error: "Order not found for the given payment reference." });
            }

            const orderId = orderRows[0].id;
            
            // Update the order status to 'confirmed'
            await db.query(`UPDATE orders SET status = ? WHERE id = ?`, ["confirmed", orderId]);

            console.log(orderId);

            const [itemRows] = await db.query(
                `SELECT oi.food_item_id, oi.quantity, oi.price 
                 FROM order_items oi
                 JOIN orders o ON oi.order_id = o.id
                 WHERE o.id = ?`, // Use `o.id` to match the correct order ID
                [orderId] // The order ID parameter should be passed here
            );
            

            console.log(itemRows);

            if (itemRows.length === 0) {
                return res.status(404).json({ error: "No items found for this order." });
            }

            // Fetch the restaurant email associated with the order
            const [restaurantRows] = await db.query(
                `SELECT u.email 
                 FROM users u
                 JOIN restaurants r ON r.user_id = u.user_id
                 JOIN orders o ON o.restaurant_id = r.id
                 WHERE o.id = ?`,
                [orderId]
            );

            if (restaurantRows.length === 0) {
                return res.status(404).json({ error: "Restaurant not found for the given order." });
            }

            const restaurantEmail = restaurantRows[0].email;

            // Prepare and send the email to the restaurant
            await sendPaymentConfirmationEmail(
                restaurantEmail, 
                'Restaurant Manager', 
                orderId, 
                paymentStatus, 
                response.data.data.amount, 
                itemRows
            );

            // Final response to the client
            return res.status(200).json({
                message: "Payment verified successfully.",
                data: response.data.data,
            });
        } else {
            return res.status(400).json({ error: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Error verifying payment:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to verify payment." });
    }
};





// Fetch transaction details
const fetchTransaction = async (req, res) => {
    const { transactionId } = req.params;

    if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required." });
    }

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/${transactionId}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        res.status(200).json({
            message: "Transaction details fetched successfully.",
            data: response.data.data,
        });
    } catch (error) {
        console.error("Error fetching transaction:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch transaction details." });
    }
};

// Webhook Handler
const webhookHandler = async (req, res) => {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET; // Use your Paystack webhook secret
    const hash = crypto.createHmac("sha512", secret).update(JSON.stringify(req.body)).digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
        return res.status(401).send("Invalid signature."); // Protect against unauthorized requests
    }

    const event = req.body;

    try {
        if (event.event === "charge.success") {
            const { reference, metadata } = event.data;
            const restaurantId = metadata.restaurantId;

            // Update order status in the database
            await pool.query(`UPDATE orders SET status = ? WHERE payment_ref = ?`, ["confirmed", reference]);

            console.log(`Order with reference ${reference} confirmed for Restaurant ID ${restaurantId}`);
        }
        res.status(200).send("Webhook processed successfully.");
    } catch (error) {
        console.error("Error processing webhook:", error.message);
        res.status(500).send("Error processing webhook.");
    }
};

const savePaymentDetails = async (req, res) => {
    const { bankCode, accountNumber, commission } = req.body;
    const restaurantId = req.user.id;

    if (!restaurantId || !bankCode || !accountNumber || !commission) {
        return res.status(400).json({
            error: "Restaurant ID, bank code, account number, and percentage split are required.",
        });
    }

    try {
        const response = await axios.post(
            "https://api.paystack.co/subaccount",
            {
                business_name: `Restaurant_${restaurantId}`, // Unique business name
                bank_code: bankCode, // Bank code (e.g., 057 for Zenith Bank)
                account_number: accountNumber, // Account number
                percentage_charge: commission, // Split percentage for this subaccount
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const subaccountCode = response.data.data.subaccount_code;

        // Store subaccount details in the database
        await db.query(
            `INSERT INTO payments (restaurant_id, subaccount_code, bank_code, account_number, commission_percentage) 
            VALUES (?, ?, ?, ?, ?)`,
            [restaurantId, subaccountCode, bankCode, accountNumber, commission]
        );

        res.status(200).json({
            message: "Subaccount created successfully.",
            subaccount_code: subaccountCode,
        });
    } catch (error) {
        console.error("Error creating subaccount:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create subaccount." });
    }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
    const { restaurantId } = req.params;
    console.log(restaurantId)

    try {
        const query = `SELECT * FROM payments WHERE restaurant_id = ?`;
        const [rows] = await db.execute(query, [restaurantId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Payment details not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching payment details:', error.message);
        res.status(500).json({ error: 'Failed to fetch payment details' });
    }
};

module.exports = {getPaymentDetails, savePaymentDetails, initializePayment, verifyPayment, fetchTransaction, webhookHandler };
