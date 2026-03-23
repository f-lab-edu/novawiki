"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components";
import { documentQueryOptions, documentVersionQueryOptions } from "@/entities";
import { WikiViewer } from "@/features";
import { addHeadingNumbers } from "@/lib/utils/common";
import { ChatButton } from "./chat/ChatButton";
import { DocumentDeletedBanner } from "./ui/DocumentDeletedBanner";
import { DocumentHead } from "./ui/DocumentHead";
import { DocumentIndex } from "./ui/DocumentIndex";
import { DocumentVersionBanner } from "./ui/DocumentVersionBanner";

type DocumentViewProps = {
  id: string;
  v?: string;
};

export function DocumentView({ id, v }: DocumentViewProps) {
  const isOld = !!v;

  const { data: response } = useQuery(
    isOld ? documentVersionQueryOptions(id, v) : documentQueryOptions(id),
  );

  const doc = response?.data;

  if (!doc) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">
          {isOld
            ? "존재하지 않는 문서이거나, 존재하지 않는 버전입니다."
            : "존재하지 않는 문서입니다."}
        </p>
        <Link href={`/h/${id}`}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            역사 보기
          </Button>
        </Link>
      </div>
    );
  }

  const content = addHeadingNumbers(doc.content);
  const isDisplay = doc.isDisplay;

  return (
    <div className="w-full px-4 sm:px-0 max-w-300 mx-auto flex flex-col gap-8 sm:gap-12 relative">
      {!isDisplay && <DocumentDeletedBanner id={id} />}
      {isOld && isDisplay && <DocumentVersionBanner doc={doc} id={id} />}

      {isDisplay || isOld ? (
        <>
          <DocumentHead doc={doc} isOld={isOld} />

          <div className="flex flex-col-reverse sm:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <WikiViewer content={content} />
            </div>
            <DocumentIndex content={content} />
          </div>

          <ChatButton documentId={doc.id} id={id} />
        </>
      ) : null}
    </div>
  );
}
