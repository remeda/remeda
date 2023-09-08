import type { FunctionsData } from '../scripts/transform';
import { Badge } from './Badge';
import { CodeBlock } from './CodeBlock';
import { Parameters } from './Parameters';

export function FnDoc({ name, description, methods }: FunctionsData[number]) {
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
          {description !== undefined && (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {methods.map((method, i) => {
            const { args, returns, tag, signature, example } = method;
            return (
              <div key={i}>
                {tag !== undefined && (
                  <div>
                    <Badge>{tag}</Badge>
                  </div>
                )}
                {signature !== undefined && (
                  <CodeBlock type="light" code={signature} />
                )}
                <Parameters args={args} returns={returns} />
                {example !== undefined && (
                  <CodeBlock type="dark" code={example} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
