const ejs = require("ejs");
const path = require("path");

async function sendPaymentSuccessMail(
    userName,
    userEmail,
    planName,
    amount,
    paymentId,
    orderId
) {
    try {
        // 1. Render the EJS template
        const htmlContent = await ejs.renderFile(
            path.join(
                __dirname,
                "..",
                "..",
                "templates",
                "paymentSuccess.ejs"
            ),
            {
                userName,
                planName,
                amount,
                paymentId,
                orderId,
            }
        );

        // 2. Construct the clean HTTP API payload
        const payload = {
            sender: { 
                email: process.env.SENDER_EMAIL 
            },
            to: [
                { email: userEmail, name: userName }
            ],
            subject: "🎉 Your Stream Premium Subscription is Active",
            htmlContent: htmlContent,
        };

        // 3. Dispatch the payload to Brevo's v3 Mail endpoint
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
            console.log("Payment success email sent via HTTP API. Message ID:", result.messageId);
        } else {
            console.error("Brevo API Error Response:", result);
        }

    } catch (err) {
        console.error("Error sending payment success email:", err);
    }
}

module.exports = sendPaymentSuccessMail;



/*
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

async function sendPaymentSuccessMail(
    userName,
    userEmail,
    planName,
    amount,
    paymentId,
    orderId
) {
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

        const html = await ejs.renderFile(
            path.join(
                __dirname,
                "..",
                "..",
                "templates",
                "paymentSuccess.ejs"
            ),
            {
                userName,
                planName,
                amount,
                paymentId,
                orderId,
            }
        );

        const mail = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: "🎉 Your Stream Premium Subscription is Active",
            html,

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

        const info = await transporter.sendMail(mail);

        console.log("Payment success email sent:", info.messageId);

    } catch (err) {
        console.error("Error sending payment success email:", err);
    }
}

module.exports = sendPaymentSuccessMail;
*/