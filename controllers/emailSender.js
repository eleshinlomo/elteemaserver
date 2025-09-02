import nodemailer from 'nodemailer'

export const sendEmail = async (recieverEmail, messageSubject, emailBody) => {
    return await new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Let nodemailer handle Gmail settings automatically
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_PASS
            },
        });

        const mailOptions = {
            from: `Elteema <${process.env.SUPPORT_EMAIL}>`,
            to: recieverEmail,
            subject: messageSubject,
            html: emailBody,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email error:', error);
                reject({ error: error.message, ok: false });  
            } else {
                console.log('Email sent:', info.response);
                resolve({ accepted: info.accepted, message: 'Email sent successfully!', ok: true }); 
            }
        });
    });
};