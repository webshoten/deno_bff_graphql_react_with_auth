// サインアップフォーム

import { type FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { Button } from "./button/button.tsx";
import { StyledInput } from "./input/input.tsx";

type SignupFormProps = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signup(name, email, password);

    if (result.success) {
      setName("");
      setEmail("");
      setPassword("");
      onSuccess?.();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">新規登録</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <StyledInput
          type="text"
          id="signup-name"
          label="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="山田 太郎"
        />

        <StyledInput
          type="email"
          id="signup-email"
          label="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@example.com"
        />

        <StyledInput
          type="password"
          id="signup-password"
          label="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="6文字以上"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "登録中..." : "登録する"}
        </Button>
      </form>

      {onSwitchToLogin && (
        <p className="mt-4 text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            ログイン
          </button>
        </p>
      )}
    </div>
  );
}
