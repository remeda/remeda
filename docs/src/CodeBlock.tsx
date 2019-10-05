import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula, monoBlue } from 'react-syntax-highlighter/styles/hljs';

export interface CodeBlockProps {
  code: string;
  type: 'light' | 'dark';
}

const darculaCopy = {
  ...darcula,
  'hljs-comment': { color: '#de6' },
};

export function CodeBlock({ code, type }: CodeBlockProps) {
  return (
    <div className="code-wrapper">
      <SyntaxHighlighter
        language="typescript"
        style={type === 'light' ? monoBlue : darculaCopy}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
