import { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return <div className="badge badge-dark">{children}</div>;
}
