import * as React from "react";

export interface StyledInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  type: "email" | "password" | "text";
}

// シンプルなSVGアイコン
const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, label, error, type, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const getIcon = () => {
      if (type === "email") return <MailIcon />;
      if (type === "password") return <LockIcon />;
      return null;
    };

    const iconColorClass = isFocused ? "text-blue-600" : "text-gray-400";

    const inputClasses = [
      "flex h-12 w-full rounded-lg border bg-gray-50 px-12 py-3 text-base font-medium text-gray-900",
      "transition-all duration-200 ease-out",
      "placeholder:text-gray-400 placeholder:font-normal",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 hover:border-gray-400",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {/* Icon */}
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${iconColorClass}`}
          >
            {getIcon()}
          </div>

          {/* Input */}
          <input
            type={inputType}
            className={inputClasses}
            ref={ref}
            id={inputId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Password Toggle */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-gray-700 focus:outline-none focus:text-gray-700 ${iconColorClass}`}
              aria-label={showPassword
                ? "パスワードを隠す"
                : "パスワードを表示"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);

StyledInput.displayName = "StyledInput";

export { StyledInput };
