import type { ComponentProps } from 'react';

export function EchoClassLogo({ className, ...props }: ComponentProps<'img'>) {
  return <img src="/echoclass-mark.svg" alt="EchoClass" className={className} {...props} />;
}
