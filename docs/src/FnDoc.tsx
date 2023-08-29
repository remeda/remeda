import { marked, type MarkedOptions } from 'marked';
import { useMemo } from 'react';
import { Badge } from './Badge';
import { CodeBlock } from './CodeBlock';
import { JsTagProps } from './JsTag';
import { Parameters } from './Parameters';
import DOMPurify from 'dompurify';

const MARKED_OPTIONS: MarkedOptions = {
  breaks: true,
  gfm: true,
} as const;

export interface MethodDoc {
  tag: string;
  signature: string;
  example: string;
  args: Array<JsTagProps>;
  returns: JsTagProps;
  indexed: boolean;
  pipeable: boolean;
  strict: boolean;
}

export interface FnDocProps {
  readonly name: string;
  readonly shortText: string;
  readonly text?: string;
  readonly methods: ReadonlyArray<MethodDoc>;
}

export function FnDoc(props: FnDocProps) {
  const { name, text, shortText, methods } = props;

  const descriptionHtml = useMemo(
    () =>
      DOMPurify.sanitize(
        marked(`${shortText}\n${text ?? ''}`.trim(), MARKED_OPTIONS)
      ),
    [shortText, text]
  );

  return (
    <div className="card mb-3">
      <a id={name} />
      <div className="card-body">
        <h3 className="card-title">
          {name}{' '}
          {methods[0].indexed && (
            <small>
              <div className=" badge indexed-color">indexed</div>
            </small>
          )}{' '}
          {methods[0].pipeable && (
            <small>
              <div className=" badge pipeable-color">pipeable</div>
            </small>
          )}{' '}
          {methods[0].strict && (
            <small>
              <div className=" badge strict-color">strict</div>
            </small>
          )}
        </h3>
        <div className="card-text">
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          {methods.map((method, i) => {
            const { args, returns, tag, signature, example } = method;
            return (
              <div key={i}>
                <div>
                  <Badge>{tag}</Badge>
                </div>
                <CodeBlock type="light" code={signature} />
                <Parameters args={args} returns={returns} />
                <CodeBlock type="dark" code={example} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
