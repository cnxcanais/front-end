import Link from "next/link";
import clsx from "clsx";

type Props = {
  href: string;
  children: string;
  variant?: 'primary';
  className?: string;
}

export function LinkComponent({ href, children, variant = 'primary', className }: Props) {
  return (
    <>
      {variant === 'primary' && (
        <>
          <Link 
            href={href} 
            className={clsx('text-xs text-beige-100 hover:text-yellow-200', className)}
          >
            {children}
          </Link>
        </>
      )}
    </>
    
  );
}