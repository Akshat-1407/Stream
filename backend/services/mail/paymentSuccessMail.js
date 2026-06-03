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