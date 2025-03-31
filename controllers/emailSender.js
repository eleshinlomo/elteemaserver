import nodemailer from 'nodemailer';

export const sendVerificationEmail = (email, verificationLink) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mgrsconcept@gmail.com',
                pass: 'gjzdpnoqsnzqhjyd', // Or use an App Password for better security
            },
        });

        const mailOptions = {
            from: 'mgrsconcept@gmail.com',
            to: email,
            subject: 'Verify Your Account',
            text: `Click the link to verify your account: ${verificationLink}`,
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
