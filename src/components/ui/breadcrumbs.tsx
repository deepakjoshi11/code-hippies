import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
              {isLast ? (
                <span aria-current="page" className="text-ink-300">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-ink-100">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
