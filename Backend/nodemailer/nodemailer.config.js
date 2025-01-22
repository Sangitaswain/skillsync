import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },


});

export default transporter;