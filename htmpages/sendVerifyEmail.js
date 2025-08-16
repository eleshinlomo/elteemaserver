import { sendEmail } from "../controllers/emailSender.js";
import { capitalize } from "../utils.js";

export const sendVerifyEmail = async (email, link, username) => {
    const subject = 'Elteema Verification link'
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Verification Link</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color:rgb(177, 207, 226);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        <div class="header">Email Verification</div>
        <div class="content">
            <p>Hi ${capitalize(username)},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${link}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p><small>${link}</small></p>
        </div>
        <div class="footer">
            <p>This email is from the Petrolage team</p>
            <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await sendEmail(email, emailBody,subject);
        return response;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            ok: false,
            error: 'Failed to send verification email'
        };
    }
};