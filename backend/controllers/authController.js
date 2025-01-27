const db = require('../dbconnection');
const { sendVerificationEmail } = require('../brevo');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { log } = require('console');

const secretKey = process.env.SECRET_KEY;

// Register user and send verification email
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body; 
    console.log('Received user data:', { name, email, role }); // Log incoming data

    // Check if name, email, or password is missing
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(16).toString('hex');
        const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

        const sql = 'INSERT INTO users (name, email, password, role, verification_token) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, email, hashedPassword, role, verificationToken]);

        console.log('User registration successful:', result); // Log successful user registration

        try {
            await sendVerificationEmail(email, name, verificationLink);
            res.status(200).json({ message: 'Verification email sent' });
        } catch (error) {
            console.error('Error sending verification email:', error);
            res.status(500).json({ error: 'Email sending failed' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify user account
exports.verifyUser = async (req, res) => {
    const { token } = req.params;
    console.log("Received token:", token); // Log the token received

    const sql = 'UPDATE users SET verified = 1 WHERE verification_token = ?';
    try {
        const [result] = await db.query(sql, [token]);

        if (result.affectedRows === 0) {
            console.log("No matching token found in database."); // Log if no row is affected
            return res.status(400).json({ error: 'Invalid or expired verification link.' });
        }

        console.log("Verification successful!"); // Log successful verification
        return res.status(200).json({ success: true, message: 'Verification successful, please login.' });
    } catch (err) {
        console.error("Database error:", err); // Log database error
        return res.status(500).json({ error: 'Database error' });
    }
};

// Login user account
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email); // Log email received for login

    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
        const [result] = await db.query(sql, [email]);

        if (result.length === 0) {
            console.log('Invalid email:', email); // Log invalid email
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = result[0];

        // Verify password with bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Invalid password for email:', email); // Log invalid password
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        if (!user.verified) {
            console.log('Email not verified for user:', email); // Log verification status
            return res.status(403).json({ error: 'Please verify your email first' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
        console.log('Generated Token Payload:', jwt.decode(token));

        res.status(200).json({
            message: user.role === 'restaurant' ? 'Restaurant access granted' : 'User access granted',
            token,
            user: { id: user.user_id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
