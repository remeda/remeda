import type { SignatureParams } from './Parameters';

type JsTagProps = SignatureParams['args'][number];

export function JsTag({ name, description }: JsTagProps) {
  return (
    <div>
      <code>{name}</code> {description}
    </div>
  );
}
