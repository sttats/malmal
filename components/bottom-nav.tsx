"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "ホーム", icon: HomeIcon },
  { href: "/upload", label: "投稿", icon: UploadIcon },
  { href: "/mypage", label: "マイページ", icon: UserIcon }
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 4 7.5 8.5h3v5h3v-5h3L12 4Zm-6 11h12v4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/86 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-3xl border border-white/10 bg-white/5 p-2 shadow-card">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-24 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                isActive ? "bg-white text-ink" : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
