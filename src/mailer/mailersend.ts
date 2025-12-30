/**
 * MailerSend メール送信モジュール
 *
 * 環境変数:
 * - MAILERSEND_API_KEY: MailerSend API キー
 * - MAILERSEND_FROM_EMAIL: 送信元メールアドレス
 * - MAILERSEND_FROM_NAME: 送信元名（オプション）
 */

const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

type SendEmailOptions = {
  to: {
    email: string;
    name?: string;
  };
  subject: string;
  html: string;
  text?: string;
};

type MailerSendResponse = {
  success: boolean;
  messageId?: string;
  error?: string;
};

/**
 * MailerSend でメールを送信
 */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<MailerSendResponse> {
  const apiKey = Deno.env.get("MAILERSEND_API_KEY");
  const fromEmail = Deno.env.get("MAILERSEND_FROM_EMAIL");
  const fromName = Deno.env.get("MAILERSEND_FROM_NAME") || "React Auth Demo";

  if (!apiKey) {
    console.error("❌ MAILERSEND_API_KEY が設定されていません");
    return { success: false, error: "MAILERSEND_API_KEY is not set" };
  }

  if (!fromEmail) {
    console.error("❌ MAILERSEND_FROM_EMAIL が設定されていません");
    return { success: false, error: "MAILERSEND_FROM_EMAIL is not set" };
  }

  const body = {
    from: {
      email: fromEmail,
      name: fromName,
    },
    to: [
      {
        email: options.to.email,
        name: options.to.name || options.to.email,
      },
    ],
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ""),
  };

  try {
    const response = await fetch(MAILERSEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      // MailerSend は成功時に 202 Accepted を返す
      const messageId = response.headers.get("X-Message-Id") || undefined;
      console.log(`✅ メール送信成功: ${options.to.email}`);
      return { success: true, messageId };
    }

    const errorBody = await response.text();
    console.error(`❌ メール送信失敗: ${response.status}`, errorBody);
    return { success: false, error: `HTTP ${response.status}: ${errorBody}` };
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
): Promise<MailerSendResponse> {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">メールアドレスの確認</h1>
      <p>アカウント登録ありがとうございます。</p>
      <p>以下のボタンをクリックして、メールアドレスを確認してください。</p>
      <p style="margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          メールアドレスを確認
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">
        ボタンが機能しない場合は、以下のURLをブラウザにコピーしてください：<br>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        このメールに心当たりがない場合は、無視してください。
      </p>
    </div>
  `;

  return await sendEmail({
    to,
    subject: "【React Auth Demo】メールアドレスの確認",
    html,
  });
}
