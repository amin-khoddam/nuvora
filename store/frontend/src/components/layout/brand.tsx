import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
      <Link
          href="/"
          className={cn(
              "group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring",
              className,
          )}
      >
      <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-accent font-display text-lg font-bold text-primary-foreground shadow-[0_6px_20px_color-mix(in_oklab,var(--brand)_35%,transparent)]"
      >
        N
      </span>
        <span className="font-display text-lg font-semibold">{siteConfig.name}</span>
      </Link>
  );
}