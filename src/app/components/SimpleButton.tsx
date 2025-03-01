import React from "react";

export function SimpleButton({
  width,
  children,
  ...buttonProps
}: {
  children: React.ReactNode;
  width: "small" | "medium" | "large" | "full";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const widthClass = {
    small: "w-20",
    medium: "w-32",
    large: "w-48",
    full: "w-full",
  }[width];

  return (
    <button
      className={`${widthClass} mt-4 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition duration-200`}
      {...buttonProps} // ここで type も適用される
    >
      {children}
    </button>
  );
}
