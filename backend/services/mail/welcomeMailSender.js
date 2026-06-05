const ejs = require('ejs');
const path = require('path');

async function sendWelcomeMail(userEmail, userName) {
    try {
        // 1. Render the EJS template exactly as before
        const htmlContent = await ejs.renderFile(
            path.join(__dirname, "..", "..", 'templates', 'welcome.ejs'), 
            { userName, userEmail }
        );

        // 2. Construct the clean HTTP API payload (no image logic)
        const payload = {
            sender: { 
                email: process.env.SENDER_EMAIL 
            },
            to: [
                { email: userEmail, name: userName }
            ],
            subject: 'Welcome to Stream',
            htmlContent: htmlContent,
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
            console.log('Welcome email sent successfully via HTTP API. Message ID:', result.messageId);
        } else {
            console.error('Brevo API Error Response:', result);
        }

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendWelcomeMail;



/*
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

async function sendWelcomeMail(userEmail, userName) {
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
        const data = await ejs.renderFile(path.join(__dirname, "..", "..", 'templates', 'welcome.ejs'), { userName, userEmail });

        // 3. Define Email Options
        const mail = {
            to: userEmail,
            from: process.env.SENDER_EMAIL,
            subject: 'Welcome to Stream',
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

module.exports = sendWelcomeMail;
*/