import type { ParserPlugin } from "@f-wiki/markdown-parser";

// [[문서제목]] → /d/문서제목 링크로 변환하는 인라인 플러그인

const WIKI_LINK_RE = /^\[\[([^\]]+)\]\]/;

export const wikiLinkPlugin: ParserPlugin = {
  inline(src) {
    const m = WIKI_LINK_RE.exec(src);
    if (!m || !m[1]) return null;

    const title = m[1].trim();

    return {
      node: {
        type: "link",
        url: `/d/${encodeURIComponent(title)}`,
        title: null,
        children: [{ type: "text", value: title }],
      },
      length: m[0].length,
    };
  },
};
