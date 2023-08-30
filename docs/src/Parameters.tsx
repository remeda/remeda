import * as React from 'react';
import { type SignatureData } from './FunctionsData';
import { JsTag } from './JsTag';

export class Parameters extends React.Component<
  Pick<SignatureData, 'args' | 'returns'>,
  { expanded: boolean }
> {
  state = { expanded: false };

  render() {
    const { args, returns } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        <small>
          <a
            href="javascript:"
            onClick={() => {
              this.setState({ expanded: !expanded });
            }}
          >
            {expanded ? 'Hide' : 'Expand'} parameters
          </a>
        </small>

        {expanded && (
          <div>
            <h6>Parameters</h6>
            <div className="mb-3">
              {args.map(data => (
                <JsTag key={data.name} {...data} />
              ))}
            </div>
            <h6>Returns</h6>
            <div className="mb-3">
              <JsTag {...returns} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
