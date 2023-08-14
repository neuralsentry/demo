"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeBlockProps = {
  code: string;
  language: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <pre>
      <code>
        <SyntaxHighlighter
          className="py-2"
          language={language}
          style={dracula}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </code>
    </pre>
  );
}
