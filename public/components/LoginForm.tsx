// ログインフォーム

import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { sendPasswordReset } from "../firebase/auth.ts";
import { Button } from "./button/button.tsx";
import { StyledInput } from "./input/input.tsx";

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
};

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const result = await login(email, password);

    if (result.success) {
      setEmail("");
      setPassword("");
      onSuccess?.();
    } else {
      setError(result.message);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLoading(true);

    const result = await sendPasswordReset(email);

    if (result.success) {
      setMessage(result.message);
      setShowResetForm(false);
    } else {
      setError(result.message);
    }
    setResetLoading(false);
  };

  // パスワードリセットフォーム
  if (showResetForm) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          パスワードをリセット
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          登録したメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </p>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetLoading ? "送信中..." : "リセットメールを送信"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setShowResetForm(false);
            setError("");
          }}
          className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
        >
          ログインに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス
          </label>
          <StyledInput
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード
          </label>
          <StyledInput
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="6文字以上"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => {
          setShowResetForm(true);
          setError("");
          setMessage("");
        }}
        className="mt-3 w-full text-blue-600 hover:underline text-sm"
      >
        パスワードを忘れた場合
      </button>

      {onSwitchToSignup && (
        <p className="mt-4 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline"
          >
            新規登録
          </button>
        </p>
      )}
    </div>
  );
}
