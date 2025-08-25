import { sendEmail } from "../../controllers/emailSender.js";
import { capitalize } from "../../utils.js";

/**
 * Sends an abandoned cart reminder email to a user
 * @param {Object} user - User object containing cart and profile information
 * @param {string} messageSubject - Email subject line
 * @param {string} message - Custom message content
 * @returns {Promise<Object>} Response object indicating success or failure
 */
export const sendAbandonedCartEmail = async (user, messageSubject, message) => {
  const {
    HOME_URL,
    SUPPORT_EMAIL
  } = process.env;

  const recipientName = capitalize(user?.username || '');
  const recipientEmail = user?.email || '';

  // Generate cart items HTML if cart exists
  const cartItemsHTML = generateCartItemsHTML(user?.cart);

  const emailBody = generateEmailTemplate({
    subject: messageSubject,
    recipientName,
    message,
    homeUrl: HOME_URL,
    supportEmail: SUPPORT_EMAIL,
    cartItemsHTML
  });

  try {
    const response = await sendEmail(recipientEmail, emailBody, messageSubject);
    return response;
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return {
      ok: false,
      error: 'Failed to send abandoned cart email'
    };
  }
};

/**
 * Generates HTML for cart items display
 * @param {Array} cart - Array of cart items
 * @returns {string} HTML string of cart items
 */
const generateCartItemsHTML = (cart) => {
  if (!cart || cart.length === 0) return '';

  return cart.map(item => `
    <div class="cart-item" style="margin: 15px 0; padding: 15px; border: 1px solid #e0e6ed; border-radius: 8px; background: #f9fafb;">
      <h4 style="margin: 0 0 10px 0; color: #1d9929; font-weight: 600;">
        ${item.productName || 'Unnamed Product'}
      </h4>
      ${item.imageUrls?.[0] ? `
        <img src="${item.imageUrls[0]}" 
             alt="${item.productName || 'Product'}" 
             style="max-width: 200px; height: auto; border-radius: 6px; margin: 10px 0;"/>
      ` : ''}
      <p style="margin: 5px 0; color: #666;">
        Price: $${item.price?.toFixed(2) || 'N/A'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        Quantity: ${item.quantity || 1}
      </p>
    </div>
  `).join('');
};

/**
 * Generates the complete email HTML template
 * @param {Object} params - Template parameters
 * @returns {string} Complete HTML email template
 */
const generateEmailTemplate = ({
  subject,
  recipientName,
  message,
  homeUrl,
  supportEmail,
  cartItemsHTML
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject} - Elteema</title>
    <style>
        ${getEmailStyles()}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛒 Elteema</div>
            <div class="subject">${subject}</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi ${recipientName} 👋</div>
            
            <div class="message">
                ${message}
            </div>

            ${cartItemsHTML ? `
                <div class="cart-section">
                    <h3 class="section-title">Your Cart Items</h3>
                    ${cartItemsHTML}
                </div>
            ` : ''}
            
            <div class="button-container">
                <a href="${homeUrl}/dashboard/checkoutpage" class="button">
                    🛍️ Complete Checkout
                </a>
            </div>
            
            <div class="divider"></div>
            
            <div class="support-message">
                <strong>Need help or have questions about your order?</strong><br>
                Reply to this email or contact us at 
                <a href="mailto:${supportEmail}" class="support-link">
                    ${supportEmail}
                </a>
            </div>
            
            <div class="thank-you">
                Thank you for choosing Elteema! 💚
            </div>
        </div>
        
        <div class="footer">
            <div class="social-icons">
                <a href="#" class="social-icon">📱</a>
                <a href="#" class="social-icon">💻</a>
                <a href="#" class="social-icon">📧</a>
            </div>
            <p>© ${new Date().getFullYear()} Elteema. All rights reserved.</p>
            <p>Ikorodu, Lagos, Nigeria 🌍</p>
            <p class="disclaimer">
                If you didn't request this email, you can safely ignore it.
            </p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Returns the CSS styles for the email template
 * @returns {string} CSS styles string
 */
const getEmailStyles = () => `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', Arial, sans-serif;
    line-height: 1.6;
    color: #1d9929;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f9fc;
}

.container {
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    margin: 20px auto;
    border: 1px solid #e8f5e8;
}

.header {
    background: linear-gradient(135deg, #6bffa1 0%, #1eaf3b 100%);
    color: white;
    padding: 35px 25px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
}

.logo {
    font-size: 28px;
    margin-bottom: 12px;
    display: inline-block;
    font-weight: 700;
}

.subject {
    font-size: 20px;
    opacity: 0.95;
}

.content {
    padding: 35px 30px;
}

.greeting {
    font-size: 20px;
    margin-bottom: 25px;
    color: #0ca840;
    font-weight: 500;
}

.message {
    margin-bottom: 25px;
    font-size: 15px;
    line-height: 1.7;
    color: #2d3748;
}

.cart-section {
    margin: 25px 0;
}

.section-title {
    color: #1eaf3b;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
}

.button-container {
    text-align: center;
    margin: 35px 0;
}

.button {
    display: inline-block;
    padding: 14px 35px;
    background: linear-gradient(135deg, #0c2e13 0%, #094f20 100%);
    color: white !important;
    text-decoration: none;
    border-radius: 35px;
    font-weight: 500;
    font-size: 16px;
    box-shadow: 0 5px 18px rgba(107, 255, 124, 0.35);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(107, 255, 139, 0.45);
}

.divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, #e0e6ed, transparent);
    margin: 30px 0;
}

.support-message {
    text-align: center;
    margin: 25px 0;
    color: #4a5568;
    line-height: 1.6;
}

.support-link {
    color: #1eaf3b;
    text-decoration: none;
    font-weight: 500;
}

.thank-you {
    font-style: italic;
    color: #6b73ff;
    margin-top: 25px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
}

.footer {
    padding: 25px;
    text-align: center;
    font-size: 13px;
    color: #718096;
    background-color: #f7f9fc;
    border-top: 1px solid #e2e8f0;
}

.social-icons {
    margin: 18px 0;
}

.social-icon {
    margin: 0 12px;
    text-decoration: none;
    color: #1eaf3b;
    font-size: 20px;
    transition: transform 0.2s ease;
}

.social-icon:hover {
    transform: scale(1.15);
}

.disclaimer {
    font-size: 12px;
    color: #a0aec0;
    margin-top: 15px;
}

/* Responsive design */
@media (max-width: 480px) {
    .content {
        padding: 25px 20px;
    }
    
    .header {
        padding: 25px 20px;
    }
    
    .button {
        padding: 12px 25px;
        font-size: 14px;
    }
}
`;