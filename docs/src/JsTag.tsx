import * as React from 'react';

export interface JsTagProps {
  name: string;
  description: string;
}

export function JsTag({ name, description }: JsTagProps) {
  return (
    <div>
      <code>{name}</code> {description}
    </div>
  );
}
