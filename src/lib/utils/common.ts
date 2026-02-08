import { toast } from "sonner";

/** 날짜 포맷팅 함수 (YYYY-MM-DD HH:mm) */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/** 상대성 시간 변환 함수 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "방금 전";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 30) {
    return `${diffDays}일 전`;
  } else if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  } else {
    return `${diffYears}년 전`;
  }
};

/** 미리보기 컨텐츠 추출용 함수 */
export const extractContentPreview = (
  markdown: string,
  maxLength: number = 200
): string => {
  if (!markdown) return "";
  const lines = markdown.split("\n");

  // 첫 번째 제목(# 또는 ##) 이후의 본문 찾기
  let foundTitle = false;
  const bodyLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 제목 라인인지 확인
    if (/^#{1,2}\s+/.test(trimmedLine)) {
      foundTitle = true;
      continue;
    }

    // 제목을 찾은 후의 비어있지 않은 라인 수집
    if (foundTitle && trimmedLine) {
      // 하위 제목(###, ####...)은 건너뛰기
      if (/^#{3,}\s+/.test(trimmedLine)) {
        continue;
      }
      bodyLines.push(trimmedLine);
    }
  }

  // 본문 합치기
  let content = bodyLines.join(" ");

  // 마크다운 특수문자 제거
  content = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크 [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 이미지 제거
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // 인라인 코드, 코드 블록 제거
    .replace(/[*_~`#>]/g, "") // *, _, ~, `, #, > 제거
    .replace(/\|/g, "") // 테이블 구분자 제거
    .replace(/[-+]\s/g, "") // 리스트 마커 제거
    .replace(/\d+\.\s/g, "") // 숫자 리스트 마커 제거
    .replace(/\s+/g, " ") // 연속 공백 하나로
    .trim();

  // 최대 길이로 자르기
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + "...";
  }

  return content;
};

/** 한글 자모 분리 함수 */
export const decomposeKorean = (text: string | null): string => {
  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const JUNG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const JONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  // 데이터 있나 검증
  if (!text) return "";

  let result = "";

  for (const char of text) {
    const code = char.charCodeAt(0);

    // 한글 음절 범위 (가 ~ 힣)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllable = code - 0xac00;
      const choIndex = Math.floor(syllable / (21 * 28));
      const jungIndex = Math.floor((syllable % (21 * 28)) / 28);
      const jongIndex = syllable % 28;

      result += CHO[choIndex] + JUNG[jungIndex] + JONG[jongIndex];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      // 영문, 숫자만 추가 (특수문자, 공백 제외)
      result += char;
    }
  }

  return result;
};

/** 특수문자, 공백 제거 함수 */
export const tanslatePrimaryTitle = (text: string | null): string => {
  if (!text) return "";
  return text.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
};

/** 마크다운 제목 파싱 함수 */
export type HeadingType = "root" | "sub";
export type HeadingItem = { type: HeadingType; title: string };
export const parseHeads = (markdown: string | null): HeadingItem[] => {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const headings: HeadingItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      headings.push({ type: "sub", title: trimmed.slice(3).trim() });
    } else if (trimmed.startsWith("# ")) {
      headings.push({ type: "root", title: trimmed.slice(2).trim() });
    }
  }

  return headings;
};

/** 토스트 */
export const simpleMessageToast = (title: string, desc: string) => {
  toast(title, {
    description: desc,
    action: {
      label: "닫기",
      onClick: () => {},
    },
  });
};
