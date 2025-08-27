import { sendEmail } from "../../controllers/emailSender.js";
import { Products } from "../../models/productData.js";
import { capitalize } from "../../utils.js";

/**
 * Sends an abandoned cart reminder email to a user
 * @param {Object} user 
 * @param {string} messageSubject - Email subject line
 * @param {string} message - Custom message content
 * @returns {Promise<Object>} Response object indicating success or failure
 */
export const sendNewProductsAlertEmail = async (user, messageSubject, message) => {
  const {
    HOME_URL,
    SUPPORT_EMAIL
  } = process.env;

  const recipientName = capitalize(user?.username || '');
  const recipientEmail = user?.email || '';

  // Get products and filter them
  const products = await Products.find();
  const filteredFoodStuff = products?.filter((p) => p.category === 'foodstuff' && !p.isHidden).slice(0, 5);
  const filteredTextiles = products?.filter((p) => p.category === 'fabrics & textiles' && !p.isHidden).slice(0, 6);

  const emailBody = generateEmailTemplate({
    subject: messageSubject,
    recipientName,
    message,
    homeUrl: HOME_URL,
    supportEmail: SUPPORT_EMAIL,
    foodStuff: filteredFoodStuff,
    textiles: filteredTextiles,
    productsOnly: products.filter((p)=>!p.isHidden)
    .sort((a, b)=> b.createdAt - a.createdAt)
    .slice(0, 3)
  });

  try {
    const response = await sendEmail(recipientEmail, emailBody, messageSubject);
    return response;
  } catch (error) {
    console.error('Error sending product alert email:', error);
    return {
      ok: false,
      error: 'Failed to send product alert email'
    };
  }
};

/**
 * Generates HTML for product grid (table-based for email compatibility)
 * @param {Array} products - Array of product items
 * @param {string} category - Category title
 * @returns {string} HTML string of product grid
 */
const generateProductTableHTML = (products, category) => {
  if (!products || products.length === 0) return '';

  // break into rows of 3
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  return `
    <div style="margin:30px 0;">
      <h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:15px;">${category}</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        ${rows.map(row => `
          <tr>
            ${row.map(item => `
              <td style="width:33.33%;padding:8px;vertical-align:top;">
                <div style="border:1px solid #ddd;border-radius:10px;overflow:hidden;background:#fff;">
                  ${item.imageUrls?.[0] ? `
                    <img src="${item.imageUrls[0]}" alt="${item.productName || 'Product'}"
                         style="width:100%;height:150px;object-fit:cover;display:block;border-bottom:1px solid #eee;" />
                  ` : `
                    <div style="width:100%;height:150px;background:#f3f3f3;display:flex;align-items:center;justify-content:center;">🛒</div>
                  `}
                  <div style="padding:10px;text-align:center;">
                    <h4 style="font-size:14px;margin:0 0 8px 0;font-weight:600;color:#2d3748;">${item.productName || 'Unnamed Product'}</h4>
                    <p style="margin:0;font-weight:bold;color:#1eaf3b;">₦${item.price?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>
    </div>
  `;
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
  foodStuff,
  textiles,
  productsOnly
}) => {
  const foodStuffHTML = generateProductTableHTML(foodStuff, 'Popular Food Items');
  const textilesHTML = generateProductTableHTML(textiles, 'Featured Textiles');
  const productHTML = generateProductTableHTML(productsOnly, 'Latest Products');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject} - Elteema</title>
</head>
<body style="font-family: Arial, sans-serif;line-height:1.6;color:#333;max-width:650px;margin:0 auto;padding:20px;background-color:#f9fafb;">
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);margin:20px auto;border:1px solid #e8f5e8;">
        
        <div style="background:linear-gradient(135deg,#6bffa1 0%,#1eaf3b 100%);color:white;padding:40px 30px;text-align:center;font-size:24px;font-weight:600;">
            <div style="font-size:32px;margin-bottom:15px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.1);">🛒 Elteema</div>
            <div style="font-size:22px;opacity:0.95;letter-spacing:0.5px;">${subject}</div>
        </div>
        
        <div style="padding:30px;">
            <div style="font-size:20px;margin-bottom:20px;color:#1eaf3b;font-weight:600;text-align:center;">
                Hi ${recipientName} 👋
            </div>
            
            <div style="margin-bottom:30px;font-size:15px;line-height:1.7;color:#4a5568;text-align:center;">
                ${message}
            </div>

            ${productHTML}
            ${foodStuffHTML}
            ${textilesHTML}
            
            <div style="text-align:center;margin:30px 0;">
                <a href="${homeUrl}" style="display:inline-block;padding:14px 35px;background:linear-gradient(135deg,#0c2e13 0%,#094f20 100%);color:white;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;box-shadow:0 6px 20px rgba(107,255,124,0.35);">🛍️ Explore More Products</a>
            </div>
            
            <div style="height:2px;background:linear-gradient(90deg,transparent,#e0e6ed,transparent);margin:30px 0;"></div>
            
            <div style="text-align:center;margin:20px 0;color:#4a5568;line-height:1.6;font-size:14px;">
                <strong>Need help or have questions about your order?</strong><br>
                Reply to this email or contact us at 
                <a href="mailto:${supportEmail}" style="color:#1eaf3b;text-decoration:none;font-weight:600;">${supportEmail}</a>
            </div>
            
            <div style="font-style:italic;color:#1eaf3b;margin-top:20px;text-align:center;font-size:15px;font-weight:500;">
                Thank you for choosing Elteema! 💚
            </div>
        </div>
        
        <div style="padding:20px;text-align:center;font-size:13px;color:#718096;background-color:#f7f9fc;border-top:1px solid #e2e8f0;">
            <div style="margin:15px 0;">
                <a href="#" style="margin:0 10px;text-decoration:none;color:#1eaf3b;font-size:20px;">📱</a>
                <a href="#" style="margin:0 10px;text-decoration:none;color:#1eaf3b;font-size:20px;">💻</a>
                <a href="#" style="margin:0 10px;text-decoration:none;color:#1eaf3b;font-size:20px;">📧</a>
            </div>
            <p>© ${new Date().getFullYear()} Elteema. All rights reserved.</p>
            <p>Ikorodu, Lagos, Nigeria 🌍</p>
            <p style="font-size:12px;color:#a0aec0;margin-top:15px;">
                If you didn't request this email, you can safely ignore it.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
