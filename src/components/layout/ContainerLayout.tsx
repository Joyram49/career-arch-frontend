import { cn } from '@lib/utils';
import React from 'react';

const ContainerLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element => {
  return <div className={cn('container mx-auto px-4', className)}>{children}</div>;
};

export default ContainerLayout;
