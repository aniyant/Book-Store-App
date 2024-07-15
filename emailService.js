const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

// Promotional email service
const sendPromotionalEmail = (mailto) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: mailto,
        subject: 'Promotional Email',
        text: 'This is a promotional email.Please visit our online bookstore website at'
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Promotional Email sent successfully:', info.response);
        }
    })

}

module.exports = {transporter,sendPromotionalEmail};