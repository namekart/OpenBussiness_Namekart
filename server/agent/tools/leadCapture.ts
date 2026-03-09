import { storage } from "../../storage";
import { sendInquiryEmails } from "../../mailer";

/**
 * Save lead as Inquiry and send notification emails (reuse existing mailer).
 * Owner email can include "Source: AI Chat" for clarity.
 */
export async function captureLead(name: string, email: string, query: string): Promise<string> {
  const inquiry = await storage.createInquiry({ name, email, message: query });

  sendInquiryEmails(name, email, query)
    .then(() => {})
    .catch((err) => {
      console.error("Failed to send inquiry emails (AI lead):", err);
    });

  return `Thank you, ${name}. We've received your message and will get back to you at ${email} shortly.`;
}
