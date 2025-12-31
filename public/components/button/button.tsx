export function Button(
  { children, className, type = "button", disabled = false, onClick }: {
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
  },
) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-all duration-200 relative overflow-hidden group active:scale-95 transform ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200">
      </span>
    </button>
  );
}
