"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import dynamically to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@thobn24h/reactjs-tiptap-editor").then((mod) => mod.RichTextEditor),
  { ssr: false }
);

interface TiptapEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ initialContent = "", onChange }: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[300px] border rounded-md shadow-sm">
      <RichTextEditor
        content={initialContent || ""} // always a string
        onChange={(html) => onChange(html)}
      />
    </div>
  );
}
