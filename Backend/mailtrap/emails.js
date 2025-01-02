import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { mailtrapClient, sender } from './mailtrap.config.js';


export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
  const recipients = [
    {
      email: recipientEmail, // Correcting the recipient object
    },
  ];

  try {
    // Send email via MailtrapClient
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });

    console.log("Email sent successfully:", response);
    return response; // Optionally return the response
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error(`Error sending email: ${error.message}`);
  }
};



export const sendWelcomeEmail = async (recipientEmail,CompanyName,Email,FirstName) => {
    const recipients = [
      {
        email: recipientEmail, // Correcting the recipient object
      },
    ];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "f45a005d-79a8-4f87-880f-d99bd037e7a0",
            template_variables: {
                "company_info_name": CompanyName,
                "company_info_email": recipientEmail,
                "user_info_email": Email,
                "user_info_name": FirstName,
                
            },
        });
        console.log("Welcome Email sent successfully:", response);
        return response;

    }catch (error) {
      console.error(`Error sending welcome email: ${error.message}`);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendResetPasswordEmail = async (recipientEmail, resetURL) => {
    const recipients = [{ email: recipientEmail }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        

        });

        console.log("Password reset email sent successfully:", response);
        return response;    
    } catch (error) {
        console.error(`Error sending password reset email: ${error.message}`);
        throw new Error(`Error sending password reset email: ${error.message}`);
      }
    };


export const sendPasswordResetSuccessEmail = async (recipientEmail) => {
    const recipient = [{ email: recipientEmail }];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_REQUEST_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", response);
    }catch(error){
        console.error(`Error sending password reset success email: ${error.message}`);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
    
}