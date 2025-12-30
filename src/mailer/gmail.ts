/**
 * メール送信モジュール（Resend HTTP API）
 *
 * 環境変数:
 * - RESEND_API_KEY: Resend の API キー
 * - EMAIL_FROM: 送信元アドレス（例: onboarding@resend.dev）
 */

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
 * Resend HTTP API でメールを送信
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("EMAIL_FROM") || "onboarding@resend.dev";

  // デバッグログ
  console.log("📧 メール送信開始...");
  console.log("📧 RESEND_API_KEY:", apiKey ? "設定済み" : "未設定");
  console.log("📧 EMAIL_FROM:", fromEmail);

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY が設定されていません");
    return { success: false, error: "RESEND_API_KEY is not set" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to.email,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ""),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Resend API エラー:", errorData);
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    console.log(`✅ メール送信成功: ${options.to.email}`, data);
    return { success: true };
  } catch (error) {
    console.error("❌ メール送信エラー:", error);
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
