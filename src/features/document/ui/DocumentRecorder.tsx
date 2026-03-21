"use client";

import { useEffect } from "react";
import { incrementView } from "@/app/actions/document";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

type DocumentRecorderProps = {
  primaryTitle: string;
};

export function DocumentRecorder({ primaryTitle }: DocumentRecorderProps) {
  useEffect(() => {
    incrementView(
      encodeURIComponent(
        tanslatePrimaryTitle(decodeURIComponent(primaryTitle)),
      ),
    );
  }, [primaryTitle]);

  return null;
}
