import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseConfig } from "./config.ts";

// Firebase アプリの初期化（重複初期化を防ぐ）
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];
const auth = getAuth(app);

export { auth };

// サインアップ（新規ユーザー作成 + 確認メール送信）
export async function firebaseSignup(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // 確認メールを送信
    await sendEmailVerification(user);

    return {
      success: true,
      message: "確認メールを送信しました。メールを確認してください。",
      user,
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    let message = "エラーが発生しました";

    switch (firebaseError.code) {
      case "auth/email-already-in-use":
        message = "このメールアドレスは既に使用されています";
        break;
      case "auth/invalid-email":
        message = "無効なメールアドレスです";
        break;
      case "auth/weak-password":
        message = "パスワードは6文字以上にしてください";
        break;
      default:
        message = firebaseError.message || "エラーが発生しました";
    }

    return { success: false, message };
  }
}

// ログイン
export async function firebaseLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // ユーザー情報をリロードして最新の emailVerified を取得
    await user.reload();

    if (!user.emailVerified) {
      // 未確認の場合はサインアウト
      await signOut(auth);
      return {
        success: false,
        message:
          "メールアドレスが確認されていません。確認メールを確認してください。",
      };
    }

    return {
      success: true,
      message: "ログインしました",
      user,
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    let message = "エラーが発生しました";

    switch (firebaseError.code) {
      case "auth/user-not-found":
        message = "ユーザーが見つかりません";
        break;
      case "auth/wrong-password":
        message = "パスワードが間違っています";
        break;
      case "auth/invalid-credential":
        message = "メールアドレスまたはパスワードが間違っています";
        break;
      case "auth/invalid-email":
        message = "無効なメールアドレスです";
        break;
      case "auth/user-disabled":
        message = "このアカウントは無効化されています";
        break;
      case "auth/too-many-requests":
        message =
          "ログイン試行回数が多すぎます。しばらく待ってから再試行してください";
        break;
      default:
        console.error("Unknown error code:", firebaseError.code);
        message = firebaseError.message || "エラーが発生しました";
    }

    return { success: false, message };
  }
}

// ログアウト
export async function firebaseLogout(): Promise<void> {
  await signOut(auth);
}

// 認証状態の監視
export function onAuthChange(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}

// 確認メールの再送信
export async function resendVerificationEmail(): Promise<
  { success: boolean; message: string }
> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, message: "ログインしていません" };
  }

  try {
    await sendEmailVerification(user);
    return { success: true, message: "確認メールを再送信しました" };
  } catch (error: unknown) {
    const firebaseError = error as { message?: string };
    return {
      success: false,
      message: firebaseError.message || "エラーが発生しました",
    };
  }
}

// パスワードリセットメールの送信
export async function sendPasswordReset(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message:
        "パスワードリセットメールを送信しました。メールを確認してください。",
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    let message = "エラーが発生しました";

    switch (firebaseError.code) {
      case "auth/user-not-found":
        message = "このメールアドレスは登録されていません";
        break;
      case "auth/invalid-email":
        message = "無効なメールアドレスです";
        break;
      default:
        message = firebaseError.message || "エラーが発生しました";
    }

    return { success: false, message };
  }
}
