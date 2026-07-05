"use client";

import { useMemo, useState } from "react";

type DescriptionPreviewProps = {
  description: string;
};

const PREVIEW_LIMIT = 120;

function buildPreview(description: string) {
  const trimmed = description.trim();
  const [firstLine = ""] = trimmed.split(/\r?\n/);
  const hasMoreLines = trimmed.includes("\n") || trimmed.includes("\r");
  const isLong = firstLine.length > PREVIEW_LIMIT;
  const preview = isLong ? `${firstLine.slice(0, PREVIEW_LIMIT).trimEnd()}...` : firstLine;

  return {
    preview: hasMoreLines || isLong ? `${preview}${hasMoreLines && !preview.endsWith("...") ? "..." : ""}` : preview,
    expandable: hasMoreLines || isLong || trimmed.length > firstLine.length,
    fullText: trimmed,
  };
}

export function DescriptionPreview({ description }: DescriptionPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const { preview, expandable, fullText } = useMemo(() => buildPreview(description), [description]);

  if (!fullText) {
    return null;
  }

  if (!expandable) {
    return <p className="mt-2 text-sm leading-6 text-zinc-400">{preview}</p>;
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((current) => !current)}
      className="mt-2 block w-full text-left text-sm leading-6 text-zinc-400 transition hover:text-zinc-200"
    >
      <span className={expanded ? "whitespace-pre-wrap" : ""}>{expanded ? fullText : preview}</span>
    </button>
  );
}
