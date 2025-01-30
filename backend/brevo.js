require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendVerificationEmail = async (userEmail, userName, verificationLink) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Construct the email options object
  const sendSmtpEmail = {
    to: [{ email: userEmail, name: userName }],
    sender: { email: 'ferdinandraphael20@gmail.com', name: 'futo_order' }, // Ensure this email is verified in Brevo
    subject: 'Verify Your Email - Restaurant System',
    htmlContent: `
      <p>Hi ${userName},</p>
      <p>Please verify your email address to complete the registration process:</p>
      <a href="${verificationLink}">Verify Your Email</a>
      <p>If you did not register, please ignore this email.</p>
    `,
  };

  // Log the email request data
  console.log('Sending email with the following details:', sendSmtpEmail);

  try {
    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Verification email sent:', response);
    return response;
  } catch (error) {
    // Log the error details for debugging
    console.error('Error sending verification email:', error.response ? error.response.text : error.message);
    throw error;
  }
};
const sendPaymentConfirmationEmail = async (userEmail, userName, orderId, paymentStatus, amount, items, customerEmail, customerLocation) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Construct the email content with payment details
  const itemsList = items && Array.isArray(items) ? items.map(item => item.food_name ? item.food_name:  'Unnamed Item').join(', ') : 'No items listed';
  const amountInCurrency = (amount / 100).toFixed(2); // Convert amount to local currency (assuming the amount is in cents)

  const sendSmtpEmail = {
      to: [{ email: userEmail, name: userName }],
      sender: { email: 'ferdinandraphael20@gmail.com', name: 'futo_order' }, // Ensure this email is verified in Brevo
      subject: 'Payment Successful - Order Confirmation',
      htmlContent: `
          <p>Hi ${userName},</p>
          <p>An order with the ID <strong>${orderId}</strong> has been successfully processed.</p>
          <p>Transaction Status: <strong>${paymentStatus}</strong></p>
          <p>Amount: <strong>${amountInCurrency} (in local currency)</strong></p>
          <p>Items: <strong>${itemsList}</strong></p>
          <p>Customer Email: <strong>${customerEmail}</strong></p>
          <p>Customer Location: <strong>${customerLocation}</strong></p>
          <p>Thank you for using our service!</p>
          <p>If you did not recieve this payment, please contact us immediately.</p>
      `,
  };

  console.log('Sending payment confirmation email with the following details:', sendSmtpEmail);

  try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Payment confirmation email sent:', response);
      return response;
  } catch (error) {
      console.error('Error sending payment confirmation email:', error.response ? error.response.text : error.message);
      throw error;
  }
};


module.exports = { sendVerificationEmail, sendPaymentConfirmationEmail };
