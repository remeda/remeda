import type { FunctionsData } from '../scripts/transform';

type Param = FunctionsData[number]['methods'][number]['args'][number];

export function JsTag({ name, description }: Param) {
  return (
    <div>
      <code>{name}</code> {description}
    </div>
  );
}
