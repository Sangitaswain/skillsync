// this file handles all email sending functionality using mailtrap service for both users and companies


/*import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js';
import { mailtrapClient, sender } from './mailtrap.config.js';




// USER EMAIL FUNCTIONS 



// sends verification email to users with their verification token 
export const sendUserVerificationEmail = async (email, verificationToken) => {
  if (!email) {
    throw new Error(" email is required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "User Email Verification",
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};


// send welcome email to new users 

export const sendUserWelcomeEmail = async (email, first_Name, last_Name) => {
  if (!email) {
    throw new Error("User email is required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      template_uuid: "f45a005d-79a8-4f87-880f-d99bd037e7a0",
      template_variables: {
        "user_info_email": email,
        "user_info_name": first_Name,
        "user_info_last_name": last_Name,
      },
    });
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};



// sends a password reset email to the user with a reset url

export const sendUserPasswordResetEmail = async (email, resetURL) => {
  if (!email || !resetURL) {
    throw new Error("User email and reset URL are required");
  }

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "User Password Reset",
    });
    console.log("password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending password reset email: ${error.message}`);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};


// sends confirmation email after successful password reset

export const sendUserPasswordResetSuccessEmail = async (email) => {
  if (!email) {
    throw new Error(" email is required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "User Password Reset",
    });
    console.log("Password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending password reset email: ${error.message}`);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};








// COMPANY EMAIL FUNCTIONS



// sends verification email to companies with thier verification token

export const sendCompanyVerificationEmail = async (companyEmail, verificationToken) => {
  if (!companyEmail) {
    throw new Error("Company email is required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: companyEmail }],
      subject: "Verify your company email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
     
    });
    console.log("Company verification email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending company verification email: ${error.message}`);
    throw new Error(`Error sending company verification email: ${error.message}`);
  }
};



// sends welcome email to new companies

export const sendCompanyWelcomeEmail = async (companyEmail, companyName, pointOfContactFirstName, pointOfContactLastName) => {
  if (!companyEmail || !companyName) {
    throw new Error("Company email and name are required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: companyEmail }],
      template_uuid: "f45a005d-79a8-4f87-880f-d99bd037e7a0",
      template_variables: {
        "company_info_name": companyName,
        "company_info_email": companyEmail,
        "point_of_contact_first_name": pointOfContactFirstName,
        "point_of_contact_last_name": pointOfContactLastName,
      },
    });
    console.log("Company welcome email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending company welcome email: ${error.message}`);
    throw new Error(`Error sending company welcome email: ${error.message}`);
  }
};



// sends password reset email to companies with a reset url

export const sendCompanyPasswordResetEmail = async (companyEmail, resetURL) => {
  if (!companyEmail || !resetURL) {
    throw new Error("Company email and reset URL are required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: companyEmail }],
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      
    });
    console.log("Company password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending company password reset email: ${error.message}`);
    throw new Error(`Error sending company password reset email: ${error.message}`);
  }
};



// sends confirmation email after succesful company password reset 

export const sendCompanyPasswordResetSuccessEmail = async (companyEmail) => {
  if (!companyEmail) {
    throw new Error("Company email is required");
  }
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email: companyEmail }],
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    
    });
    console.log("Company password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error(`Error sending company password reset email: ${error.message}`);
    throw new Error(`Error sending company password reset email: ${error.message}`);
  }
}; */