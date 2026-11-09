import Link from "next/link";
import type { GuideDefinition } from "@/features/guides/registry";

export function GuideCard({
  guide,
  index,
}: {
  guide: GuideDefinition;
  index: number;
}) {
  return (
    <Link className="guide-card" href={`/guides/${guide.slug}`}>
      <div className="guide-card-topline">
        <span className="eyebrow">DEVELOPER GUIDE / 0{index + 1}</span>
        <span className="guide-read-time">{guide.readMinutes} min read</span>
      </div>
      <h3>{guide.title}</h3>
      <p>{guide.description}</p>
      <span className="tool-card-link">
        Read guide <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
