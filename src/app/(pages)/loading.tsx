export default function Loading() {
  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 제목 스켈레톤 */}
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />

      {/* 콘텐츠 블록 스켈레톤 */}
      {[1, 2, 3].map((block) => (
        <div key={block} className="flex flex-col gap-3">
          <div className="h-5 w-full rounded bg-muted animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-5 w-5/6 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
