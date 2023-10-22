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
  className,
}: {
  readonly code: string;
  readonly type: 'light' | 'dark';
  readonly className?: string | undefined;
}) {
  return (
    <div className={`!my-5 [&>pre]:!p-4 ${className ?? ''}`}>
      <SyntaxHighlighter
        language="typescript"
        style={type === 'light' ? monoBlue : darculaCopy}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
