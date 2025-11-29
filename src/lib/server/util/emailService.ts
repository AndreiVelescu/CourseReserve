import { Transporter, createTransport } from 'nodemailer';

let transporter: Transporter | null = null;


export const getEmailService = () => {
    if (!process.env.SENDER_EMAIL && !process.env.SENDER_EMAIL_PASSWORD) {
        throw new Error('Please provide sender email and password');
    }

    if (transporter) {
        return transporter;
    }

    transporter = createTransport({
        service: 'gmail', // or another email service like 'smtp'
        auth: {
            user: process.env.SENDER_EMAIL, // your email
            pass: process.env.SENDER_EMAIL_PASSWORD   // your email password or app password
        }
    });

    return transporter;
};