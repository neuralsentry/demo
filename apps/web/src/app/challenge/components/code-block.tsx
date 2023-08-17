"use client";

import clsx from "clsx";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeBlockProps = {
  code: string;
  language: string;
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <code>
      <SyntaxHighlighter
        className={clsx("py-2 syntaxhighlighter", className)}
        language={language}
        style={{
          ...dracula,
          "::webkit-scrollbar": {
            display: "none"
          }
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </code>
  );
}
