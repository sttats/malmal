import Link from "next/link";
import type { ReactNode } from "react";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-white/10 bg-black/75 px-4 pb-3 pt-4 backdrop-blur md:mx-0 md:rounded-b-3xl">
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-accent text-xs font-black text-white">
              MM
            </span>
            malmal
          </Link>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/65">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
