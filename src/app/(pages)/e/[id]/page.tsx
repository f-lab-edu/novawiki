import { WikiEditor } from "@/features";

export default function Edit() {
  return (
    <div>
      <div>
        <input type="text" placeholder="문서 제목 입력" />
      </div>
      <WikiEditor content="" />
    </div>
  );
}
