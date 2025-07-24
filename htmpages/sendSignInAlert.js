import { sendEmail } from "../controllers/emailSender.js"
import { capitalize } from "../utils.js"

export const sendSignInAlert = (user)=>{

    // Device: PC
    // Operating System: Windows 10
    // Browser: Chrome 134.0.0

const date = new Date()
const today = date.getDay()
const subject = 'Sign in Notification'
const HOME_URL = process.env.HOME_URL
const SERVICE = process.env.SERVICE
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL

const SignInAlertEnailBody = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert: New Sign-In Detected</title>
    <style>
        /* Modern CSS with responsive design */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f9fc;
        }
        
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 30px;
            border-top: 4px solid #4CAF50;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .logo {
            color: #4CAF50;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-top: 0;
        }
        
        .alert-box {
            background-color: #f8f9fa;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 10px 0;
            text-align: center;
        }
        
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
            text-align: center;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
        }
        
        .security-tips {
            background-color: #f0f7ff;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        
        ul {
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .highlight {
            font-weight: bold;
            color: #4CAF50;
        }
        
        .small-text {
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${SERVICE}</div>
            <h1>New Sign-In Detected</h1>
        </div>
        
        <p>Hi, <span class="highlight">${capitalize(user.username)}</span>,</p>
        
        <div class="alert-box">
            <p>We noticed a new sign-in to your account on <strong>${new Date}</strong>.</p>
        </div>
        
        <p>If this was you, you don't need to do anything.</p>
        
        <p>If not, please secure your account immediately:</p>
        
        <div class="security-tips">
            <h3>🔐 If you think your account was breached...</h3>
            <p>"Change your email password immediately". For maximum security:</p>
            <ul>
                <li>At least 8 characters (14+ recommended)</li>
                <li>Mix of uppercase, lowercase, numbers, and symbols</li>
                <li>Completely different from previous passwords</li>
            </ul>
        </div>
        
        <h3>🙌 Need Help?</h3>
        <p>Contact our support team at <a href="mailto:${SUPPORT_EMAIL}>support@petrolagegroup.com</a> if you need assistance regaining access to your account.</p>
        
        <div class="footer">
            <div style="margin-bottom: 15px;">
                <a href="${HOME_URL}/faq" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">FAQ</a>
                <a href="${HOME_URL}/dashboard/${user.role}/settings" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">SETTINGS</a>
                <a href="${HOME_URL}/dashboard/${user.role}/profile" style="color: #7f8c8d; text-decoration: none; margin: 0 10px;">PROFILE</a>
            </div>
            <p class="small-text">Please don't reply to this email. <a href="${HOME_URL}/unsubscribe" style="color: #7f8c8d;">Unsubscribe</a></p>
            <p class="small-text">Thanks for using ${SERVICE}!</p>
        </div>
    </div>
</body>
</html>
`
const response = sendEmail(user.email, SignInAlertEnailBody, subject)
return response

}