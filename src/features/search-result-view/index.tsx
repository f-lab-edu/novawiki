"use client";

import { useState } from "react";
import type { ApiResponse, DocumentType, SearchResponse } from "@/entities";
import { SearchResultSection } from "../search-result-section";

type SearchResultViewProps = {
  initialTitle: DocumentType[];
  titleTotal: number;
  initialContent: DocumentType[];
  contentTotal: number;
  searchQuery: string;
};

export function SearchResultView({
  initialTitle,
  titleTotal,
  initialContent,
  contentTotal,
  searchQuery,
}: SearchResultViewProps) {
  const [titleDocs, setTitleDocs] = useState(initialTitle);
  const [titlePage, setTitlePage] = useState(0);
  const [titleLoading, setTitleLoading] = useState(false);

  const [contentDocs, setContentDocs] = useState(initialContent);
  const [contentPage, setContentPage] = useState(0);
  const [contentLoading, setContentLoading] = useState(false);

  const loadMoreTitle = async () => {
    setTitleLoading(true);
    try {
      const nextPage = titlePage + 1;
      const res = await fetch(
        `/api/document/search?q=${encodeURIComponent(searchQuery)}&type=title&page=${nextPage}`,
      );
      const json: ApiResponse<SearchResponse<DocumentType>> = await res.json();
      if (json.success && json.data) {
        setTitleDocs((prev) => [...prev, ...json.data!.title.docs]);
        setTitlePage(nextPage);
      }
    } finally {
      setTitleLoading(false);
    }
  };

  const loadMoreContent = async () => {
    setContentLoading(true);
    try {
      const nextPage = contentPage + 1;
      const res = await fetch(
        `/api/document/search?q=${encodeURIComponent(searchQuery)}&type=content&page=${nextPage}`,
      );
      const json: ApiResponse<SearchResponse<DocumentType>> = await res.json();
      if (json.success && json.data) {
        setContentDocs((prev) => [...prev, ...json.data!.content.docs]);
        setContentPage(nextPage);
      }
    } finally {
      setContentLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <SearchResultSection
        title={`'${searchQuery}'에 대한 문서명 검색 결과`}
        results={titleDocs}
        hasMore={titleDocs.length < titleTotal}
        onLoadMore={loadMoreTitle}
        isLoading={titleLoading}
        searchQuery={searchQuery}
      />

      <SearchResultSection
        title={`'${searchQuery}'에 대한 문서내용 검색 결과`}
        results={contentDocs}
        hasMore={contentDocs.length < contentTotal}
        onLoadMore={loadMoreContent}
        isLoading={contentLoading}
        searchQuery={searchQuery}
      />
    </div>
  );
}
