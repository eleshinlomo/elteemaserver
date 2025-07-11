import { sendEmail } from "../controllers/emailSender.js";
import { capitalize } from "../utils.js";
import { admin } from "../models/userData.js";

const SERVICE = process.env.SERVICE
export const sendNewUserAlert = async (user) => {
    const subject = `New User Alert For ${SERVICE}-${capitalize(user.username)}`
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${subject}</title>
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
        <div class="header">${subject}</div>
        <div class="content">
            <p>Hi ${capitalize(admin.username)},</p>
            <p>You have a new user!</p>
            <p>Name: ${capitalize(user.username)}</p>
             <p>Email: ${user.email}</p>
            <p>${capitalize(user.username)} registered using ${SERVICE} on ${user.createdAt}</p>
            <p>User registered as a ${user.role}</p>
        </div>
        <div class="footer">
            <p>This email is from the ${SERVICE} team</p>
            <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
    </body>
    </html>
    `;

    try {
        
        const response = await sendEmail(admin.email, emailBody, subject);
        return response;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            ok: false,
            error: 'Failed to send verification email'
        };
    }
};