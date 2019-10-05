import * as React from 'react';

export interface BadgeProps {
  children: React.ReactChild;
}

export function Badge({ children }: BadgeProps) {
  return <div className="badge badge-dark">{children}</div>;
}
