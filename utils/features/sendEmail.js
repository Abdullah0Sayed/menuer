// import nodemailer 
const nodemailer = require("nodemailer");
// import nodemailer with mailgun
const mailgunTransport = require('nodemailer-mailgun-transport');

const sendEmail = async (options)=> {

    const auth = {
        auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN
        }
    };

    // 1. create transporter
    const transporter = nodemailer.createTransport(mailgunTransport(auth));

    // 2. options 
    const mailOptions = {
        from: `<Menuer Team ${process.env.USER_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // send email 
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;