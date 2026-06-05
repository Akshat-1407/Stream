const ejs = require('ejs');
const path = require('path');

async function sendOtpMail(userName, userEmail, otp) {
    try {
        // 1. Render the EJS template
        const htmlData = await ejs.renderFile(
            path.join(__dirname, "..", "..", 'templates', 'otp.ejs'), 
            { userName, otp }
        );

        // 2. Construct the clean payload
        const payload = {
            sender: { 
                email: process.env.SENDER_EMAIL 
            },
            to: [
                { email: userEmail, name: userName }
            ],
            subject: 'OTP',
            htmlContent: htmlData,
        };

        // 3. Send the POST request to Brevo over HTTPS
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent successfully via HTTP API. Message ID:', result.messageId);
        } else {
            console.error('Brevo API Error Response:', result);
        }

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendOtpMail;





/*
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

async function sendOtpMail(userName, userEmail, otp) {
    try {

        const brevoDetails = {
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_EMAIL,
                pass: process.env.BREVO_SMTP_KEY,
            },
        }

        const transporter = nodemailer.createTransport(brevoDetails);

        // 2. Render the EJS template
        // We pass the data { name: userName, email: userEmail } to the template
        const data = await ejs.renderFile(path.join(__dirname, "..", "..", 'templates', 'otp.ejs'), { userName, otp });

        // 3. Define Email Options
        const mail = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: 'OTP',
            html: data,
            attachments: [
                {
                    filename: "app_logo.png",
                    path: path.join(
                        process.cwd(),
                        "public",
                        "app_logo.png"
                    ),
                    cid: "stream-logo",
                }
            ]
        };

        // 4. Send the mail
        const info = await transporter.sendMail(mail);
        console.log('Email sent successfully:', info.messageId);

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendOtpMail;
*/