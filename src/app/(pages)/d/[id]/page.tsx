import { Button } from "@/components";
import { WikiViewer } from "@/features";

export default function Document() {
  return (
    <div>
      {/* 제목, 문서정보, 버튼박스 */}
      <div>
        <div>
          <h1>문서제목</h1>
          <div>
            <Button>수정</Button>
            <Button>삭제</Button>
            <Button>역사</Button>
          </div>
        </div>
        <div>
          <div>최종수정 : 2026-01-01</div>
        </div>
      </div>
      {/* 문서 내용 */}
      <div>
        <div>
          <WikiViewer content="# 테스트 제목" />
        </div>
      </div>
      {/* 목차 */}
      <nav>
        <h3>목차</h3>
        <ol>
          <li>개요</li>
          <li>사건사고</li>
          <li>여담</li>
        </ol>
      </nav>
    </div>
  );
}
