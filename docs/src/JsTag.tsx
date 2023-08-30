import { type ParamData } from './FunctionsData';

export function JsTag({ name, description }: ParamData) {
  return (
    <div>
      <code>{name}</code> {description}
    </div>
  );
}
