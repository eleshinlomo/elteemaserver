import google from 'googleapis';
console.log(typeof google); // should log "object"
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();


// Configure OAuth2 client instance (but don't set credentials yet)
let oauthClient = null;
let hasShownAuthUrl = false;

/**
 * Initializes the OAuth client only when needed
 */
const initializeOAuthClient = () => {
  if (!oauthClient) {
    oauthClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
  }
  return oauthClient;
};

/**
 * If REFRESH_TOKEN is missing, try to exchange AUTH_CODE into one
 */
const tryExchangeAuthCode = async () => {
  const client = initializeOAuthClient();
  if (!process.env.AUTH_CODE) return;

  try {
    console.log("🔑 Attempting to exchange AUTH_CODE for tokens...");
    const { tokens } = await client.getToken(process.env.AUTH_CODE);

    console.log("✅ Tokens received:");
    console.log(tokens);

    if (tokens.refresh_token) {
      console.log("\n📋 Save this in your .env file:");
      console.log("REFRESH_TOKEN=" + tokens.refresh_token);
    } else {
      console.log("⚠️ No refresh token returned. Make sure you generated the auth URL with { access_type: 'offline', prompt: 'consent' }.");
    }

    // Stop here so user can copy tokens
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to exchange AUTH_CODE:", err.message);
    process.exit(1);
  }
};

/**
 * Handles missing refresh token by providing instructions
 */
const handleMissingRefreshToken = () => {
  if (hasShownAuthUrl) return;

  const client = initializeOAuthClient();
  const SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send'
  ];

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  console.log('🚨 REFRESH_TOKEN is missing or invalid');
  console.log('🔗 Generate a refresh token by visiting this URL:');
  console.log(authUrl);
  console.log('\n👉 Then copy the code from the redirect and run again with:');
  console.log('AUTH_CODE=your_code_here node emailSender.js\n');

  hasShownAuthUrl = true;

  // If AUTH_CODE exists, try to exchange
  if (process.env.AUTH_CODE) {
    tryExchangeAuthCode();
  } else {
    throw new Error('REFRESH_TOKEN is required. Check console for authorization URL.');
  }
};

/**
 * Validates environment variables without throwing errors during import
 */
const validateEnvVars = () => {
  const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'SUPPORT_EMAIL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
    return false;
  }

  if (!process.env.REFRESH_TOKEN || process.env.REFRESH_TOKEN.trim() === '') {
    console.warn('⚠️  REFRESH_TOKEN is missing');
    return false;
  }

  return true;
};

/**
 * Retrieves an access token using OAuth2 client
 */
const obtainAccessToken = async () => {
  try {
    const client = initializeOAuthClient();

    if (process.env.REFRESH_TOKEN && process.env.REFRESH_TOKEN.trim() !== '') {
      client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
      });
    } else {
      handleMissingRefreshToken();
    }

    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse?.token || tokenResponse;

    console.log('✅ Access token retrieved successfully');
    return accessToken;
  } catch (error) {
    console.error('❌ Access token acquisition failed:', error.message);

    if (error.message.includes('refresh token') || error.message.includes('invalid_grant')) {
      console.log('🔄 Refresh token may be invalid or expired');
      handleMissingRefreshToken();
    }

    throw error;
  }
};

/**
 * Sends an email using Gmail OAuth2 authentication
 */
export const sendEmail = async (recipientEmail, emailSubject, htmlContent) => {
  try {
    console.log('📧 Attempting to send email to:', recipientEmail);

    if (!validateEnvVars()) {
      handleMissingRefreshToken();
    }

    const accessToken = await obtainAccessToken();

    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      tls: {rejectUnauthorized: false},
      auth: {
        // type: 'OAuth2',
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASS,
        // clientId: process.env.CLIENT_ID,
        // clientSecret: process.env.CLIENT_SECRET,
        // refreshToken: process.env.REFRESH_TOKEN,
        // accessToken: accessToken
      }
    });

    const emailConfig = {
      from: `${process.env.SERVICE || 'App'} <${process.env.SUPPORT_EMAIL}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent
    };

    console.log('✉️ Sending email...');
    const deliveryResult = await mailTransporter.sendMail(emailConfig);

    console.log('✅ Email delivered successfully to:', recipientEmail);
    return {
      ok: true,
      message: deliveryResult.messageId,
      response: deliveryResult.response
    };

  } catch (error) {
    console.error('❌ Email delivery failed:', error.message);

    return {
      success: false,
      error: error.message,
      details: 'Check console for authentication instructions'
    };
  }
};

// Only show a warning during import
if (!validateEnvVars()) {
  console.log('ℹ️  Email service configured but requires REFRESH_TOKEN to send emails');
}
