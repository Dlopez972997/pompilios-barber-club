import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconArrow } from "../Icons";

type Props = {
  children: ReactNode;
  variant?: "primary" | "outline";
  to?: string;
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Button({
  children,
  variant = "primary",
  to,
  href,
  external,
  type = "button",
  disabled,
  full,
  arrow,
  className = "",
  onClick,
}: Props) {
  const classNames = ["btn", `btn-${variant}`, full ? "btn-full" : "", className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {arrow ? <IconArrow /> : null}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classNames} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a
        className={classNames}
        href={href}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classNames} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}
