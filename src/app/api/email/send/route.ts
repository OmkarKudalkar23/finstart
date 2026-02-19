import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Configure Nodemailer transporter
        // NOTE: In a production app, use environment variables for these credentials
        // For this demo, we will check if env vars exist, otherwise we might fail or log.
        // The user requested a "proper script", so we assume they will provide credentials.

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Finstart Banking" <no-reply@finstart.com>',
            to: email,
            subject: 'Welcome to Finstart - Your Onboarding Journey Begins',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #6366f1;">Finstart</h1>
                    </div>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for choosing Finstart! We are excited to have you on board.</p>
                    <p>You have successfully initiated your account registration. We are now processing your details to ensure a secure and seamless banking experience.</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #666;"><strong>Next Steps:</strong></p>
                        <ul style="font-size: 14px; color: #666;">
                            <li>Complete your profile details</li>
                            <li>Verify your identity (KYC)</li>
                            <li>Set up your financial preferences</li>
                        </ul>
                    </div>
                    <p>If you have any questions, our support team is here to help.</p>
                    <p>Welcome to the future of banking!</p>
                    <br>
                    <p style="font-size: 12px; color: #999;">Best regards,<br>The Finstart Team</p>
                </div>
            `,
        };

        // If credentials are not set, we simulate a sent email to avoid crashing the demo
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("⚠️ SMTP credentials not found in .env. Email simulation mode.");
            console.log("To: ", email);
            console.log("Subject: ", mailOptions.subject);
            return NextResponse.json({ success: true, message: 'Email simulated (missing credentials)' });
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
