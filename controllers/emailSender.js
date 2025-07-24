import nodemailer from 'nodemailer';
const SERVICE = process.env.SERVICE

export const sendEmail = (recieverEmail, emailBody, messageSubject) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
               service: 'gmail',
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
            auth: {
                user: 'support@elteema.com',
                pass: 'ovfdytsfsznyppyx'
            },
        });

        const mailOptions = {
            from: `${SERVICE} <support@elteema.com>`,
            to: recieverEmail,
            subject: messageSubject,
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ error: error.message, ok: false });  
            } else {
                resolve({ accepted: info.accepted, message: 'Verification email sent!', ok: true }); 
            }
        });
    });
};



