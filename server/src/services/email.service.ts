import nodemailer from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.warn(`Email not sent to ${to}. SMTP credentials not configured.`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Rent Finder" <${env.EMAIL_FROM}>`,
        to,
        subject,
        html,
      });
      console.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendHighCompatibilityNotification(to: string, tenantName: string, listingTitle: string, score: number) {
    const subject = `High Compatibility Match for your listing: ${listingTitle}`;
    const html = `
      <h1>Great News!</h1>
      <p>We found a highly compatible tenant (<strong>${tenantName}</strong>) for your listing "<strong>${listingTitle}</strong>".</p>
      <p>Compatibility Score: <strong>${score}/100</strong></p>
      <p>Log in to your dashboard to view their profile and connect!</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendInterestAccepted(to: string, listingTitle: string) {
    const subject = `Your interest in ${listingTitle} was accepted!`;
    const html = `
      <h1>Interest Accepted</h1>
      <p>The owner of "<strong>${listingTitle}</strong>" has accepted your interest.</p>
      <p>You can now chat with them directly through the platform.</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendInterestDeclined(to: string, listingTitle: string) {
    const subject = `Update on your interest in ${listingTitle}`;
    const html = `
      <h1>Interest Update</h1>
      <p>Unfortunately, the owner of "<strong>${listingTitle}</strong>" has declined your interest.</p>
      <p>Don't worry, there are many other great listings waiting for you!</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendListingFilled(to: string, listingTitle: string) {
    const subject = `Listing Filled: ${listingTitle}`;
    const html = `
      <h1>Listing Update</h1>
      <p>The listing "<strong>${listingTitle}</strong>" you showed interest in has been marked as filled.</p>
      <p>We wish you the best of luck in finding another great place.</p>
    `;
    return this.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();
