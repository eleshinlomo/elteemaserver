import nodemailer from 'nodemailer';
const SERVICE = process.env.SERVICE
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL
const SUPPORT_PASS = process.env.SUPPORT_PASS

console.log('SUPPORT EMAIL', SUPPORT_EMAIL)
console.log('SUPPORT PASS', SUPPORT_PASS)

export const sendEmail = async (recieverEmail, messageSubject, emailBody ) => {
    
        const transporter = nodemailer.createTransport({
               service: 'gmail',
              host: 'smtp.gmail.com',
            auth: {
                user: 'support@elteema.com',
                pass: 'yrhccayglmkpxixi'
            },
        });

        const mailOptions = {
            from: `${SERVICE} <support@elteema.com>`,
            to: recieverEmail,
            subject: messageSubject,
            html: emailBody,
        };
     return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ error: error.message, ok: false });  
            } else {
                resolve({ accepted: info.accepted, message: 'Email sent successfully!', ok: true }); 
            }
        });
        
    });


};



