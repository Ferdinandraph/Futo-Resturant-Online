require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendVerificationEmail = async (userEmail, userName, verificationLink) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Construct the email options object
  const sendSmtpEmail = {
    to: [{ email: userEmail, name: userName }],
    sender: { email: 'ferdinandraphael0@gmail.com', name: 'futo_order' }, // Ensure this email is verified in Brevo
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

module.exports = { sendVerificationEmail };
