const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'raminsagandykov@gmail.com',
        pass: 'ufqo tyyc apqa biyw',
    },
});

const sendWelcomeEmail = async (toEmail) => {
    const mailOptions = {
        from: 'raminsagandykov@gmail.com',
        to: toEmail,
        subject: 'Welcome to Our Service',
        text: 'Congratulations with successful registration!',
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

module.exports = { sendWelcomeEmail };
