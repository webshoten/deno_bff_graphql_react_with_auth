/**
 * Gmail SMTP メール送信モジュール
 *
 * 環境変数:
 * - GMAIL_USER: Gmail アドレス
 * - GMAIL_APP_PASSWORD: アプリパスワード（2段階認証で生成）
 * - GMAIL_FROM_NAME: 送信者名（オプション）
 */

import { SMTPClient } from "denomailer";

type SendEmailOptions = {
  to: {
    email: string;
    name?: string;
  };
  subject: string;
  html: string;
  text?: string;
};

type SendEmailResult = {
  success: boolean;
  error?: string;
};

/**
 * Gmail SMTP でメールを送信
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  const fromName = Deno.env.get("GMAIL_FROM_NAME") || "React Auth Demo";

  if (!gmailUser) {
    console.error("❌ GMAIL_USER が設定されていません");
    return { success: false, error: "GMAIL_USER is not set" };
  }

  if (!gmailAppPassword) {
    console.error("❌ GMAIL_APP_PASSWORD が設定されていません");
    return { success: false, error: "GMAIL_APP_PASSWORD is not set" };
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: gmailUser,
        password: gmailAppPassword,
      },
    },
  });

  try {
    await client.send({
      from: `${fromName} <${gmailUser}>`,
      to: options.to.email,
      subject: options.subject,
      html: options.html,
      content: options.text || options.html.replace(/<[^>]*>/g, ""),
    });

    await client.close();

    console.log(`✅ メール送信成功: ${options.to.email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ メール送信エラー:", error);
    await client.close();
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * メール認証用のメールを送信
 */
export async function sendVerificationEmail(
  to: { email: string; name?: string },
  verificationUrl: string,
): Promise<SendEmailResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Verify Your Email</h1>
      <p>Thank you for signing up!</p>
      <p>Please click the button below to verify your email address.</p>
      <p style="margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this URL into your browser:<br>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you didn't sign up for this account, please ignore this email.
      </p>
    </div>
  `;

  return await sendEmail({
    to,
    subject: "[React Auth Demo] Verify Your Email",
    html,
  });
}
