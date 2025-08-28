import nodemailer from 'nodemailer';
const SERVICE = process.env.SERVICE
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL
const SUPPORT_PASS = process.env.SUPPORT_PASS

export const sendEmail = async (recieverEmail, messageSubject, emailBody ) => {
    return  await new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
               service: 'gmail',
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
            auth: {
                user: SUPPORT_EMAIL,
                pass: SUPPORT_PASS
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



