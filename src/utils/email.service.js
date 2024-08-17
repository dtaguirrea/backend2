import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
    }
});

export const sendPurchaseConfirmationEmail = async (email, ticket) => {
    const mailOptions = {
        from: process.env.MAILER_USERNAME,
        to: email, 
        subject: 'Purchase Confirmation - Your Ticket',
        text: `Gracias por tu compra! EL código de tu compra es ${ticket.code} y compraste ${ticket.amount}.`,
        html: `Gracias por tu compra!<br>EL código de tu compra es ${ticket.code}y compraste${ticket.amount}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
