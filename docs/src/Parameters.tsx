import { useState } from 'react';
import type { FunctionsData } from '../scripts/transform';
import { JsTag } from './JsTag';

type FunctionSignature = FunctionsData[number]['methods'][number];
export type SignatureParams = Pick<FunctionSignature, 'args' | 'returns'>;

export function Parameters({ args, returns }: SignatureParams): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <small className="text-xs">
        <a
          className="text-[#007bff]"
          href="javascript:"
          onClick={() => {
            setIsExpanded(current => !current);
          }}
        >
          {isExpanded ? 'Hide' : 'Expand'} parameters
        </a>
      </small>
      {isExpanded && (
        <div>
          <h6 className="mb-2 text-base font-medium">Parameters</h6>
          <div className="mb-3">
            {args.map(data => (
              <JsTag key={data.name} {...data} />
            ))}
          </div>
          <h6 className="mb-2 text-base font-medium">Returns</h6>
          <div className="mb-3">
            <JsTag {...returns} />
          </div>
        </div>
      )}
    </div>
  );
}
