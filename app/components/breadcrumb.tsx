import { cn } from "~/utils/cn";
import { Link } from "./link";

export function BreadCrumb({
  homeLabel = "Home",
  page,
  className,
  style
}: {
  homeLabel?: string;
  page: string;
  className?: string;
  style?:React.CSSProperties
}) {
  return (
    <div 
      className={cn("flex items-center gap-2 text-body-subtle", className)}
      style={style}
      >
      <Link to="/" className="underline-offset-4 hover:underline">
        {homeLabel}
      </Link>
      <span>/</span>
      <span>{page}</span>
    </div>
  );
}
