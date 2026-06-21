import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "priority" | "category" | "tag";
}

export default function Badge({
  children,
  variant = "tag",
}: BadgeProps) {
  return (
    <span
      data-badge-type={variant}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        marginRight: "6px",
        borderRadius: "12px",
        backgroundColor: "#eeeeee",
      }}
    >
      {children}
    </span>
  );
}
