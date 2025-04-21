import nodemailer from 'nodemailer';
const SERVICE = process.env.SERVICE

export const sendEmail = (recieverEmail, emailBody, messageSubject) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mgrsconcept@gmail.com',
                pass: 'gjzdpnoqsnzqhjyd', 
            },
        });

        const mailOptions = {
            from: `${SERVICE} <support@petrolagegroup.com>`,
            to: recieverEmail,
            subject: messageSubject,
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ error: error.message, ok: false });  // Reject if there’s an error
            } else {
                resolve({ accepted: info.accepted, message: 'Verification email sent!', ok: true });  // Resolve with a success message
            }
        });
    });
};
