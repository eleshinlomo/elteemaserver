import nodemailer from 'nodemailer';

/**
 * Sends an email using AWS SES
 */
export const sendEmail = async (recipientEmail, emailSubject, htmlContent) => {
  try {
    console.log('📧 Attempting to send email to:', recipientEmail);

    // Configure SES transporter
    const mailTransporter = nodemailer.createTransport({
      host: "email-smtp." + process.env.AWS_REGION + ".amazonaws.com", // e.g. email-smtp.us-east-1.amazonaws.com
      port: 465, // or 587
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.AWS_SMTP_USERNAME, // SMTP username from AWS SES
        pass: process.env.AWS_SMTP_PASS  // SMTP password from AWS SES
      }
    });

    const emailConfig = {
      from: `${process.env.SERVICE || 'App'} <${process.env.SUPPORT_EMAIL}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent
    };

    console.log('✉️ Sending email via AWS SES...');
    const deliveryResult = await mailTransporter.sendMail(emailConfig);

    console.log('✅ Email delivered successfully to:', recipientEmail);
    return {
      ok: true,
      message: deliveryResult.messageId,
      response: deliveryResult.response
    };

  } catch (error) {
    console.error('❌ Email delivery failed:', error.message);
    return {
      success: false,
      error: error.message,
      details: 'Check SES SMTP credentials and region'
    };
  }
};
