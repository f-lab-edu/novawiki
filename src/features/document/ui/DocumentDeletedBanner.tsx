import Link from "next/link";

export function DocumentDeletedBanner({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700 px-4 py-3 text-sm">
      <span className="font-semibold text-red-800 dark:text-red-300">
        삭제된 문서입니다
      </span>
      <Link
        href={`/h/${id}`}
        className="text-red-700 dark:text-red-400 hover:underline shrink-0"
      >
        역사 보기
      </Link>
    </div>
  );
}
