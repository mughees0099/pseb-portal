import { transporter } from "./Email.config.js";
import {
  Verification_Email_Template,
  Password_Reset_Email_Template,
} from "./EmailTemplate.js";

export const SendVerificationCode = async (email, VerificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: "Haziq <haziq.corvit@gmail.com>",
      to: email,
      subject: "Verify Your Email",
      text: "Verify Your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        VerificationCode
      ),
    });
  } catch (err) {}
};

export const SendResetEmail = async (email, VerificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: "Haziq <haziq.corvit@gmail.com>",
      to: email,
      subject: "Reset Your Password",
      text: "Reset Your Password",
      html: Password_Reset_Email_Template.replace(
        "{ResetVerificationCode}",
        VerificationCode
      ),
    });
  } catch (err) {}
};
