import Link from "next/link";
import { getRelativeTime } from "@/lib/utils/common";
import type { DocumentType } from "@/types";

type DocumentVersionBannerProps = {
  doc: DocumentType;
  id: string;
};

export function DocumentVersionBanner({ doc, id }: DocumentVersionBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-700 px-4 py-3 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-yellow-800 dark:text-yellow-300">
        <span className="flex gap-3">
          <span className="font-semibold">v{doc.version}</span>
          <span className="text-yellow-600 dark:text-yellow-400">
            {getRelativeTime(doc.created_at)}
          </span>
        </span>
        {doc.profile?.nick && (
          <span className="text-yellow-600 dark:text-yellow-400">
            편집자: {doc.profile.nick}
          </span>
        )}
      </div>
      <div className="flex justify-end items-center gap-3 shrink-0">
        <Link
          href={`/h/${id}`}
          className="text-yellow-700 dark:text-yellow-400 hover:underline"
        >
          역사 보기
        </Link>
        <Link
          href={`/d/${id}`}
          className="text-yellow-700 dark:text-yellow-400 hover:underline font-semibold"
        >
          최신 버전으로
        </Link>
      </div>
    </div>
  );
}
