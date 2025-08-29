

import { sendEmail } from "../../controllers/emailSender.js";
import { capitalize } from "../../utils.js";

export const sendCustomEmail = async (user, messageSubject, message) => {
    const HOME_URL = process.env.HOME_URL
    const subject = messageSubject
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL
    const recipientName = user?.username || ''
    const recipientEmail = user?.email || ''

    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>New Message from Elteema</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #1d9929ff;
                max-width: 600px;
                margin: 0 auto;
                padding: 0;
                background-color: #f7f9fc;
            }
            
            .product-info {
             color: green;
             font-weigth: 400;
            }

            .container {
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                margin: 20px 5px;
                border: 1px solid #e0e6ed;
            }
            .header {
                background: linear-gradient(135deg, #6bffa1ff 0%, #1eaf3bff 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
                font-size: 24px;
                font-weight: 600;
            }
            .logo {
                font-size: 28px;
                margin-bottom: 10px;
                display: inline-block;
            }
            .content {
                padding: 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 25px;
                color: #0ca840ff;
            }
            .message {
                margin-bottom: 25px;
                font-size: 15px;
            }
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #0c2e13ff 0%, #094f20ff 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 500;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(107, 255, 124, 0.3);
                transition: all 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(107, 255, 139, 0.4);
            }
            .divider {
                height: 1px;
                background-color: #e0e6ed;
                margin: 25px 0;
            }
            .footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #7f8c8d;
                background-color: #f7f9fc;
            }
            .social-icons {
                margin: 15px 0;
            }
            .social-icon {
                margin: 0 10px;
                text-decoration: none;
                color: #6b73ff;
                font-size: 18px;
            }
            .thank-you {
                font-style: italic;
                color: #6b73ff;
                margin-top: 20px;
            }
            .warning {
              color: red;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Elteema</div>
                <div>${subject}</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hi ${capitalize(recipientName)}</div>
                
                <div class="message">
                  ${message}
                </div>
                
                <div class="button-container">
                    <a href="https://elteema.com/dashboard" 
                    class="button">Log in to your dashboard</a>
                </div>
                
                <div class="divider"></div>
                
                <div class="message">
                    Need help or have questions about your order?<br>
                    Reply to this email or contact us at ${SUPPORT_EMAIL}.
                </div>
                
                <div class="thank-you">
                    Thank you for using Elteema!
                </div>
            </div>
            
            <div class="footer">
                <div class="social-icons">
                    <a href="#" class="social-icon">📱</a>
                    <a href="#" class="social-icon">💻</a>
                    <a href="#" class="social-icon">📧</a>
                </div>
                <p>© ${new Date().getFullYear()} Elteema. All rights reserved.</p>
                <p>If you didn't request this email, you can safely ignore it.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await sendEmail(recipientEmail, subject, emailBody);
        return response;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            ok: false,
            error: 'Failed to send verification email'
        };
    }
};