export default function Loading() {
  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 제목 스켈레톤 */}
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />

      {/* 콘텐츠 블록 스켈레톤 */}
      <div className="flex flex-col gap-2">
        <div className="h-5 w-full rounded bg-muted animate-pulse" />
        <div className="h-5 w-full rounded bg-muted animate-pulse" />
        <div className="h-5 w-full rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
