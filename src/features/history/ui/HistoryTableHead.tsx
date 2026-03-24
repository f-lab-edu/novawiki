export function HistoryTableHead() {
  return (
    <div className="grid grid-cols-[25px_25px_25px_50px_50px_80px_30px_50px] sm:grid-cols-[60px_60px_60px_120px_120px_1fr_80px_120px] gap-6 px-3 sm:px-4 py-3 bg-muted/50 text-sm font-medium">
      <div className="text-center shrink-0 w-6.25 sm:w-15">이전</div>
      <div className="text-center shrink-0 w-6.25 sm:w-15">현재</div>
      <div className="text-center shrink-0 w-6.25 sm:w-15">버전</div>
      <div className="text-center shrink-0 w-13 sm:w-30">수정일시</div>
      <div className="text-center shrink-0 w-13 sm:w-30">사용자</div>
      <div className="text-center shrink-0 w-20 sm:w-auto">코멘트</div>
      <div className="text-center shrink-0 w-7.5 sm:w-20">보기</div>
      <div className="text-center shrink-0 w-13 sm:w-30">되돌리기</div>
    </div>
  );
}
