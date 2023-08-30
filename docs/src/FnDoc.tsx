import { Badge } from './Badge';
import { CodeBlock } from './CodeBlock';
import { type FunctionData } from './FunctionsData';
import { Parameters } from './Parameters';

export function FnDoc(props: FunctionData) {
  const { name, description, methods } = props;
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
          <div
            dangerouslySetInnerHTML={
              description === undefined ? undefined : { __html: description }
            }
          />
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
