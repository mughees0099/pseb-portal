import nodeMailer from "nodemailer";

export const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "riphah.ipsec@gmail.com",
    pass: "qqeb ahhs jfzv xdgc",
  },
});
