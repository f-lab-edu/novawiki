export function HistoryTableHead() {
  return (
    <div className="grid grid-cols-[60px_60px_60px_120px_120px_100px_1fr_80px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium">
      <div className="text-center">이전</div>
      <div className="text-center">현재</div>
      <div className="text-center">버전</div>
      <div className="text-center">수정일시</div>
      <div className="text-center">사용자</div>
      <div className="text-center">작업내용</div>
      <div className="text-center">코멘트</div>
      <div className="text-center">보기</div>
    </div>
  );
}
