"use client";

import Link from "next/link";
import { Button } from "@/components";
import type { DocumentType } from "@/entities";
import { extractContentPreview } from "@/lib/utils/common";

type SearchResultCardProps = {
  doc: DocumentType;
};

export function SearchResultCard({ doc }: SearchResultCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-8 hover:bg-muted/50 transition-colors">
      <Link
        href={`/d/${doc.id}`}
        className="flex flex-col gap-2 cursor-pointer"
      >
        <span className="font-medium">{doc.title}</span>
        <span className="text-muted-foreground">
          {extractContentPreview(doc.content)}
        </span>
      </Link>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <Link href={`/e/${doc.id}`}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            수정
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="cursor-pointer">
          삭제
        </Button>
        <Link href={`/h/${doc.id}`}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            역사
          </Button>
        </Link>
      </div>
    </div>
  );
}
