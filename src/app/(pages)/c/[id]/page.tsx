import WikiDiffViewer from "@/widgets/compare/WikiDiffViewer";

export default function Compare() {
  return (
    <div>
      문서(보기) 페이지
      <WikiDiffViewer
        oldText={`위키는 여러 사람이 함께 문서를 작성하는 시스템이다. 이 문장은 예전 버전이다. 테스트`}
        newText={`위키는 여러 사용자가 함께 문서를 수정하고 관리하는 시스템이다. 이 문장은 최신 버전이다. 테스트22`}
      />
    </div>
  );
}
