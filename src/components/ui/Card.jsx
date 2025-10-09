import { cn } from '@/utils/cn';

export const Card = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-200',
    elevated: 'rounded-xl border bg-elevated text-elevated-foreground shadow-lg hover:shadow-xl transition-all duration-200',
    surface: 'rounded-xl border bg-surface text-surface-foreground shadow-sm hover:shadow-md transition-all duration-200',
    gradient: 'rounded-xl border bg-gradient-to-br from-card to-surface text-card-foreground shadow-lg hover:shadow-xl transition-all duration-200',
    interactive: 'rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer',
  };
  
  return (
    <div
      className={cn(
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export const CardHeader = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col space-y-2 p-4 sm:p-6', className)}
    {...props}
  />
);

export const CardTitle = ({ className, size = 'default', ...props }) => {
  const sizes = {
    sm: 'text-lg font-semibold leading-tight tracking-tight',
    default: 'text-xl sm:text-2xl font-bold leading-tight tracking-tight',
    lg: 'text-2xl sm:text-3xl font-bold leading-tight tracking-tight',
  };
  
  return (
    <h3
      className={cn(
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const CardDescription = ({ className, ...props }) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn('p-4 sm:p-6 pt-0', className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div
    className={cn('flex items-center p-4 sm:p-6 pt-0', className)}
    {...props}
  />
);
