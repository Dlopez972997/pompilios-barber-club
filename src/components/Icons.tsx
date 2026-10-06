type IconProps = { size?: number };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };
}

export function IconCalendar({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 10h17M8 3.5v3.5M16 3.5v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10.5" r="2.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconPhone({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 4.5h2.2l1.2 3-1.6 1a12 12 0 0 0 5.7 5.7l1-1.6 3 1.2V16a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 6 5.7 2 2 0 0 1 8 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenu({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrow({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevron({ size = 16, direction = "right" }: IconProps & { direction?: "left" | "right" | "down" }) {
  const d =
    direction === "left" ? "M14.5 5.5 8.5 12l6 6.5" : direction === "down" ? "M6 9.5 12 15.5 18 9.5" : "M9.5 5.5 15.5 12l-6 6.5";
  return (
    <svg {...base(size)}>
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconUsers({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.8 18.5a5.2 5.2 0 0 1 10.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 14.2a4.4 4.4 0 0 1 4.2 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconStar({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="m12 3.8 2.1 4.4 4.8.6-3.5 3.3.9 4.8L12 14.8 7.7 17l.9-4.8L5.1 8.8l4.8-.6L12 3.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrophy({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 4.5h8v5.2a4 4 0 0 1-8 0V4.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 6.5H5.5A2.2 2.2 0 0 0 7.2 10M16 6.5h2.5A2.2 2.2 0 0 1 16.8 10M12 13.7V17M9 19.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 16.5 4 19.5V7.2A2.2 2.2 0 0 1 6.2 5h11.6A2.2 2.2 0 0 1 20 7.2v7.1a2.2 2.2 0 0 1-2.2 2.2H6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDiamond({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3.8 20 9.2 12 20.2 4 9.2 12 3.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 9.2h16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconHeart({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 19s-6.5-4.1-6.5-8.2A3.4 3.4 0 0 1 12 8.6a3.4 3.4 0 0 1 6.5 2.2C18.5 14.9 12 19 12 19Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShield({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3.8 19 6.4v5.4c0 4.2-2.8 6.8-7 8.4-4.2-1.6-7-4.2-7-8.4V6.4L12 3.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBolt({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M13 3.5 6.5 13H12l-1 7.5 6.5-9.5H12l1-7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSwap({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M7 7h11l-2.5-2.5M17 17H6l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInstagram({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconFacebook({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M14 8.5h2V5.5h-2c-2.2 0-3.5 1.4-3.5 3.6V11H8.5v3H10.5V20h3v-6h2.2l.5-3H13.5V9.4c0-.6.3-.9.5-.9Z" fill="currentColor" />
    </svg>
  );
}

export function IconTiktok({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M14 5.5c.6 2.2 2 3.6 4.2 4v2.3A6.4 6.4 0 0 1 14.8 11v5.1a4.6 4.6 0 1 1-4-4.6v2.5a2.2 2.2 0 1 0 1.6 2.1V5.5H14Z" fill="currentColor" />
    </svg>
  );
}

export function IconWhatsapp({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 4.2a7.6 7.6 0 0 0-6.6 11.3L4.5 19.8l4.4-.9A7.6 7.6 0 1 0 12 4.2Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.2 9.6c.2 1.6 1.8 3.4 3.6 4.1.4.2.8.1 1.1-.2l.6-.7c.2-.2.4-.2.6-.1l1.4.6c.3.1.3.4.2.6-.4.8-1.2 1.2-2.1 1.1-2.2-.2-4.6-2.2-5.6-4.4-.4-.9-.2-1.6.4-2.2.2-.2.4-.2.6-.1l.8.4c.2.1.3.3.2.5Z" fill="currentColor" />
    </svg>
  );
}
