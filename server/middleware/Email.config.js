import nodeMailer from "nodemailer";

export const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "haziq.corvit@gmail.com",
    pass: "cfia smyh ykmn acqz",
  },
});
