import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  darcula,
  monoBlue,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const darculaCopy = {
  ...darcula,
  'hljs-comment': { color: '#de6' },
};

export function CodeBlock({
  code,
  type,
}: {
  readonly code: string;
  readonly type: 'light' | 'dark';
}) {
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
