import type { FunctionsData } from '../scripts/transform';
import { Badge } from './Badge';
import { CodeBlock } from './CodeBlock';
import { Parameters } from './Parameters';

export function FnDoc({ name, description, methods }: FunctionsData[number]) {
  return (
    <div className="card mb-3">
      <a id={name} />
      <div className="card-body">
        <h3 className="card-title text-3xl font-medium">
          {name}{' '}
          {methods[0].indexed && (
            <small className="text-xs">
              <div className=" badge bg-[#d49a6a] text-white">indexed</div>
            </small>
          )}{' '}
          {methods[0].pipeable && (
            <small className="text-xs">
              <div className=" badge bg-[#565695] text-white">pipeable</div>
            </small>
          )}{' '}
          {methods[0].strict && (
            <small className="text-xs">
              <div className=" badge bg-[#f44336] text-white">strict</div>
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
                  <CodeBlock type="light" code={signature} className="-mx-5" />
                )}
                <Parameters args={args} returns={returns} />
                {example !== undefined && (
                  <CodeBlock type="dark" code={example} className="-mx-5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
