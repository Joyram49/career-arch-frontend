import { cn } from '@lib/utils';

const ContainerLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('container mx-auto px-4', className)}>{children}</div>;
};

export default ContainerLayout;
