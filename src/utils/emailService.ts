import nodemailer from 'nodemailer';
import { CustomError } from './customError';
import { logger } from './logger';

// Create reusable transporter
const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    logger(null, null, 'Email service is ready');
    return transporter;
  } catch (error) {
    logger(null, null, `Email configuration error: ${error}`);
    throw new CustomError('Email service configuration failed', 500);
  }
};

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  try {
    // Create transporter instance
    const transporter = await createTransporter();
    
    // Log email configuration (remove in production)
    logger(null, null, `Using email: ${process.env.EMAIL_USER}`);
    
    const mailOptions = {
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
          <p style="color: #666;">You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 25px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; margin-top: 20px;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger(null, null, `Email sent: ${info.messageId}`);
  } catch (error) {
    logger(null, null, `Email error: ${error}`);
    throw new CustomError('Error sending email. Please try again later.', 500);
  }
};

// Add this function for testing
export const testEmailService = async () => {
  try {
    const transporter = await createTransporter();
    logger(null, null, 'Email service test successful');
    return true;
  } catch (error) {
    logger(null, null, `Email service test failed: ${error}`);
    return false;
  }
}; 