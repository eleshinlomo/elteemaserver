import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

/**
 * Sends an email using AWS SES API
 */
export const sendEmail = async (recipientEmail, emailSubject, htmlContent) => {
  try {
    console.log('📧 Attempting to send email to:', recipientEmail);

    // Create SES client
    const sesClient = new SESClient({
      region: process.env.AWS_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      },
    });

    // Email parameters
    const params = {
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: emailSubject,
        },
      },
      Source: process.env.SUPPORT_EMAIL, // verified sender email
    };

    // Send email
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    console.log('✅ Email delivered successfully to:', recipientEmail);
    return {
      ok: true,
      message: result.MessageId,
      response: result,
    };

  } catch (error) {
    console.error('❌ Email delivery failed:', error.message);
    return {
      success: false,
      error: error.message,
      details: 'Check SES access keys, region, and verified sender email',
    };
  }
};
