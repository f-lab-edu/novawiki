import { DocumentType } from "@/entities";
import { extractContentPreview, getRelativeTime } from "@/lib/utils/common";
import Link from "next/link";

type HomeCardProps = {
  index: number;
  doc: DocumentType;
};

export function HomeCard({ index, doc }: HomeCardProps) {
  return (
    <Link
      href={`/d/${doc.title}`}
      className="flex items-start gap-5 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <span className="text-2xl font-bold text-muted-foreground/40 w-8 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base">{doc.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {extractContentPreview(doc.content)}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{doc.user?.nick}</span>
          <span>·</span>
          <span>{getRelativeTime(doc.updated_at)}</span>
        </div>
      </div>
    </Link>
  );
}
