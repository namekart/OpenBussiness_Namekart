import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export async function sendInquiryEmails(
    name: string,
    email: string,
    message: string
) {
    // 1. Auto-reply to the user who submitted the form
    const userMailOptions = {
        from: `"OpenBusiness" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thanks for reaching out! We received your message.",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a1a1a;">Hi ${name}, we got your message! 👋</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Thank you for getting in touch with us. We've received your inquiry and our team will get back to you as soon as possible.
        </p>
        <div style="background: #fff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #333; font-style: italic;">"${message}"</p>
        </div>
        <p style="color: #555; font-size: 15px;">
          In the meantime, feel free to explore our platform.
        </p>
        <p style="color: #888; font-size: 13px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
          — The OpenBusiness Team
        </p>
      </div>
    `,
    };

    // 2. Notification to the site owner
    const ownerMailOptions = {
        from: `"OpenBusiness Notifications" <${process.env.EMAIL_USER}>`,
        to: process.env.OWNER_EMAIL,
        subject: `📬 New Inquiry from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee; font-weight: bold; width: 100px;">Name</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee; font-weight: bold;">Email</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee; font-weight: bold;">Message</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #eee;">${message}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 13px; margin-top: 16px; border-top: 1px solid #eee; padding-top: 16px;">
          Submitted at ${new Date().toLocaleString()}
        </p>
      </div>
    `,
    };

    await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(ownerMailOptions),
    ]);
}
